import mongoose from 'mongoose';
import {userSchema as user} from "./userModel.js";

export const botSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    owner: {type: user, required: true},
    displayName: {type: String, required: true, maxlength: 20},
    discriminator: {type: String},
    icon: {type: String},
    intents: {type: Array, required: false},
    created_at: {type: Date},
    edited_at: {type: [{
        edit: [[Object, Date] /*original*/, [Object, Date] /*edited*/]
    }], required: false},
}, {
    timestamps: true,
});

const Bot = mongoose.model("Bot", botSchema);

export default Bot;