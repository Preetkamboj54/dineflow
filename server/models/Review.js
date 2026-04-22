const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true, // One review per order
  },
  restaurantRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  dishRatings: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    }
  }],
  comment: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
