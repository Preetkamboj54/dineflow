const { verifyToken: verifyJwt } = require('../utils/tokenUtils');

/**
 * Middleware to verify JWT token
 * @desc Protects routes by verifying the token in Authorization header
 * @access Private
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token missing or invalid format. Use Bearer <token>',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJwt(token);

    // Attach decoded user info to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
};

/**
 * Middleware to verify user roles
 * @desc Restricts access to routes based on user role
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 * @returns {Function} Middleware function
 */
const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. You do not have the required role: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  verifyRole,
};
