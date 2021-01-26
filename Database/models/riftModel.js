import mongoose from 'mongoose';

export const riftSchema = new mongoose.Schema({
  owner: Object,
  name: String,
  acronym: String,
  riftLogo: String,
  riftBanner: String,
  members: [Object],
  channels: [Object],
  tags: [Object],
  flares: [Object],
  emojis: [Object],
  public: Boolean,
  roles: [Object],
  createdAt: Date,
  editedAt: [Date]
}, {
  timestamps: true,
});

const Rift = mongoose.model('Rift', riftSchema);

export default Rift; 