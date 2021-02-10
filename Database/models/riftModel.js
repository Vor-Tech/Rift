import mongoose from 'mongoose';

const riftSchema = new mongoose.Schema({
  owner: {type: Object},
  name: {type: String},
  acronym: {type: String},
  riftLogo: {type: String},
  riftBanner: {type: String},
  members: {type: [Object]},
  channels: {type: [Object]},
  tags: {type: [Object]},
  flares: {type: [Object]},
  emojis: {type: [Object]},
  public: {type: Boolean},
  roles: {type: [Object]},
  createdAt: {type: Date},
  editedAt: {type: [Date]}
}, {
  timestamps: true,
});

const Rift = mongoose.model('Rift', riftSchema);

export default Rift; 