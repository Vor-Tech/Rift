import mongoose from 'mongoose';

export const role_schema = new mongoose.Schema({
  initiator: Object,
  name: {type: String, required: true},
  guild_id: {type: String, required: true},
  color: String,
  pingable: [[Object, Boolean]],
  hoist: Boolean,
  role_logo: String,
  permissions: Array,
  members: [Object],
  created_at: Date,
  edited_at: [Date]
}, {
  timestamps: true,
});

const Role = mongoose.model('Role', role_schema);

export default Role; 
