const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http);

const path = require('path');

const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); 
});

const users = {};

io.on('connection', socket => {
  socket.on('new-user-joined', name => {
    console.log("New user", name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
    socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
