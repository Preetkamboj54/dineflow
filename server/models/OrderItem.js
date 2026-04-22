const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true,
  },
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceAtTimeOfOrder: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('OrderItem', orderItemSchema);
