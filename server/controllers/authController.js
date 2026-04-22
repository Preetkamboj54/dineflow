const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phoneNumber,
      passwordHash,
      role: role || 'customer'
    });

    // If registering as a restaurant, create the restaurant profile
    if (user.role === 'restaurant') {
      await Restaurant.create({
        _id: user._id, // Share the same ID for easy lookups in MVP
        name: `${user.name}'s Kitchen`,
        cuisine: 'General',
        address: 'Please update your address',
        phone: user.phoneNumber || '000-000-0000',
        isOpen: true
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
