import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: Object,
  content: Object,
  parent: String,
  children: Array,
  reactions: [Object],
  awards: [Object],
  filteredRoles: Array,
  createdAt: Date,
  editedAt: [Date]
}, {
  timestamps: true,
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment; 
