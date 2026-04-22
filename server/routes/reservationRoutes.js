const express = require('express');
const router = express.Router();
const { createReservation, getUserReservations, getRestaurantReservations, updateReservationStatus } = require('../controllers/reservationController');
const { verifyToken } = require('../src/middleware/authMiddleware');

// All reservation routes are protected
router.use(verifyToken);

router.post('/', createReservation);
router.get('/', getUserReservations);
router.get('/restaurant/:id', getRestaurantReservations);
router.put('/:id/status', updateReservationStatus);

module.exports = router;
