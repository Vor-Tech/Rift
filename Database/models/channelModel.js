import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  guild_id: {type: String},
  id: {type: String},
  last_message_id: {type: String},
  instantiator: {type: Object},
  type: {type: {type: String}},
  name: {type: {type: String}},
  topic: {type: String},
  position: {type: Number},
  nsfw: {type: Boolean},
  channel_logo: {type: String},
  permission_overwrites: {type: Array},
  parent_id: {type: String},
  // child_ids: {type: Array},
  rate_limit_per_user: {type: Number},
  invites: {type: [Object]},
  messages: {type: /*[messageSchema]*/ Array},
  created_at: {type: Date},
  edited_at: {type: Array},
}, {
  timestamps: true,
});

const Channel = mongoose.model('Channel', channelSchema)

export default Channel;
