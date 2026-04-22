const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { verifyToken, verifyRole } = require('../src/middleware/authMiddleware');

router.get('/', restaurantController.getRestaurants);
router.get('/search', restaurantController.searchFoodItems);
router.get('/:id', restaurantController.getRestaurantById);
router.get('/:id/menu', restaurantController.getRestaurantMenu);
router.post('/:id/menu', verifyToken, verifyRole(['restaurant']), restaurantController.addMenuItem);
router.put('/:id/menu/:itemId', verifyToken, verifyRole(['restaurant']), restaurantController.updateMenuItem);
router.delete('/:id/menu/:itemId', verifyToken, verifyRole(['restaurant']), restaurantController.deleteMenuItem);
router.put('/:id/profile', verifyToken, verifyRole(['restaurant']), restaurantController.updateRestaurantProfile);

module.exports = router;
