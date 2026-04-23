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

    query.isApproved = true;

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

exports.addMenuItem = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const { name, description, price, category, image, isAvailable } = req.body;

    const newItem = new MenuItem({
      restaurantId,
      name,
      description,
      price,
      category,
      image,
      isAvailable
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const { name, description, price, category, image, isAvailable } = req.body;

    const updatedItem = await MenuItem.findOneAndUpdate(
      { _id: itemId, restaurantId: id },
      { name, description, price, category, image, isAvailable },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const deletedItem = await MenuItem.findOneAndDelete({ _id: itemId, restaurantId: id });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateRestaurantProfile = async (req, res) => {
  try {
    const { name, cuisine, address, phone, image, seatingOptions } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { name, cuisine, address, phone, image, seatingOptions },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
