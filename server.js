const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const port = 3000

const startedKitchens = []

// Serve the Socket.IO client library
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')))

// host everything in the /public folder
app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log('Socket connected')

  //before kitchen leave
  socket.on('disconnecting', function(){
    console.log('Socket disconnecting')
    
    const code = getCurrentKitchen(socket)

    //return if they weren't in a kitchen
    if (code == undefined) return
    //return if the kitchen has only them (it'll be deleted anyways)
    const size = io.sockets.adapter.rooms.get(code).size
    if (size == 1) return
    
    if (startedKitchens.includes(code)) {
      //abort kitchen since user left while cooking started
      startedKitchens.splice(startedKitchens.indexOf(code), 1);
      
      //make all chefs leave the kitchen
      io.sockets.in(code).emit("kitchen_return_menu")

      //leave everyone in the kitchen
      io.in(code).socketsLeave(code)

      console.log("kitchen aborted:", code)
    } else {
      //send a count change to kitchen chefs waiting
      console.log("left kitchen:", code, "size:", `${size - 1}/8`)
      io.sockets.in(code).emit("kitchen_count_change", `${size - 1}/8`)
    }
  });

  //after kitchen leave
  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  //template (remove later) (remove later) (remove later) (remove later) (remove later)
  socket.on('message', (data) => {
    console.log('Received message:', data)
    // Handle the received message
    // For example, you can broadcast it to all connected clients
    io.emit('message', data)
  })
  //template (remove later) (remove later) (remove later) (remove later) (remove later)

  socket.on('join_kitchen_code', (code, callback) => {
    //if length wrong
    if (code.length !== 5) return callback("wrong_length")

    //if kitchen doesn't exists
    if (!listOfKitchens().includes(code)) return callback("wrong_code")
    
    //if kitchen is full
    if (io.sockets.adapter.rooms.get(code).size == 8) return callback("full_kitchen")
    
    //join the kitchen
    socket.join(code)

    let size = io.sockets.adapter.rooms.get(code).size
    console.log('join_kitchen_code:', code, 'size:', `${size}/8`)

    //send a count change to kitchen chefs
    io.sockets.in(code).emit("kitchen_count_change", `${size}/8`)

    callback(`good`)
  })

  socket.on('leave_kitchen_code', (callback) => {
    let kitchen = getCurrentKitchen(socket)
    
    //if they aren't in a kitchen
    if (kitchen == undefined) return callback("not_in_one")
    
    //leave kitchen
    socket.leave(kitchen)

    let size = io.sockets.adapter.rooms.get(kitchen).size

    //send a count change to kitchen chefs
    io.sockets.in(kitchen).emit("kitchen_count_change", `${size}/8`)

    console.log('leave_kitchen_code', kitchen, 'size:', `${size}/8`)
    callback("good")
  })

  socket.on('create_kitchen_code', (callback) => {
    let code = createCode()

    //if code created already exists
    if (listOfKitchens().includes(code)) code = createCode()
    //if somehow coincidence twice, give up bruh
    if (listOfKitchens().includes(code)) return callback("no_avalable_kitchens")

    //create kitchen
    socket.join(code)

    console.log("create_kitchen_code:", code)
    console.log("updated kitchens:", listOfKitchens())
    callback(`good${code}`)
  })

  socket.on('delete_kitchen_code', (callback) => {
    let kitchen = getCurrentKitchen(socket)
    
    //if they aren't in a kitchen
    if (kitchen == undefined) return callback("not_in_one")
    
    //make people waiting stop wait yeah
    io.sockets.in(kitchen).emit("kitchen_wait_stop")

    //leave everyone in the kitchen
    io.in(kitchen).socketsLeave(kitchen)

    callback("good")
    
    console.log('delete_kitchen_code:', kitchen)
    console.log("updated kitchens:", listOfKitchens())
  })

  socket.on('start_kitchen_code', (callback) => {
    let kitchen = getCurrentKitchen(socket)
    
    //if they aren't in a kitchen
    if (kitchen == undefined) return callback("not_in_one")

    //if the kitchen is too small
    if (io.sockets.adapter.rooms.get(kitchen).size == 1) return callback("too_small")
    
    //send the start
    io.sockets.in(kitchen).emit("kitchen_started_code")

    startedKitchens.push(kitchen)
    
    console.log('start_kitchen_code:', kitchen)
  })
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

function createCode() {
  return Math.floor(Math.random() * 100000).toString().padStart(5, '0')
}

//get list of kitchens in socket io
function listOfKitchens() {
  const kitchens = Array.from(io.sockets.adapter.rooms);
  const list = []

  //only add kitchens with lengths under 6
  kitchens.forEach(function(kit) {
    if (kit[0].toString().length == 5) list.push(kit[0])
  });
  
  return list
}

//from a socket, get the kitchen if possible
function getCurrentKitchen(socket) {
  return Array.from(socket.rooms)[1]
}