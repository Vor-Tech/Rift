import express from 'express';
const router = express.Router();

import auth from "../middleware/auth.js";
import {GuildModel as Guild, ChannelModel as Channel, RoleModel as Role, BotModel as Bot} from '../../../Database/models/modelBarrel.js';
import Axios from "axios";

//permission shorthands

const default_permissions = [
    "speak",
    "voice_activity", 
    "send_messages",
    "read_messages",
    "read_message_history"
];

//role declarations
const Everyone = new Role({
    color: 'grey',
    pingable: true,
    hoist: true,
    visible: true,
    members: 'all',
    // id: `${guild._id}.everyone`,
    permissions: [...default_permissions]
})

//default channel declarations
let GeneralText = new Channel({
    name: "General",
    type: "text",
    channelLogo: null /*hashtag*/,
    permissions: [
        [Everyone, [...Everyone.permissions]]
    ],
    subChannels: [null],
    invites: [null] /*[Object]*/,
    messages: [
        {
            author: Bot.findById("5fff26ac29100a2938911429"),
            content: `Welcome to text channel, General`,
            sent_at: new Date().toUTCString(),
            //id
        }
    ],
    createdAt: new Date().toUTCString(),
    editedAt: [null],
})

let GeneralVoice = new Channel({
    name: "General",
    type: "voice",
    invites: [null]
})

router.post("/create", async (req,res) => {
    try {

//   groups: Array,

        let {owner, token, name, logo, channels, roles} = req.body;
        let genAcronym = (acronym_var) => {
            name.split(' ').forEach(word => {
                acronym_var.push(word[0])                       //might want to fix this
            });
        };

        if(!token) return res.status(400).json({msg: "No token provided"});
        if(!owner) owner = Axios.get("http://localhost:5000/users/resToken", {"x-auth-token": token});
        if(!owner) return res.status(400).json({msg: "Account error"});

        //assign missing
        if(!name) name = `${owner.user.username}'s Server`;
        
        let acronym = [];
        genAcronym(acronym)

        if(!logo) logo = acronym;

        newGuild = new Guild({
            owner_id: owner.user.id,
            name,
            logo,
            acronym,
            roles
        })

        const savedGuild = await newGuild.save();
        
        //role ID set
        Everyone.id = `${savedGuild._id}.everyone`;

        //channel guild obj set
        [GeneralText.guild, GeneralVoice.guild] = savedGuild;

        channels = [];
        roles = [];

        channels.push([GeneralText, GeneralVoice]);
        roles.push([Everyone, Owner]);

        Guild.findByIdAndUpdate(savedGuild._id, {$set:{channels}, $set: {roles}, $set: {default_channel: GeneralText}}).then((docs)=>{
            if(docs) {
              resolve({success:true,data:docs});
            } else {
              reject({success:false,data:"guild not found"});
            }
         }).catch((err)=>{
             reject(err);
         });

         let resGuild = Guild.findById(savedGuild._id);
         return res.json(resGuild);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"});
        console.error(`[${new Date().toLocaleTimeString()}]`, err);
    }
})

router.patch("/:guildid", async (req, res) => {
    let guildid = req.params.guildid;

    
})

router.delete("/delete", auth, async (req, res) => { //todo
    try{
        const deletedGuild = await User.findByIdAndDelete(req.guild._id);
        res.json(deletedGuild);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        displayName: user.displayName,
        id: user._id,
    });
})

export default router;