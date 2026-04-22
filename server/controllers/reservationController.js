const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

exports.createReservation = async (req, res) => {
  try {
    const { restaurantId, date, time, partySize, seatingPreference } = req.body;

    if (!restaurantId || !date || !time || !partySize) {
      return res.status(400).json({ message: 'Missing required reservation details' });
    }

    // 1. Validate date is in the future
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (reservationDate < today) {
      return res.status(400).json({ message: 'Reservation date must be in the future' });
    }

    // 2. Conflict check
    // For MVP, we'll use a default capacity of 10 tables per time slot if not specified in Restaurant model
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const capacity = restaurant.capacity || 10;
    const existingReservations = await Reservation.countDocuments({
      restaurantId,
      date,
      time
    });

    if (existingReservations >= capacity) {
      return res.status(400).json({ message: 'This time slot is already full' });
    }

    // 3. Create reservation
    const reservation = new Reservation({
      userId: req.user.id,
      restaurantId,
      date,
      time,
      partySize,
      seatingPreference,
      status: 'Pending'
    });

    await reservation.save();

    res.status(201).json({
      message: 'Reservation requested successfully',
      reservationId: reservation._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .populate('restaurantId', 'name')
      .sort({ date: 1, time: 1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRestaurantReservations = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Set up start and end of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const reservations = await Reservation.find({
      restaurantId: id,
      date: {
        $gte: startOfToday.toISOString().split('T')[0]
      }
    })
      .populate('userId', 'name email phoneNumber')
      .sort({ date: 1, time: 1 });
      
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Authorization: only the restaurant owner or admin can update status
    // Assuming req.user.id is restaurantId for simplicity as per previous patterns
    if (reservation.restaurantId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    reservation.status = status;
    await reservation.save();

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
