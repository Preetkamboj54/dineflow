const { verifyToken } = require('../src/utils/tokenUtils');
const Order = require('../models/Order');

// We will keep a map of socket instances by restaurant ID
// Realistically socket.io rooms handle this elegantly
const setupSocket = (io) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = verifyToken(token);
      socket.user = decoded;
      
      if (decoded.role !== 'restaurant') {
        return next(new Error('Authentication error: Must be a restaurant'));
      }
      
      // Store the restaurant ID on the socket
      // In MVP we assume user.id is the restaurantId or there is a 1-to-1 mapping
      socket.restaurantId = decoded.id;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} for restaurant ${socket.restaurantId}`);
    
    // Join a room specific to this restaurant
    socket.join(socket.restaurantId);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
