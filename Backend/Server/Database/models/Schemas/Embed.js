const Message = require('./Message.js.js');

const embedSchema = new mongoose.Schema({
    message: Message,
    embedContent: {
        //todo
    },
  }, {
    timestamps: true,
  });
  
  module.exports = mongoose.model('Embed', embedSchema);
  