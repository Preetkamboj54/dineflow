const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, updateOrderStatus, getRestaurantOrders } = require('../controllers/orderController');
const { verifyToken, verifyRole } = require('../src/middleware/authMiddleware');

// All order routes are protected
router.use(verifyToken);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/restaurant', verifyRole(['restaurant']), getRestaurantOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', verifyRole(['restaurant', 'admin']), updateOrderStatus);

module.exports = router;
