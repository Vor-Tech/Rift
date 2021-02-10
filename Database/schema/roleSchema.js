import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  initiator: {type: Object},
  name: {type: String, required: true},
  guild_id: {type: String, required: true},
  color: {type: String},
  pingable: {type: [[String, Boolean]]},
  hoist: {type: {/*doHoist:*/ Boolean, position: Number}},
  role_logo: {type: String},
  permissions: {type: Array},
  members: {type: [Object]},
  created_at: {type: Date},
  edited_at: {type: [Date]}
}, {
  timestamps: true,
});

export default roleSchema; 
