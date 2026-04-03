const router = require('express').Router();
const Contact = require('../models/Contact');

// POST /api/contact — save a contact inquiry
router.post('/', async (req, res) => {
  try {
    const inquiry = new Contact(req.body);
    await inquiry.save();
    res.status(201).json({ message: 'Your message has been received. We will contact you shortly.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
