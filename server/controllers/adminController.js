const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

// @desc Get platform statistics
// @route GET /api/admin/stats
// @access Private/Admin
exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const customerCount = await User.countDocuments({ role: 'customer' });
    const restaurantCount = await User.countDocuments({ role: 'restaurant' });
    
    const totalOrders = await Order.countDocuments();
    
    const revenueData = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    const topRestaurantData = await Order.aggregate([
      { $group: { _id: '$restaurantId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let topRestaurant = null;
    if (topRestaurantData.length > 0) {
      topRestaurant = await Restaurant.findById(topRestaurantData[0]._id).select('name cuisine');
    }

    res.json({
      stats: {
        totalUsers,
        customerCount,
        restaurantCount,
        totalOrders,
        totalRevenue,
        topRestaurant: topRestaurant ? topRestaurant.name : 'N/A'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Toggle restaurant status (isOpen/isApproved)
// @route PUT /api/admin/restaurants/:id
// @access Private/Admin
exports.updateRestaurantStatus = async (req, res) => {
  try {
    const { isOpen, isApproved } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (typeof isOpen !== 'undefined') restaurant.isOpen = isOpen;
    if (typeof isApproved !== 'undefined') restaurant.isApproved = isApproved;

    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get all restaurants (for admin management)
// @route GET /api/admin/restaurants
// @access Private/Admin
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
