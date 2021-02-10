import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
  date: {type: Date},
  to: {type: String},
  from: {type: String}
}, {
  timestamps: true,
});

export default friendRequestSchema; 
