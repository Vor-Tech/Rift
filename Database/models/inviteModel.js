import mongoose from 'mongoose';
import {userSchema as user} from "./userModel.js";
import {botSchema as bot} from "./botModel.js";

export const inviteSchema = new mongoose.Schema({
    instantiator: {type: user || bot, required: true},
    target: String,
    uses: Number || Infinity,
    intents: {type: Array, required: false},
    created_at: Date,
    edited_at: [Object],
});

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;