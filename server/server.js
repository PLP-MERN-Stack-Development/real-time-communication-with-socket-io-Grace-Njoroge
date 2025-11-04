// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


// Load environment variables
dotenv.config();


// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//routes 

// Store connected users and messages
const users = {};
const messages = [];
const typingUsers = {};
// Store chat messages per room
const messagesByRoom = {}; 
const pendingAcks = {}; // delivery tracking

// ----------- REST API: Pagination + Search -----------
app.get("/api/messages", (req, res) => {
  const { room, before, limit = 20, search } = req.query;
  if (!room) return res.status(400).json({ error: "room is required" });

  let list = messagesByRoom[room] || [];

  // Search text
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (m) =>
        (m.message || "").toLowerCase().includes(q) ||
        (m.sender || "").toLowerCase().includes(q)
    );
  }

  // Pagination
  if (before) {
    list = list.filter((m) => m.timestamp < before);
  }

  const start = Math.max(0, list.length - limit);
  const result = list.slice(start);
  return res.json(result);
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', ({ username, room }) => {
    users[socket.id] = { username, id: socket.id, room };
    socket.join(room);

    io.to(room).emit('user_list', 
      Object.values(users).filter(u => u.room === room)
    );

    io.to(room).emit('user_joined', { username, id: socket.id, room });

    // ✅ Send notification
    io.to(room).emit("userNotification", {
      message: `${username} joined the chat`,
      type: "join"
    });

    console.log(`${username} joined room: ${room}`);
  });

  // Handle chat messages
  socket.on("send_message", (data, callback) => {
    const msg = {
      id: Date.now(),
      sender: users[socket.id]?.username || "Anonymous",
      senderId: socket.id,
      message: data.message || "",
      image: data.image || null,   // ✅ support images
      timestamp: new Date().toISOString(),
    };

    // Save message globally and per-room
    messages.push(msg);
    const room = users[socket.id]?.room || 'global';
    if (!messagesByRoom[room]) messagesByRoom[room] = [];
    messagesByRoom[room].push(msg);

    // Limit stored messages to prevent memory issues
    if (messages.length > 100) {
      messages.shift();
    }
    if (messagesByRoom[room].length > 100) {
      messagesByRoom[room].shift();
    }

    // Broadcast to room
    io.to(room).emit("receive_message", msg);

    // Send back delivery ACK
    if (callback) callback({ id: msg.id });
  });

  // Track message read receipts
  socket.on("message:read", ({ messageId }) => {
    io.emit("message:read:update", { messageId, readerId: socket.id });
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    if (users[socket.id]) {
      const username = users[socket.id].username;

      if (isTyping) {
        typingUsers[socket.id] = username;
      } else {
        delete typingUsers[socket.id];
      }

      io.emit('typing_users', Object.values(typingUsers));
    }
  });

  // Handle private messages
  socket.on('private_message', ({ to, message }) => {
    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };

    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  // ✅ Handle message reactions
  socket.on("message:reaction", ({ messageId, reaction }) => {
    const user = users[socket.id];
    if (!user) return;

    io.to(user.room).emit("message:reaction:update", {
      messageId,
      reaction,
      userId: socket.id,
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      const { username, room } = user;

      io.to(room).emit('user_left', { username, id: socket.id });
      io.to(room).emit("userNotification", {
        message: `${username} left the chat`,
        type: "leave"
      });

      console.log(`${username} left the chat`);

      delete users[socket.id];
      delete typingUsers[socket.id];

      io.to(room).emit('user_list', 
        Object.values(users).filter(u => u.room === room)
      );

      io.to(room).emit('typing_users', Object.values(typingUsers));
    }
  });
});

// API routes
app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});


// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 