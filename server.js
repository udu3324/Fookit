const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const dish = require('./dish');

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
    
    if (listOfStartedKitchens().includes(code)) {
      //abort kitchen since user left while cooking started
      removeStartedKitchen(code)
      
      //make all chefs leave the kitchen
      io.sockets.in(code).emit("kitchen_return_menu")

      //leave everyone in the kitchen
      io.in(code).socketsLeave(code)

      console.log("kitchen aborted:", code)
    } else {
      //remove kitchen if main chef left
      if (socket.id == listOfChefs(code)[0]) {
        //make people waiting stop wait yeah
        io.sockets.in(code).emit("kitchen_wait_stop")

        //leave everyone in the kitchen
        io.in(code).socketsLeave(code)
        console.log("kitchen wait stop:", code)
      } else {
        //send a count change to kitchen chefs waiting
        console.log("left kitchen:", code, "size:", `${size - 1}/8`)
        io.sockets.in(code).emit("kitchen_count_change", `${size - 1}/8`)
      }
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
    
    //if kitchen already started
    if (listOfStartedKitchens().includes(code)) return callback("kitchen_started")
    
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
    
    let kitArray = [
      kitchen,
      ["data"]
    ];
    
    listOfChefs(kitchen).forEach(function(chef) {
      kitArray.push([
        chef, //socket id
        dish.pbnj, //objective
        [], //their tools to use (starts off with none)
        [] //what ingredients they currently have
      ]);
    });

    startedKitchens.push(kitArray);

    runKitchen(kitchen)
    
    console.log('start_kitchen_code:', kitchen);
  })
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

function createCode() {
  return Math.floor(Math.random() * 100000).toString().padStart(5, '0');
}

//get list of kitchens in socket io
// ["38902", "12839", "34891", etc]
function listOfKitchens() {
  const kitchens = Array.from(io.sockets.adapter.rooms);
  const list = []

  //only add kitchens with lengths under 6
  kitchens.forEach(function(kit) {
    if (kit[0].toString().length == 5) list.push(kit[0])
  });
  
  return list;
}

//with a kitchen, get list of chefs
// ["socket id here", "socket id here", etc]
function listOfChefs(kitchen) {
  const kitchens = Array.from(io.sockets.adapter.rooms);
  let list = undefined

  kitchens.forEach(function(kit) {
    if (kit[0].toString() == kitchen) {
      list = Array.from(kit[1])
    }
  });
  
  return list
}

//from a socket, get the kitchen they're in 
// "38492"
function getCurrentKitchen(socket) {
  return Array.from(socket.rooms)[1]
}

//get a list of started kitchen ids
// ["38902", "12839", etc]
function listOfStartedKitchens() {
  const list = []

  startedKitchens.forEach(function(kit) {
    list.push(kit[0])
  });

  return list;
}

//remove a started kitchen
//it dont return anything
function removeStartedKitchen(code) {
  startedKitchens.forEach(function(kit) {
    if (kit[0] == code) {
      startedKitchens.splice(startedKitchens.indexOf(kit), 1);
    }
  });
}

//there are individual functions for these because indexes update
//when kitchens start and go

//get a started kitchen's data
//returns big stuff
function startedKitchenData(kitchen) {
  let list = []

  startedKitchens.forEach(function(kit) {
    //if started kitchen has same code as provided
    if (kit[0] == kitchen) list = kit.slice();
  });
  
  return list;
}

async function runKitchen(code) {
  console.log("ok starting timer")

  let kitchenStarted = startedKitchenData(code);

  console.log(kitchenStarted)
  console.log("size is", kitchenStarted.length)

  //for each user in kitchen
  //give everyone their objective (skip first 2 indexes)
  kitchenStarted.forEach((kit, index) => {
    if (index < 2) return;
    
    io.to(kit[0]).emit("kitchen_add_objective", kit[1]);

    //give them their item periodically
    let objectiveItems = kit[1];

    let on = 0
    let thing = setInterval(function() {
      console.log("giving a " + objectiveItems[on] + " to " + kit[0])
      io.to(kit[0]).emit("kitchen_add_ingredient", objectiveItems[on], "top")

      if (on == 3) clearInterval(thing);
      on++;
    }, 1000);
  });

  //next

}