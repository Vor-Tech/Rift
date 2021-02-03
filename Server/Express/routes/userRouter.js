import express from 'express';
const router = express.Router();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

import User from "../../../Database/models/userModel.js";
import FriendRequest from "../../../Database/models/friendRequestModel.js";

let userIncrement = 0;

//register user
router.post("/", async (req, res) => {
    try {
        let { email, password, passwordCheck, displayName, icon } = req.body;

        //validate

        const existingUser = await User.findOne({email: email});
        if(existingUser) return res.status(400).json({msg: "An account with this email already exists."})
        if(!email || email?.split('@').length == 1) return res.status(400).json({msg: "Invalid Email"});
        if(!password) return res.status(400).json({msg: "No password was supplied"});
        if(!passwordCheck || password !== passwordCheck) return res.status(400).json({msg: "Password check was not valid"});
        if(!displayName) displayName = email.split('@')[0];
        if(!icon) icon = (acronym) => displayName.split(' ').forEach(word_idx => acronym.push(word_idx[0]));
        if(password.length < 6) return res.status(400).json({msg: "Password must be at least 5 characters long"});

        //crypt
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)
        
        //increment user counter
        userIncrement++;

    //  ##############
    //  ## user gen ##
    //  ##############

        //generate id
        let id = (Date.now() + process.pid + userIncrement);

        //generate discriminator
        let discriminator = Math.floor(Math.random()*90000) + 10000;

        //create new user object
        const newUser = new User({
            id,
            email,
            password: passwordHash,
            displayName,
            discriminator,
            created_at: new Date().toUTCString()
        });

        //save new user to database
        const savedUser = await newUser.save();
        
        //filter out sensitive information from response object
        let resUser = {
            id: savedUser.id,
            email: savedUser.email,
            displayName: savedUser.displayName,
            discriminator: savedUser.discriminator,
        };

        //send response
        res.json(resUser);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"});
        console.error(`[${new Date().toLocaleTimeString()}]`, err);
    }
})

//login
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
       

        //validate
        const user = await User.findOne({email: email});
        if(!user) return res.status(400).json({msg: "Invalid credentials."});
        if(!email) return res.status(400).json({msg: "No email was supplied"});
        if(!password) return res.status(400).json({msg: "No password was supplied"});

        const passMatch = await bcrypt.compare(password, user.password);
        if(!passMatch) return res.status(400).json({msg: "Invalid credentials."});
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        if(passMatch === true) {
            res.json({
                token,
                user: {
                    id: user.id,
                    displayName: user.displayName,
                    discriminator: user.discriminator,
                    email: user.email,
                },
            });
        }
    } 
    catch (err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
});

//validate token
router.get("/validate-token", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if(!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if(!user) return res.json(false);

        return res.json(true);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
})

//resolve token to user
router.get("/resolve-token", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if(!token) return res.json({token_provided: false});

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.json({valid_token: false});

        const user = await User.findById(verified.id);
        if(!user) return res.json({valid_user: false});
        let resUser = {
            icon: user.icon,
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            discriminator: user.discriminator
        } 
        res.json(resUser);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
})

//send friend request
router.post("/:sender/relationships/:recipient/pending", async (req, res) => { //TODO, make sure recipient does not have sender blocked
    const sender = req.params.sender;
    const recipient = req.params.recipient;

    console.log(sender, recipient);

    const newFriendRequest = new FriendRequest({
        date: new Date().toUTCString(),
        from_to: [sender, recipient]
    });

    let senderObj = await User.findOne({id: sender});
    try{
        let senderUpdatedRequests = senderObj.friend_requests.push(newFriendRequest)
        
        let recipientObj = await User.findOne({id: recipient});
        let recipientUpdatedRequests = recipientObj.friend_requests.push(newFriendRequest);

        let resSender = await User.findOneAndUpdate({id: sender}, {$set: {friend_requests: senderUpdatedRequests}});
        let resRecipient = await User.findOneAndUpdate({id: recipient}, {$set: {friend_requests: recipientUpdatedRequests}})

        if(!resSender || ! resRecipient) return res.status(400).json({msg: "Internal server error."});
        return res.status(200).json(resSender.friend_requests);
    }
    catch (err) {
        console.log(err);
    }
});

//cancel friend request
router.delete("/:sender/relationships/:recipient/pending", async (req, res) => {
    const sender = req.params.sender;
    const recipient = req.params.recipient;

    let senderObj = await User.findOne({id: sender});
    let senderFriendRequests = senderObj.friend_requests.forEach((friend, idx, object) => {
        if(friend.id == recipient){
            object.splice(idx, 1);
        }
    });

    let recipientObj = await User.findOne({id: recipient});
    let recipientFriendRequests = recipientObj.friend_requests.forEach((friend, idx, object) => {
        if(friend.id == sender){
            object.splice(idx, 1);
        }
    });

    let resSender = await User.findByIdAndUpdate({id: sender}, {
        $set: {friends_requests: senderFriendRequests}
    }).catch(err => {
        console.log('[',new Date().toUTCString(),']', err)
        return res.status(400).json({msg: "Internal server error.", reason: err})
    });

    let resRecipient = await User.findOneAndUpdate({id: recipient}, {
        $set: {friend_requests: recipientFriendRequests}
    }).catch(err => {
        console.log('[',new Date().toUTCString(),']', err)
        return res.status(400).json({msg: "Internal server error.", reason: err})
    });

    if(!resSender || ! resRecipient) return res.status(400).json({msg: "Internal server error."});
    res.status(200);
});

