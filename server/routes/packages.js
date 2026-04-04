const router  = require('express').Router();
const Package = require('../models/Package');
const { computeTripScores } = require('../middleware/scorer');

// GET /api/packages  — list all, supports ?type=indian&stars=3&withFlights=true&destination=goa
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type)        filter.type = req.query.type;
    if (req.query.stars)       filter.stars = Number(req.query.stars);
    if (req.query.withFlights !== undefined)
                               filter.withFlights = req.query.withFlights === 'true';
    if (req.query.destination) filter.destination = { $regex: req.query.destination, $options: 'i' };

    const packages = await Package.find(filter).sort({ createdAt: 1 });

    // ── Smart Trip Score Engine ──────────────────────────────────────────────
    // Each package gets a server-computed tripScore (0–100) and tripBadge
    // based on booking popularity, price value, and seat urgency.
    const scored = await computeTripScores(packages);

    res.json(scored);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/packages/:id
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
