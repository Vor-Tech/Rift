import mongoose from 'mongoose';

const botSchema = new mongoose.Schema({
    owner_id: {type: String, required: true},
    displayName: {type: String, required: true},
    icon: {type: String},
    intents: {type: Array, required: false},
    createdAt: {type: Date},
    editedAt: {type: [Object]},
});

const Bot = mongoose.model("Bot", botSchema);

export default Bot;