//remove friend
// router.delete("/:sender/relationships/:recipient", async (req, res) => { //remove friend
//     const sender = req.params.sender;
//     const recipient = req.params.recipient;

//     let senderObj = await User.findOne({id: sender});
//     let senderFriends = senderObj.friends.forEach((friend, idx, object) => {
//         if(friend.id == recipient){
//             object.splice(idx, 1);
//         }
//     });

//     let recipientObj = await User.findOne({id: recipient});
//     let recipientFriends = recipientObj.friends.forEach((friend, idx, object) => {
//         if(friend.id == sender){
//             object.splice(idx, 1);
//         }
//     });

//     let resSender = await User.findByIdAndUpdate({id: sender}, {
//         $set: {friends: senderFriends}
//     }).catch(err => {
//         console.log('[',new Date().toUTCString(),']', err)
//         return res.status(400).json({msg: "Internal server error.", reason: err})
//     });

//     let resRecipient = await User.findOneAndUpdate({id: recipient}, {
//         $set: {friends: recipientFriends}
//     }).catch(err => {
//         console.log('[',new Date().toUTCString(),']', err)
//         return res.status(400).json({msg: "Internal server error.", reason: err})
//     });

//     if(!resSender || !resRecipient) return res.status(400).json({msg: "Internal server error"});
    
//     return res.status(200);
// });

//block
router.post("/:sender/relationships/:recipient/block", async (req, res) => {
    const sender = req.params.sender;
    const recipient = req.params.recipient;

    console.log(sender, recipient);
    
    let senderObj = await User.findOne({id: sender});
    let senderFriends = senderObj.friends.forEach((friend, idx, object) => {
        if(friend.id == recipient){
            object.splice(idx, 1);
        }
    });

    let recipientObj = await User.findOne({id: recipient});
    let recipientFriends = recipientObj.friends.forEach((friend, idx, object) => {
        if(friend.id == sender){
            object.splice(idx, 1);
        }
    });

    let resSender = await User.findByIdAndUpdate({id: sender}, {
        $push: {blocked: recipient},
        $set: {friends: senderFriends}
    }).catch(err => {
        console.log('[',new Date().toUTCString(),']', err)
        return res.status(400).json({msg: "Internal server error.", reason: err})
    });

    let resRecipient = await User.findOneAndUpdate({id: recipient}, {
        $set: {friends: recipientFriends}
    }).catch(err => {
        console.log('[',new Date().toUTCString(),']', err)
        return res.status(400).json({msg: "Internal server error.", reason: err})
    });

    if(!resSender || !resRecipient) return res.status(400).json({msg: "Internal server error."})
    return res.status(200).json(resSender);

});

//refactor of remove friend
router.delete("/:sender/relationships/:recipient", async (req, res) => {
    const sender = req.params.sender;
    const recipient = req.params.recipient;

    let senderObj = await User.findOne({id: sender});
    let senderFriends = senderObj.friends.forEach((friend, idx, object) => {
        if(friend.id == recipient){
            object.splice(idx, 1);
        }
    });;

    let recipientObj = await User.findOne({id: recipient});
    let recipientFriends = recipientObj.friends.forEach((friend, idx, object) => {
        if(friend.id == sender){
            object.splice(idx, 1);
        }
    });;

    if(senderUpdatedFriends.includes({id: recipient})) return res.status(400).json({msg: "Internal server error", reason: "Recipient still in friends list"});

    let resSen = User.findOneAndUpdate({id: sender}, {
        $set: {friends: senderFriends}
    });

    let resRec = User.findOneAndUpdate({id: recipient}, {
        $set: {friends: recipientFriends}
    });

    if(!resSen || !resRec) {console.log(resSen + resSec); return res.status(400).json({msg: "Internal server error.", reason: "resSen or resRec missing"})};
    return res.status(200);
});

//get basic user data
router.get("/", auth, async (req, res) => {
    const user = await User.find({id: req.id});
    try{
    res.json({
        icon: user.icon,
        displayName: user.displayName,
        discriminator: user.discriminator
    });
    }
    catch(err){res.status(500).json({msg:"Internal server error"})}
});

//delete user
router.delete("/", auth, async (req, res) => {
    try{
        const {id, password} = req.body;
        if(!password) return res.status(400).json({msg: "No password was supplied"});

        const passMatch = await bcrypt.compare(password, user.password);
        if(!passMatch) return res.status(400).json({msg: "Invalid credentials."});
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        if(passMatch === true) {
            const deletedUser = await User.findOneAndDelete({id: req.id});
            let resUser = {
                id: deletedUser.id,
                email: deletedUser.email,
                displayName: deletedUser.displayName,
                discriminator: deletedUser.discriminator
            } 
            res.json(resUser);
        }
        
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
});

export default router;