const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 3000;

const kitchens = []

// Serve the Socket.IO client library
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));

// host everything in the /public folder
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

  socket.on('join_kitchen_code', (code, callback) => {
    //checks
    if (code.length !== 5) return callback("wrong_length");

    if (!kitchens.includes(code)) return callback("wrong_code");

    console.log('join_kitchen_code:', code);
    callback("good");
  });

  socket.on('create_kitchen_code', (callback) => {
    let code = createCode()

    //checks
    if (kitchens.includes(code)) code = createCode();

    if (kitchens.includes(code)) return callback("no_avalable_kitchens");

    kitchens.push(code)
    socket.join(code)

    console.log("create_kitchen_code:", code)
    console.log("kitchens:", kitchens)
    callback(`good${code}`);
  });

  socket.on('delete_kitchen_code', (callback) => {
    if (Array.from(socket.rooms)[1] == undefined) return callback("not_in_one")

    console.log('delete_kitchen_code', Array.from(socket.rooms)[1]);
    
    kitchens.splice(kitchens.indexOf(Array.from(socket.rooms)[1]), 1)
    socket.leave(Array.from(socket.rooms)[1])

    console.log("kitchens:", kitchens)
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function createCode() {
  return Math.floor(Math.random() * 100000).toString().padStart(5, '0');
}