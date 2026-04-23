const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const MenuItem = require('../models/MenuItem');

exports.createOrder = async (req, res) => {
  try {
    console.log('CreateOrder Request Body:', req.body);
    const { restaurantId, items, paymentMethod, deliveryAddress } = req.body;

    if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
      console.log('Validation Failed: Missing restaurantId or items');
      return res.status(400).json({ message: 'Missing restaurantId or items' });
    }

    if (!paymentMethod) {
      console.log('Validation Failed: Payment method is required');
      return res.status(400).json({ message: 'Payment method is required' });
    }

    if (!deliveryAddress) {
      console.log('Validation Failed: Delivery address is required');
      return res.status(400).json({ message: 'Delivery address is required' });
    }
    
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      console.log('Processing item:', item.menuItemId);
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        console.log('MenuItem not found:', item.menuItemId);
        return res.status(404).json({ message: `MenuItem ${item.menuItemId} not found` });
      }
      if (!menuItem.isAvailable) {
        console.log('MenuItem not available:', menuItem.name);
        return res.status(400).json({ message: `MenuItem ${menuItem.name} is not available` });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        menuItemId: menuItem._id,
        quantity: item.quantity,
        priceAtTimeOfOrder: menuItem.price
      });
    }

    const order = new Order({
      userId: req.user.id,
      restaurantId,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      status: 'Pending'
    });

    console.log('Saving order...');
    await order.save();
    console.log('Order saved with ID:', order._id);

    const orderItems = await OrderItem.insertMany(
      orderItemsData.map(item => ({ ...item, orderId: order._id }))
    );
    console.log('Order items inserted');

    order.items = orderItems.map(oi => oi._id);
    await order.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name phoneNumber')
      .populate({
        path: 'items',
        populate: { path: 'menuItemId', select: 'name price' }
      });

    // Emit socket event to the restaurant's room
    const io = req.app.get('io');
    if (io) {
      io.to(restaurantId).emit('new_order', populatedOrder);
    }

    console.log('Sending 201 response');
    return res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id,
      totalAmount: order.totalAmount
    });
  } catch (error) {
    console.error('OrderController Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId', 'name')
      .populate({
        path: 'items',
        populate: { path: 'menuItemId', select: 'name price' }
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(id).populate('userId', 'name phoneNumber')
      .populate({
        path: 'items',
        populate: { path: 'menuItemId', select: 'name price' }
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Since we assume user.id is the restaurant id for restaurant users in MVP
    if (order.restaurantId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this order' });
    }

    order.status = status;
    await order.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(order.restaurantId.toString()).emit('order_status_update', order);
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.user.id })
      .populate('userId', 'name phoneNumber')
      .populate({
        path: 'items',
        populate: { path: 'menuItemId', select: 'name price' }
      })
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
