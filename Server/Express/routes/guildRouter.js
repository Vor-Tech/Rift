import express from 'express';
const router = express.Router();

import auth from "../middleware/auth.js";
import {GuildModel as Guild, ChannelModel as Channel, RoleModel as Role, BotModel as Bot} from '../../../Database/models/modelBarrel.js';
import {authenticate} from './userRouter.js';
import Message from '../../../Database/models/messageModel.js';
import User from '../../../Database/models/userModel.js';


let guildIncrement = 0;

//permission shorthands
const default_permissions = {
    voice: [
        "speak",
        "voice_activity", 
    ],
    text: [
        "send_messages",
        "read_messages",
        "read_message_history"
]};

//role declarations
let Everyone = new Role({
    name: 'everyone',
    color: 'grey',
    pingable: true,
    hoist: true,
    visible: true,
    members: 'all',
    permissions: [default_permissions]
})

let genAcronym = (acronym_var, guildName) => {
    guildName.split(' ').forEach(word => {
        acronym_var.push(word[0])
    });
};

router.post("/create", async (req,res) => {
    try {
        let {owner_id, name, logo} = req.body;
        let acronym;
        
        authenticate(req, res);
        
        let owner = User.findOne({id: owner_id});
        //assign missing
        
        if(!owner) return res.status(400).json({msg: "Account error"});
        if(!name) name = `${owner.user.username}'s Server`;
        genAcronym(acronym, name)
        if(!logo) logo = acronym;

        //Increment guild counter
        guildIncrement++;

        //create guild
        let newGuild = new Guild({
            owner_id: owner.id,
            id: `o${owner.id}.g${Date.now() + process.pid + guildIncrement}`,
            name,
            logo,
            acronym,
            roles: [],
            channels: [],
            invites: []
        });

        //Finalize roles and push to guild obj
        Everyone.set({id: `${guild.id}.everyone`});
        newGuild.roles.push(Everyone);

        //create channels
        let GeneralText = new Channel({
            instantiator: {handle: `${owner.displayName}#${owner.discriminator}`, id: owner.id},
            id: `${newGuild.id}.ct${Date.now() + process.pid + guildIncrement}`,
            name: "General",
            type: "text",
            channelLogo: null /*hashtag*/,
            acronym: null,
            permissions: [],
            subChannels: [],
            invites: [] /*[Object]*/,
            messages: [],
            created_at: new Date().toUTCString(),
            edited_at: [],
        })
        
        let GeneralVoice = new Channel({
            id: `${newGuild.id}.cv${Date.now() + process.pid + guildIncrement}`,
            name: "General",
            type: "voice",
            channelLogo: null,
            permissions: [],
            invites: []
        })

        //create default message
        let DefaultMessage = new Message({
            id: '1',
            author: {
                id: '1',
                displayName: 'Jaq',
                discriminator: '0000',
                // icon: Jaq.icon,
                bot: true
            },
            content: [`Welcome to text channel, General`],
            sent_at: new Date().toUTCString(),
        })

        //push message to channel
        GeneralText.messages.push(DefaultMessage);

        //push channels
        newGuild.channels.push(GeneralText);
        newGuild.channels.push(GeneralVoice);

        //push permissions
        newGuild.channels.GeneralText.permissions.push({id: Everyone.id, name: Everyone.name, permissions: [...Everyone.permissions.text]});
        newGuild.channels.GeneralVoice.permissions.push({id: Everyone.id, name: Everyone.name, permissions: [...Everyone.permissions.voice]});

        //save guild to db
        const savedGuild = await newGuild.save();

        owner.owner_of.guilds.push(savedGuild.id);
        owner.member_of.guilds.push(savedGuild.id);
        owner.save();
        //confirm and return
        let resGuild = await Guild.findOne(savedGuild.id);
        if(resGuild) return res.status(200).json(resGuild);
        return res.status(500).json({msg: "Unable to create guild."});
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"});
        console.error(`[${new Date().toLocaleTimeString()}]`, err);
    }
})

//update guild
router.patch("/:guildID", async (req, res) => {
    let guild = await Guild.findOne({id: req.params.guildID});
    let {nName, nOwner, nChannel, nGroup, nRole, nMember, nSponsor} = req.body;

    //check if user is valid
    //check which operation the user wants to perform
    //check if said user has permission to perform said action
    //perform said action
    //save new document
    //return status
});

//delete guild
router.delete("/delete", auth, async (req, res) => { //todo
    //verify user is guild owner
    //verify with password

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