import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
  date: {type: Date},
  to: {type: String},
  from: {type: String}
});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

export default FriendRequest; 
