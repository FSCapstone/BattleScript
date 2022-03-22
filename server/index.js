const { db } = require('./db');
const PORT = process.env.PORT || 8080;
const app = require('./app');
const seed = require('../script/seed');
const { Server } = require('socket.io');
//need to import Server after npm i socket.io

const io = new Server({
  //Create a new server to host sockets
  //from docs -> add cors Cross Origin Request Support
  cors: {
    origin: ['http://localhost:8080'],
    methods: ['GET', 'POST'],
  },
});
// io on is like an event listener -> on connection; anytime anyone connects
io.on('connection', (socket) => {
  console.log(`${socket.id} connecctedddddddddddddddd`);
  //adding event listener to the socket -> anytime we get a new message from the client
  socket.on('new-message', (message, room) => {
    if (room === '') {
      //check if there is a specified room
      socket.broadcast.emit('message-from-others', message); //message going back to client broadcast send it to other connected sockets
    } else {
      socket.to(room).emit('message-from-others', message); //if there is a room only send message to those in that same room
    }
  }); //sticks around b/c connection is still there
  socket.on('join-room', (room) => {
    console.log(room);
    socket.join(room);
  });
});

io.listen(3000); //CORS support becuase hosting on localhost:8080 and server is on 3000

const init = async () => {
  try {
    if (process.env.SEED === 'true') {
      await seed();
    } else {
      await db.sync();
    }
    // start listening (and create a 'server' object representing our server)
    app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();
