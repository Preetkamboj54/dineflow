const User = require('../../models/User');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @desc Register a user (customer, restaurant, or admin)
 * @access Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;

    // 1. Validation
    if (!name || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, phoneNumber, and role',
      });
    }

    const allowedRoles = ['customer', 'restaurant', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles are: ${allowedRoles.join(', ')}`,
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password);

    // 4. Create user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      role,
      passwordHash,
    });

    // 5. Generate JWT
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // 6. Return response (exclude passwordHash)
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error during registration',
      error: error.message,
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @desc Authenticate user and get token
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 3. Compare password
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 4. Generate JWT
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // 5. Return response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
    } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error during login',
      error: error.message,
    });
  }
};

/**
 * Get current authenticated user
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
exports.getMe = async (req, res) => {
  try {
    // 1. User is already identified by verifyToken middleware and attached to req.user
    const user = await User.findById(req.user.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching user profile',
      error: error.message,
    });
  }
};

