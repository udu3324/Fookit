const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const port = 3000

const kitchens = []

// Serve the Socket.IO client library
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')))

// host everything in the /public folder
app.use(express.static('public'))

io.on('error', function(error) {
  console.log("error:", error)
})

io.on('connection', (socket) => {
  console.log('Socket connected')

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  //template (remove later)
  socket.on('message', (data) => {
    console.log('Received message:', data)
    // Handle the received message
    // For example, you can broadcast it to all connected clients
    io.emit('message', data)
  })
  //template (remove later)

  socket.on('join_kitchen_code', (code, callback) => {
    //if length wrong
    if (code.length !== 5) return callback("wrong_length")
    //if kitchen exists
    if (!kitchens.includes(code)) return callback("wrong_code")
    //if kitchen full
    if (io.sockets.adapter.rooms.get(code).size == 8) return callback("full_kitchen")
    
    //join the kitchen
    socket.join(code)
    let size = io.sockets.adapter.rooms.get(code).size

    console.log('join_kitchen_code:', code, 'size:', size)

    io.to(code).emit("join_kitchen_count_change", size)

    callback(size + "/8")
  })

  socket.on('create_kitchen_code', (callback) => {
    let code = createCode()

    //if code created already exists
    if (kitchens.includes(code)) code = createCode()
    //if somehow coincidence twice, give up bruh
    if (kitchens.includes(code)) return callback("no_avalable_kitchens")

    //create kitchen
    kitchens.push(code)
    socket.join(code)

    console.log("create_kitchen_code:", code)
    console.log("updated kitchens:", kitchens)
    callback(`good${code}`)
  })

  socket.on('delete_kitchen_code', (callback) => {
    let kitchen = Array.from(socket.rooms)[1]
    
    //if they aren't in a kitchen
    if (kitchen == undefined) return callback("not_in_one")
    

    kitchens.splice(kitchens.indexOf(kitchen), 1)
    //leave everyone in kitchen
    io.in(kitchen).socketsLeave(kitchen)
    
    console.log('delete_kitchen_code', kitchen)
    console.log("updated kitchens:", kitchens)
  })
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

function createCode() {
  return Math.floor(Math.random() * 100000).toString().padStart(5, '0')
}