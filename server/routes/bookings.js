const router = require('express').Router();
const Booking = require('../models/Booking');

// POST /api/bookings — create a new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ bookingRef: booking.bookingRef, id: booking._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/bookings — list all bookings (admin view)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('packageId', 'destination airline')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/:ref — get booking by reference
router.get('/:ref', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingRef: req.params.ref }).populate('packageId');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
