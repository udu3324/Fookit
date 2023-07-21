const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 3000;

// Serve the Socket.IO client library
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Socket connected');

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  //template
  socket.on('message', (data) => {
    console.log('Received message:', data);
    // Handle the received message
    // For example, you can broadcast it to all connected clients
    io.emit('message', data);
  });

  socket.on('join_kitchen_code', (code) => {
    console.log('join_kitchen_code:', code);
    
    if (code.length !== 5) {
      socket.emit('join_kitchen_code_response', "wrong_length");
      return
    }

    // Sending back the response
    socket.emit("join_kitchen_code_response", "good!");
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});