import mongoose from 'mongoose';

export const guild_schema = new mongoose.Schema({
  id: String,
  owner_id: String,
  name: String,
  region: String,
  acronym: String,
  icon: String,
  banner: String,
  groups: Array,
  verification_level: Number,
  sub_groups: Array,
  channels: Array,
  default_channel: Object,
  members: Array,
  emojis: [Object],
  invites: [Object],
  roles: [Object],
  created_at: Date,
  edited_at: [Date]
}, {
  timestamps: true,
});

const Guild = mongoose.model('Guild', guild_schema);

export default Guild;
