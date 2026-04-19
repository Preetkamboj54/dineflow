const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

exports.getRestaurants = async (req, res) => {
  try {
    const { q, cuisine } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { cuisine: { $regex: q, $options: 'i' } },
      ];
    }

    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRestaurantMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurantId: req.params.id, isAvailable: true });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchFoodItems = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const items = await MenuItem.find({
      name: { $regex: q, $options: 'i' },
      isAvailable: true,
    }).populate('restaurantId', 'name cuisine address');

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
