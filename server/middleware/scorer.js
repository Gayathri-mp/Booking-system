/**
 * scorer.js — Smart Trip Score Engine (Unique Feature)
 *
 * Computes a tripScore (0–100) for each package based on three signals:
 *   • Popularity  (40 pts) — how often this destination has been booked
 *   • Value       (35 pts) — price vs. average price for same star rating
 *   • Urgency     (25 pts) — seat scarcity (fewer seats = higher urgency = higher score)
 *
 * The combined score acts as a "quality signal" — similar to ranking algorithms
 * used by premium booking platforms.
 */

const Booking = require('../models/Booking');
const Package = require('../models/Package');

/**
 * Compute trip scores for a list of packages.
 * @param {Array} packages — Mongoose documents
 * @returns {Array}         — plain objects with tripScore and tripBadge added
 */
async function computeTripScores(packages) {
  if (!packages || packages.length === 0) return [];

  // ── 1. Popularity: count bookings per packageId ──────────────────────────
  const packageIds = packages.map(p => p._id);
  const bookingCounts = await Booking.aggregate([
    { $match: { packageId: { $in: packageIds }, status: { $ne: 'cancelled' } } },
    { $group: { _id: '$packageId', count: { $sum: 1 } } },
  ]);
  const countMap = {};
  bookingCounts.forEach(b => { countMap[b._id.toString()] = b.count; });
  const maxCount = Math.max(...Object.values(countMap), 1); // avoid ÷0

  // ── 2. Value: average price per star tier (all packages in DB) ───────────
  const allPriceStats = await Package.aggregate([
    { $group: { _id: '$stars', avgPrice: { $avg: '$totalPrice' } } },
  ]);
  const avgPriceByStars = {};
  allPriceStats.forEach(s => { avgPriceByStars[s._id] = s.avgPrice; });

  // ── 3. Score each package ────────────────────────────────────────────────
  return packages.map(pkg => {
    const p = pkg.toObject ? pkg.toObject() : { ...pkg };

    // Popularity score (0–40)
    const bookings     = countMap[p._id.toString()] || 0;
    const popularityPt = Math.round((bookings / maxCount) * 40);

    // Value score (0–35) — cheaper than average for its stars = better value
    const avgPrice  = avgPriceByStars[p.stars] || p.totalPrice || 1;
    const priceDiff = (avgPrice - (p.totalPrice || 0)) / avgPrice; // positive = cheaper
    const valuePt   = Math.round(Math.min(Math.max((priceDiff + 0.5) * 35, 0), 35));

    // Urgency score (0–25) — parse seat count from text like "9 seat(s) left"
    let urgencyPt = 12; // default mid
    if (p.seatsLeft) {
      const match = p.seatsLeft.match(/\d+/);
      if (match) {
        const seats = parseInt(match[0]);
        // Fewer seats = more urgency = higher score (max at 1 seat)
        urgencyPt = Math.round(Math.max(25 - (seats * 2), 5));
      }
    }

    const tripScore = Math.min(popularityPt + valuePt + urgencyPt, 100);

    // Badge label
    let tripBadge = null;
    if (tripScore >= 75)       tripBadge = { label: 'Top Pick',  color: '#2d7a4f', bg: '#e6f4ed' };
    else if (tripScore >= 55)  tripBadge = { label: 'Trending',  color: '#c2185b', bg: '#fce4ec' };
    else if (tripScore >= 35)  tripBadge = { label: 'Best Value', color: '#1565c0', bg: '#e3f2fd' };

    return { ...p, tripScore, tripBadge };
  });
}

module.exports = { computeTripScores };
