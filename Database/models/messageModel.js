import mongoose from "mongoose";
const { Schema, model } = mongoose; 

const messageSchema = new Schema({
  author: {type: {
    displayName: String,
    discriminator: String,
    id: String,
    // icon: String,
  }, required: false},
  content: {type: [Object], required: true},
  channel_id: {type: String, required: true},
  sent_at: Date,
  edited_at: [Date]
}, {
  timestamps: true,
});

const Message = model('Message', messageSchema);

export default Message;
