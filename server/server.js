const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const setupSocket = require('./sockets/orderSocket');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

setupSocket(io);
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
