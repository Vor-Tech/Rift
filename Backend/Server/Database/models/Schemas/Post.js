const Message = require('./Message.js');

const postSchema = new mongoose.Schema({
    user: User,
    content: String,
    name: String,
  }, {
    timestamps: true,
  });
  
  module.exports = mongoose.model('Post', postSchema);
  