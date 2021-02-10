import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
  date: {type: Date},
  from_to: {type: Array}
}, {
  timestamps: true,
});

export default friendRequestSchema; 
