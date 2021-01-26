import mongoose from 'mongoose';
import {userSchema as user} from "./userModel.js";

export const botSchema = new mongoose.Schema({
    id: {type: String, required: true},
    owner: {type: user, required: true},
    displayName: {type: String, required: true, maxlength: 20},
    discriminator: String,
    icon: String,
    intents: {type: Array, required: false},
    created_at: Date,
    edited_at: [Object],
});

const Bot = mongoose.model("Bot", botSchema);

export default Bot;