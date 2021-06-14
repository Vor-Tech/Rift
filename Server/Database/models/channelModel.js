import mongoose from 'mongoose';
import {userSchema as user} from "./userModel.js";
import {botSchema as bot} from "./botModel.js";

export const channelSchema = new mongoose.Schema({
  guild_id: String,
  id: String,
  last_message_id: String,
  instantiator: {type: user || bot},
  type: {type: String},
  name: {type: String},
  topic: String,
  position: Number,
  nsfw: Boolean,
  channel_logo: String,
  permission_overwrites: Array,
  parent_id: String,
  child_ids: Array,
  rate_limit_per_user: Number,
  invites: [Object],
  messages: /*[messageSchema]*/ Array,
  created_at: Date,
  edited_at: Array
}, {
  timestamps: true,
});

const Channel = mongoose.model('Channel', channelSchema)

export default Channel;
