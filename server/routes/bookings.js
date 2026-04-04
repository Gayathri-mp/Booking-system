const router = require('express').Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/authMiddleware');


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

// GET /api/bookings — list all bookings (admin/owner view)
router.get('/', auth, async (req, res) => {

  try {
    const bookings = await Booking.find()
      .populate('packageId', 'destination airline totalPrice')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/stats — analytics for dashboard
router.get('/stats', auth, async (req, res) => {

  try {
    const totalBookings = await Booking.countDocuments();
    
    // Calculate total revenue from confirmed bookings
    const aggregate = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $lookup: { from: 'packages', localField: 'packageId', foreignField: '_id', as: 'pkg' } },
      { $unwind: '$pkg' },
      { $group: { _id: null, totalRevenue: { $sum: '$pkg.totalPrice' } } }
    ]);
    
    const totalRevenue = aggregate.length > 0 ? aggregate[0].totalRevenue : 0;
    const activePackages = await require('../models/Package').countDocuments();
    const avgRating = 4.8; // Logic would come from a Review model if implemented

    res.json({
      totalBookings,
      totalRevenue,
      activePackages,
      avgRating
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /api/bookings/:ref — get booking by reference
router.get('/:ref', auth, async (req, res) => {

  try {
    const booking = await Booking.findOne({ bookingRef: req.params.ref }).populate('packageId');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
