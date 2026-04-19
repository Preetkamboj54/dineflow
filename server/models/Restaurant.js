const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  cuisine: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
