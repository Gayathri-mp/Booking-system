/**
 * TripScoreBadge.jsx — Unique Smart Trip Score Component
 *
 * Displays an animated circular progress ring showing the package's
 * server-computed tripScore (0-100). The colour + label change based on
 * the score tier returned by the scorer middleware.
 *
 * Score tiers (from server/middleware/scorer.js):
 *   ≥75 → Top Pick   (green)
 *   ≥55 → Trending   (pink)
 *   ≥35 → Best Value (blue)
 *   <35  → no badge shown
 */
import { useEffect, useRef } from 'react';

export default function TripScoreBadge({ tripScore, tripBadge }) {
  const circleRef = useRef(null);

  // Animate the stroke-dashoffset on mount (draws the ring from 0 to score%)
  useEffect(() => {
    if (!circleRef.current || tripScore == null) return;
    const circumference = 2 * Math.PI * 18; // r=18
    const offset = circumference - (tripScore / 100) * circumference;

    // Start fully hidden, then animate to the correct offset
    circleRef.current.style.strokeDasharray  = `${circumference}`;
    circleRef.current.style.strokeDashoffset = `${circumference}`;
    requestAnimationFrame(() => {
      circleRef.current.style.transition      = 'stroke-dashoffset 1s ease';
      circleRef.current.style.strokeDashoffset = `${offset}`;
    });
  }, [tripScore]);

  if (tripScore == null || !tripBadge) return null;

  const color = tripBadge.color;

  return (
    <div className="trip-score-badge" title={`Trip Score: ${tripScore}/100`}>
      {/* Circular SVG ring */}
      <svg width="44" height="44" viewBox="0 0 44 44" className="trip-score-ring">
        {/* Background track */}
        <circle
          cx="22" cy="22" r="18"
          fill="none" stroke="#e0e0e0" strokeWidth="3"
        />
        {/* Animated foreground arc */}
        <circle
          ref={circleRef}
          cx="22" cy="22" r="18"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        {/* Score number in centre */}
        <text
          x="22" y="26"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill={color}
        >
          {tripScore}
        </text>
      </svg>

      {/* Label pill */}
      <span
        className="trip-score-label"
        style={{ color: tripBadge.color, background: tripBadge.bg }}
      >
        {tripBadge.label}
      </span>
    </div>
  );
}
