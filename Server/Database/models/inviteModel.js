import mongoose from "mongoose";
import { userSchema as user } from "./userModel.js";
import { botSchema as bot } from "./botModel.js";

export const inviteSchema = new mongoose.Schema({
  instantiator: { type: user || bot, required: true },
  target: { type: String, required: true },
  uses: { type: Number }, //if 0, no use expirey
  intents: { type: Array, required: false },
  created_at: { type: Date, required: true },
  expires_at: { type: Date, required: false },
});

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;
