import mongoose from 'mongoose';
import { channelSchema } from './channelModel.js';
import { roleSchema } from './roleModel.js';
import { userSchema } from './userModel.js';

export const riftSchema = new mongoose.Schema({
  id: {type: String, required: true},
  owner: {type: userSchema, required: true},
  name: {type: String, required: true},
  logo: {type: String},
  banner: {type: String},
  members: {type: [String]}, //array of user IDs
  channels: {type: [channelSchema], required: true},
  tags: {type: [Object]},
  flares: {type: [Object], required: false},
  emojis: {type: [Object], required: false},
  public: {type: Boolean},
  roles: {type: [roleSchema]},
  createdAt: {type: Date},
  editedAt: {type: [{
    edit: [[Object, Date] /*original*/, [Object, Date] /*edited*/]
  }], required: false}
}, {
  timestamps: true,
});

const Rift = mongoose.model('Rift', riftSchema);

export default Rift; 