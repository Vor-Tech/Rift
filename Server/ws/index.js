import express from'express';
const app = express();;
import path from 'path';

const uri = 'mongodb://localhost:27017';
const port = 8080;

import Message from '../../Database/models/messageModel.js';
import mongoose from 'mongoose';

import http from 'http';
import socketIo from 'socket.io';
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

io.on('connection', (socket) => {
  console.log('Connection');
  Message.find().sort({createdAt: -1}).exec((err, messages) => {
    if (err) return console.error(err);

    // Send the messages to the user.
    socket.emit('init', messages);
  });

  // Listen to connected users for a new message.
  socket.on('message', (msg) => {
    // Create a message with the content and the name of the user.
    const message = new Message({
      author: msg.author,
      channel_id: msg.channel_id,
      content: msg.content,
      
    });

    // Save the message to the database.
    message.save((err) => {
      if (err) return console.error(err);
    });

    // Notify all other users about a new message.
    socket.broadcast.emit('push', msg);
  });
});

server.listen(port, () => {
  console.log('listening on *:' + port);
});