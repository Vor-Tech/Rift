import express from 'express';
const router = express.Router();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

import User from "../../models/userModel.js";
import FriendRequest from "../../models/friendRequestModel.js";

let userIncrement = 0;

router.post("/register", async (req,res) => {
    try {
        let { email, password, passwordCheck, displayName } = req.body;

        //validate

        const existingUser = await User.findOne({email: email});
        if(existingUser) return res.status(400).json({msg: "An account with this email already exists."})
        if(!email) return res.status(400).json({msg: "No email was supplied"});
        if(!password) return res.status(400).json({msg: "No password was supplied"});
        if(!passwordCheck || password !== passwordCheck) return res.status(400).json({msg: "Password check was not valid"});
        if(!displayName) displayName = email.split('@')[0];
        if(password.length < 5) return res.status(400).json({msg: "Password must be at least 5 characters long"});

        //crypt

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)

        //user gen
        //generate id
        userIncrement++;

        let id = (Date.now() + process.pid + userIncrement);
        console.log("id",id);
        let discriminator = Math.floor(Math.random()*90000) + 10000;
        const newUser = new User({
            id,
            email,
            password: passwordHash,
            displayName,
            discriminator,
            createdAt: `[${new Date().toUTCString()}]`
        });

        const savedUser = await newUser.save();
        let resUser;
        resUser.id = savedUser.id;
        resUser.email = savedUser.email;
        resUser.displayName = savedUser.displayName;
        resUser.discriminator
        res.json(savedUser);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"});
        console.error(`[${new Date().toLocaleTimeString()}]`, err);
    }
})

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
                    id: user._id,
                    displayName: user.displayName,
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

router.delete("/delete", auth, async (req, res) => {
    try{
        console.log(req.user)
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
}) //later path: /close

router.post("/tokenValid", async (req, res) => {
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

router.post("/resToken", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if(!token) return res.json({token_provided: false});

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.json({valid_token: false});

        const user = await User.findById(verified.id);
        if(!user) return res.json({valid_user: false});
        return res.json(user);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
})

//send friend request
router.post("/:sender/relationships/:recipient/pending", async (req, res) => {
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


router.delete("/:sender/relationships/:recipient", async (req, res) => { //remove friend
    const sender = req.params.sender;
    const recipient = req.params.recipient;

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

    if(!resSender || !resRecipient) return res.status(400).json({msg: "Internal server error"});
    
    return res.status(200);
});

//block
router.patch("/:sender/relationships/:recipient/block", async (req, res) => {
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

//refactor
router.delete("/:sender/relationships/:recipient", async (req, res) => {
    const sender = req.params.sender;
    const recipient = req.params.recipient;

    let senderObj = await User.findOne({id: sender});
    let senderFriends = senderObj.friends;
    let senderUpdatedFriends = senderFriends.forEach((friend, idx, object) => {
        if(friend.id == recipient){
            object.splice(idx, 1);
        }
    });

    let recipientObj = await User.findOne({id: recipient});
    let recipientFriends = recipientObj.friends;
    let recipientUpdatedFriends = recipientFriends.forEach((friend, idx, object) => {
        if(friend.id == sender){
            object.splice(idx, 1);
        }
    });

    if(senderUpdatedFriends.includes({id: recipient})) return res.status(400).json({msg: "Internal server error", reason: "Recipient still in friends list"});

    let resSen = User.findOneAndUpdate({id: sender}, {
        $set: {friends: senderUpdatedFriends}
    });

    let resRec = User.findOneAndUpdate({id: recipient}, {
        $set: {friends: recipientUpdatedFriends}
    });

    if(!resSen || !resRec) {console.log(resSen + resSec); return res.status(400).json({msg: "Internal server error.", reason: "resSen or resRec missing"})};
    return res.status(200);
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    try{
    res.json({
        icon: user.icon,
        displayName: user.displayName,
        id: user._id,
    });
    }
    catch(err){res.status(400).json({msg:"Internal server error"})}
})

export default router;