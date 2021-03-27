import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
  date: Date,
  from_to: Array
}, {
  timestamps: true,
});

const FriendRequest = mongoose.model('Friend Request', friendRequestSchema);

export default FriendRequest; 
