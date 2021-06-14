import mongoose from 'mongoose';
import {botSchema as Bot} from './botModel.js';
import {userSchema as User} from './userModel.js';

export const roleSchema = new mongoose.Schema({
  initiator: {type: User || Bot, required: true},
  name: {type: String, required: true},
  guild_id: {type: String, required: true},
  color: String,
  pingable: {type: [
    [Object, Boolean]
  ]}, 
  hoist: {type: Boolean},
  role_logo: {type: String, required: true},
  permissions: {type: Array},
  members: {type: [String]},
  created_at: {type: Date, required: true},
  edited_at: {type: [{
    edit: [[Object, Date] /*original*/, [Object, Date] /*edited*/]
  }], required: false}
}, {
  timestamps: true,
});

const Role = mongoose.model('Role', roleSchema);

export default Role; 
