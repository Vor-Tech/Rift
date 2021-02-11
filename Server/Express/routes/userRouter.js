import express from 'express';
const router = express.Router();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

import User from "../../../Database/models/userModel.js";
import FriendRequest from "../../../Database/models/friendRequestModel.js";
import e from 'cors';

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
        let discriminator = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

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
router.get("/resolve-token-full", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if(!token) return res.json({token_provided: false});

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log(verified);
        if(!verified) return res.json({valid_token: false});

        const user = await User.findById(verified.id);
        if(!user) return res.json({valid_user: false});
        let resUser = {
            icon: user.icon,
            id: user.id,
            email: user.email,
            blocked_users: user.blocked_users,
            achievements: user.achievements,
            displayName: user.displayName,
            discriminator: user.discriminator,
            badges: user.badges,
            friend_requests: user.friend_requests,
            friends: user.friends,
            updated_at: user.updated_at,
            created_at: user.created_at
        } 
        res.json(resUser);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
})

//resolve id to user
router.get("/resolve-id", async (req, res) => {
    try {
        const id = req.header("id");
        if(!id) return res.json({id_provided: false});

        const user = await User.find({id});
        
        if(!user) return res.json({valid_id: false});

        let resUser = {
            icon: user.icon,
            id: user.id,
            displayName: user.displayName,
            discriminator: user.discriminator,
            created_at: user.created_at,
            badges: user.badges,
            achievements: user.achievements
        } 
        res.json(resUser);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
})

//send/accept friend request
router.post("/:sender/relationships/:recipient/pending", async (req, res) => { //TODO, make sure a user isnt already friends
    const sender = req.params.sender;
    const recipient = req.params.recipient;

    // const token = req.header("x-auth-token");

    let senderObj = await User.findOne({id: sender});
    let recipientObj = await User.findOne({id: recipient});
    let sent;
    let received;
    let mutual;
    let existing;

    if(!senderObj || !recipientObj) return res.status(400).json({msg: "Bad sender or recipient ID"});

    if(recipientObj.friends.includes(sender) && senderObj.friends.includes(recipient)) return res.status(400).json({msg: 'Already friends.'});
    
    recipientObj.friend_requests?.forEach((freq) => freq.from === sender ? existing = true : false)
    if(existing === true) return res.status(400).json({msg: "Existing friend request pending"});


    let cannotSend = 'You cannot send a friend requset to this user because'; 

    if(recipientObj.blocked_users.includes(sender)) return res.json({msg: `${cannotSend} they have blocked you.`});
    if(senderObj.blocked_users.includes(recipient)) return res.json({msg: `${cannotSend} you have blocked them.`});

    try{
        recipientObj.friend_requests.forEach((freq, idx, object) => {
            if(freq.to === sender && freq.from === recipient) {
                object.splice(idx, 1);
                mutual = true;
            }
        });

        if(mutual === true || mutual?.includes(true)) {
            senderObj.friend_requests.forEach((freq, idx, object) => {
                if(freq.to === sender && freq.from === recipient) {
                    object.splice(idx, 1);
                    recipientObj.friends.push(sender);
                    senderObj.friends.push(recipient);
                    
                    recipientObj.save();
                    senderObj.save();

                    return res.status(200).json({msg: "Mutual requests, friends added."});
                
                }
            });
        };
    } catch(err) {
        console.error(err)
        return res.status(500).json({msg: "Internal server error."});
    }

    const newFriendRequest = new FriendRequest({
        date: new Date().toUTCString(),
        from: sender,
        to: recipient
    });
    
    try {
        senderObj.friend_requests.push(newFriendRequest)
        recipientObj.friend_requests.push(newFriendRequest);

        console.log(recipientObj)

        let resSender = await senderObj.save();
        let resRecipient = await recipientObj.save();

        resSender.friend_requests.forEach((friendRequest) => {if(friendRequest.to === recipient) sent = true});
        resRecipient.friend_requests.forEach((friendRequest) => {if(friendRequest.from === sender) received = true});

        return res.status(200).json({"sent": sent, "received": received});
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({msg: "Internal server error."});
    }
});

//cancel friend request
router.delete("/:sender/relationships/:recipient/pending", async (req, res) => {
    const sender = req.params.sender;
    const recipient = req.params.recipient;
    
    let requestFound = [];

    let senderObj = await User.findOne({id: sender});
    let recipientObj = await User.findOne({id: recipient});

    senderObj.friend_requests.forEach((freq, idx, object) => {
        if(freq.to === recipient && freq.from === sender){
            object.splice(idx, 1);
            return requestFound.push(true);
        }
    });


    recipientObj.friend_requests.forEach((freq, idx, object) => {
        if(freq.to === recipient && freq.from === sender) {
            object.splice(idx, 1);
            return requestFound.push(true);
        }
    });

    if(!requestFound.includes(true)) return res.status(404).json({msg: "Friend request not found"});

    let resSender = await senderObj.save().catch(err => {
        console.log('[',new Date().toUTCString(),']', err)
        return res.status(500).json({msg: "Internal server error.", reason: err})
    });

    let resRecipient = await recipientObj.save().catch(err => {
        console.log('[',new Date().toUTCString(),']', err)
        return res.status(500).json({msg: "Internal server error.", reason: err})
    });

    res.status(200).json({msg: "Canceled friend request."})
});

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
        return res.status(500).json({msg: "Internal server error.", reason: err})
    });

    let resRecipient = await User.findOneAndUpdate({id: recipient}, {
        $set: {friends: recipientFriends}
    }).catch(err => {
        console.log('[',new Date().toUTCString(),']', err)
        return res.status(500).json({msg: "Internal server error.", reason: err})
    });

    if(!resSender || !resRecipient) return res.status(500).json({msg: "Internal server error."})
    return res.status(200).json(resSender);

});

//remove friend
router.delete("/:sender/relationships/:recipient", async (req, res) => {
    const sender = req.params.sender;
    const recipient = req.params.recipient;

    let removed = [];

    let senderObj = await User.findOne({id: sender});
    let recipientObj = await User.findOne({id: recipient});

    //todo, check if users are friends
    
    senderObj.friends.forEach((friend, idx, object) => {
        if(friend == recipient){
            object.splice(idx, 1);
            senderObj.save();
            return removed.push(true);
            
        }
    });

    
    recipientObj.friends.forEach((friend, idx, object) => {
        if(friend == sender){
            object.splice(idx, 1);
            recipientObj.save();
            return removed.push(true);
        }
    });

    if(senderObj.friends.includes(recipient) || recipientObj.friends.includes(sender)) return res.status(500).json({msg: "Internal server error", reason: "Recipient still in friends list"});

    if(!removed.includes(true)) {
        return res.status(404).json({msg: "Friend not found."});
    } else if(removed.includes(true)) {
        return res.status(200).json({msg: "Friend removed."});
    }
});

//get basic user data
router.get("/", auth, async (req, res) => {
    let id = req.header("id");

    const user = await User.find({id});
    try{
        res.json({
            icon: user.icon,
            displayName: user.displayName,
            discriminator: user.discriminator,
            id: user.id
        });
    } catch(err) {
        res.status(500).json({msg:"Internal server error"})
    }
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
        
    } catch(err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
});

export default router;