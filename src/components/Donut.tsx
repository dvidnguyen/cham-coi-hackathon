import { motion } from "motion/react";

/* ──────────────────────────────────────────────────────────────────────────
 * Editorial donut chart. Renders proportional ring segments from polar arc
 * paths (unambiguous geometry, butt caps, small gaps). Monochrome by design —
 * segments use white-opacity shades so it reads as part of the ink palette.
 *
 * NOTE: proportions only drive geometry; no percentage is ever displayed —
 * the visual conveys relative emphasis (largest share first) without implying
 * false numeric precision.
 * ────────────────────────────────────────────────────────────────────────── */

export type DonutSegment = {
  /** Relative size, 0..1. Need not sum to 1 — normalised internally. */
  proportion: number;
  /** Stroke colour for the segment. */
  color: string;
};

const R = 38;
const C = 50;
const STROKE = 11;
/** Visual gap between segments, in degrees. */
const GAP = 3;

/** Point on the circle for a given angle (0° = top, clockwise). */
function polar(angleDeg: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [C + R * Math.cos(a), C + R * Math.sin(a)];
}

/** SVG arc path drawing the ring from a0° to a1° clockwise. */
function arcPath(a0: number, a1: number): string {
  const [x0, y0] = polar(a0);
  const [x1, y1] = polar(a1);
  const large = a1 - a0 <= 180 ? 0 : 1;
  return `M ${x0.toFixed(3)} ${y0.toFixed(3)} A ${R} ${R} 0 ${large} 1 ${x1.toFixed(3)} ${y1.toFixed(3)}`;
}

export function Donut({
  segments,
  className = "",
}: {
  segments: DonutSegment[];
  className?: string;
}) {
  const total = segments.reduce((s, seg) => s + seg.proportion, 0) || 1;

  // Walk the ring, leaving a GAP between each segment.
  let cursor = 0;
  const arcs = segments.map((seg) => {
    const sweep = (seg.proportion / total) * 360;
    const a0 = cursor + (sweep > GAP ? GAP / 2 : 0);
    const a1 = cursor + sweep - (sweep > GAP ? GAP / 2 : 0);
    cursor += sweep;
    return { ...seg, d: arcPath(a0, a1) };
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* faint track behind the segments */}
      <circle
        cx={C}
        cy={C}
        r={R}
        stroke="rgba(245,245,244,0.08)"
        strokeWidth={STROKE}
      />
      {arcs.map((arc, i) => (
        <motion.path
          key={i}
          d={arc.d}
          stroke={arc.color}
          strokeWidth={STROKE}
          strokeLinecap="butt"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </svg>
  );
}
