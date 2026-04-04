const router = require('express').Router();
const Contact = require('../models/Contact');

// GET /api/contact — list all contact inquiries (Leads view)
router.get('/', async (req, res) => {
  try {
    const inquiries = await Contact.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
