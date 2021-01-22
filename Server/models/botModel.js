import mongoose from 'mongoose';

const botSchema = new mongoose.Schema({
    owner: {type: Object, required: true},
    displayName: {type: String, required: true},
    icon: String,
    intents: {type: Array, required: false},
    createdAt: Date,
    editedAt: [Object],
});

const Bot = mongoose.model("Bot", botSchema);

export default Bot;