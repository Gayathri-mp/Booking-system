/**
 * TripScoreBadge — Smart Trip Score Engine (Unique Feature)
 * Renders a compact banner strip at the TOP of a package card.
 * Shows score (0–100) as a horizontal progress bar + tier label.
 * Never overlaps card content — it's part of the normal layout flow.
 */

const TIERS = [
  { min: 75, label: '🏆 Top Pick',     color: '#2d7a4f', bg: '#edfdf4', bar: '#2d7a4f' },
  { min: 55, label: '⭐ Great Value',  color: '#1e6fbf', bg: '#eff6ff', bar: '#2563eb' },
  { min: 35, label: '👍 Recommended', color: '#b45309', bg: '#fffbeb', bar: '#f59e0b' },
  { min: 0,  label: null,             color: null,      bg: null,      bar: null       },
];

function getTier(score) {
  return TIERS.find(t => score >= t.min);
}

export default function TripScoreBadge({ tripScore }) {
  // Don't render anything if no score or score too low to tier
  if (tripScore == null) return null;
  const tier = getTier(tripScore);
  if (!tier.label) return null; // below 35 — don't clutter the card

  return (
    <div
      className="tsb-strip"
      style={{ background: tier.bg, borderBottom: `1.5px solid ${tier.bar}22` }}
      title={`Smart Trip Score: ${tripScore}/100 — computed from booking popularity, seat urgency & value`}
    >
      {/* Left: label pill */}
      <span className="tsb-label" style={{ color: tier.color, background: tier.color + '1a' }}>
        {tier.label}
      </span>

      {/* Middle: progress bar */}
      <div className="tsb-bar-track">
        <div
          className="tsb-bar-fill"
          style={{ width: `${tripScore}%`, background: tier.bar }}
        />
      </div>

      {/* Right: numeric score */}
      <span className="tsb-score" style={{ color: tier.color }}>
        {tripScore}<span style={{ fontSize: '0.65rem', fontWeight: 500, opacity: 0.7 }}>/100</span>
      </span>
    </div>
  );
}
