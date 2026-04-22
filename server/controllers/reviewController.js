const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

exports.createReview = async (req, res) => {
  try {
    const { orderId, restaurantRating, dishRatings, comment } = req.body;
    const userId = req.user.id;

    // 1. Validate order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== userId) return res.status(403).json({ message: 'Unauthorized' });
    
    const restaurantId = order.restaurantId;

    // 2. Check if already reviewed
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) return res.status(400).json({ message: 'Order already reviewed' });

    // 3. Create Review
    const review = new Review({
      userId,
      restaurantId,
      orderId,
      restaurantRating,
      dishRatings,
      comment
    });
    await review.save();

    // 4. Update Restaurant Aggregate
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
      const oldTotal = restaurant.rating * restaurant.numReviews;
      restaurant.numReviews += 1;
      restaurant.rating = (oldTotal + restaurantRating) / restaurant.numReviews;
      await restaurant.save();
    }

    // 5. Update MenuItems Aggregates
    if (dishRatings && dishRatings.length > 0) {
      for (const dr of dishRatings) {
        const item = await MenuItem.findById(dr.menuItemId);
        if (item) {
          const oldItemTotal = item.rating * item.numReviews;
          item.numReviews += 1;
          item.rating = (oldItemTotal + dr.rating) / item.numReviews;
          await item.save();
        }
      }
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
