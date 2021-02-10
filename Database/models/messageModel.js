//todo: potentially convert to schema to store individually in guilds or DM objects

import mongoose from "mongoose";
const { Schema, model } = mongoose; 

export const messageSchema = new Schema({
  id: {type: String},
  author: {type: {
    displayName: {type: String, unique: false},
    discriminator: {type: String, unique: false},
    id: {type: String, unique: false},
    // icon: String,
  }, unique: false},
  content: {type: [Object], required: true},
  channel_id: {type: String, required: true},
  sent_at: {type: Date},
  edited_at: {type: [[Object, Date]]}
}, {
  timestamps: true,
});

const Message = model('Message', messageSchema);

export default Message;