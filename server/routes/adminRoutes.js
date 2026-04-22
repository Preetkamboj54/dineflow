const express = require('express');
const router = express.Router();
const { getPlatformStats, getAllRestaurants, updateRestaurantStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/restaurants', getAllRestaurants);
router.put('/restaurants/:id', updateRestaurantStatus);

module.exports = router;
