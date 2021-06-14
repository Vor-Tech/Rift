import mongoose from "mongoose";
import { userSchema as user } from "./userModel.js";
import { botSchema as bot } from "./botModel.js";

export const messageSchema = new mongoose.Schema(
  {
    author: { type: user || bot, required: true },
    content: { type: [Object], required: true },
    channel_id: { type: String, required: true },
    sent_at: Date,
    edited_at: [Date],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
