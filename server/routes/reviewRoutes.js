const express = require('express');
const router = express.Router();
const { createReview, getRestaurantReviews } = require('../controllers/reviewController');
const { verifyToken } = require('../src/middleware/authMiddleware');

router.get('/restaurant/:restaurantId', getRestaurantReviews);
router.post('/', verifyToken, createReview);

module.exports = router;
