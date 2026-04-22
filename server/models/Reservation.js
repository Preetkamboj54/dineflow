const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    index: true,
  },
  time: {
    type: String, // HH:mm
    required: true,
    index: true,
  },
  partySize: {
    type: Number,
    required: true,
    min: 1,
  },
  seatingPreference: {
    type: String,
    default: 'Indoor',
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

// Create a compound index for conflict detection
reservationSchema.index({ restaurantId: 1, date: 1, time: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
