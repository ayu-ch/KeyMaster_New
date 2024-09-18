const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(cors({
  origin:"http://localhost:5173"
}));
const usersInRooms = {};

function generateRoomId() {
  const roomIdLength = 6;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let roomId = '';

  for (let i = 0; i < roomIdLength; i++) {
    roomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return roomId;
}

io.on('connection', (socket) => {
  socket.on('createRoom', () => {
    console.log('A user connected');
    const roomId = generateRoomId();
    socket.join(roomId);
    usersInRooms[roomId] = {
      members: {},
      allPressed: false,
    };
    socket.emit('roomCreated', roomId);
  });

  socket.on('indexIncrement', (data) => {
    console.log('Received index increment:', data.newIndex);
    socket.broadcast.emit('indexIncrement', { newIndex: data.newIndex });
  });

  socket.on('joinRoom', (roomId) => {
    console.log('A user connected');
    socket.join(roomId);

    if (!usersInRooms[roomId]) {
      usersInRooms[roomId] = {
        members: {}, 
        allPressed: false,
      };
    }

    usersInRooms[roomId].members[socket.id] = false; 
    io.to(roomId).emit('joinedRoom', roomId);
    io.to(roomId).emit('usersInRoom', Object.keys(usersInRooms[roomId].members));
    console.log(`User joined room ${roomId}`);
  });

  

  socket.on('buttonPressed', (receivedRoomId) => {
    const roomId = receivedRoomId || (Object.keys(socket.rooms).find((roomId) => roomId !== socket.id));
    
    if (roomId) {
      console.log(`Button pressed in room: ${roomId}`);
      io.to(roomId).emit('buttonPressed', roomId); 
    } else {
      console.log('Error: Room ID not found');
    }
  
    if (usersInRooms[roomId] && usersInRooms[roomId].members) {
      
      usersInRooms[roomId].members[socket.id] = !usersInRooms[roomId].members[socket.id];
  
      if (Object.values(usersInRooms[roomId].members).every((pressed) => pressed)) {
        usersInRooms[roomId].allPressed = true;
        io.to(roomId).emit('startTypingTest');
      } else {
        usersInRooms[roomId].allPressed = false;
      }
    }
  });

  socket.on('testCompleted', ({ userId, wpm, accuracy }) => {
    console.log(`Test completed for user ${userId}: WPM=${wpm}, Accuracy=${accuracy}`);
  
    io.to(socket.id).emit('yourTestResults', { userId, wpm, accuracy });
    io.to(socket.rooms.values().next().value).emit('opponentTestResults', { userId, wpm, accuracy }); 
  });

  socket.on('disconnect', () => {
    for (const roomId in usersInRooms) {
      if (usersInRooms[roomId].members[socket.id] !== undefined) {
        delete usersInRooms[roomId].members[socket.id];
        io.to(roomId).emit('usersInRoom', Object.keys(usersInRooms[roomId].members));
      }
    }
  });
});



const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});