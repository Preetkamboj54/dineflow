const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple request logger to debug routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const restaurantRoutes = require('./routes/restaurantRoutes');
app.use('/api/restaurants', restaurantRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const reservationRoutes = require('./routes/reservationRoutes');
app.use('/api/reservations', reservationRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
// 404 Handler
app.use((req, res) => {
  console.log(`404 Not Found: ${req.url}`);
  res.status(404).json({ message: `Route ${req.url} not found on this server` });
});

module.exports = app;
