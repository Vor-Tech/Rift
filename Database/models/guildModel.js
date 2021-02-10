import mongoose from 'mongoose';
import roleSchema from '../schema/roleSchema.js'

const guildSchema = new mongoose.Schema({
  id: {type: String},
  owner_id: {type: String},
  name: {type: String},
  region: {type: String},
  acronym: {type: String},
  icon: {type: String},
  banner: {type: String},
  groups: {type: [Object]},
  verification_level: {type: Number},
  sub_groups: {type: [Object]},
  channels: {type: [Object]},
  default_channel: {type: String},
  members: {type: [String]},
  emojis: {type: [Object]},
  invites: {type: [Object]},
  roles: {type: [roleSchema]},
  created_at: {type: Date},
  edited_at: {type: [Date]}
}, {
  timestamps: true,
});

const Guild = mongoose.model('Guild', guildSchema);

export default Guild;
