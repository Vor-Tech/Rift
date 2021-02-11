import mongoose from 'mongoose';
import messageSchema from './messageModel.js'

const commentSchema = new mongoose.Schema({
  author: {type: Object},
  content: {type: Array},
  parent_id: {type: String},
  children: {type: [String]},
  reactions: {type: [Object]},
  awards: {type: [Object]},
  filteredRoles: {type: [String]},
  createdAt: {type: Date},
  editedAt: {type: [Date]},
}, {
  timestamps: true,
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment; 
