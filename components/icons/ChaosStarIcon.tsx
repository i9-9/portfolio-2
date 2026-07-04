import { cn } from "@/lib/utils";

type ChaosStarIconProps = {
  className?: string;
};

const CX = 12;
const CY = 12;
const INNER = 2.8;
const OUTER = 9.2;
const HEAD = 2.4;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Single outward arrow — shaft + filled head. */
function arrowParts(angleDeg: number) {
  const rad = toRad(angleDeg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const x1 = CX + INNER * cos;
  const y1 = CY + INNER * sin;
  const x2 = CX + OUTER * cos;
  const y2 = CY + OUTER * sin;

  const tipX = CX + (OUTER + 1.1) * cos;
  const tipY = CY + (OUTER + 1.1) * sin;
  const wing = toRad(28);
  const w1x = x2 - HEAD * Math.cos(rad - wing);
  const w1y = y2 - HEAD * Math.sin(rad - wing);
  const w2x = x2 - HEAD * Math.cos(rad + wing);
  const w2y = y2 - HEAD * Math.sin(rad + wing);

  return {
    shaft: `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)}`,
    head: `M ${w1x.toFixed(2)} ${w1y.toFixed(2)} L ${tipX.toFixed(2)} ${tipY.toFixed(2)} L ${w2x.toFixed(2)} ${w2y.toFixed(2)} Z`,
  };
}

const ARROWS = Array.from({ length: 8 }, (_, i) => arrowParts(i * 45 - 90));

/**
 * Symbol of Chaos — eight outward arrows, open center, bold filled heads.
 */
export function ChaosStarIcon({ className }: ChaosStarIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      className={cn("size-[18px] shrink-0", className)}
      aria-hidden
    >
      {ARROWS.map((arrow, i) => (
        <g key={i}>
          <path d={arrow.shaft} />
          <path d={arrow.head} fill="currentColor" stroke="none" />
        </g>
      ))}
    </svg>
  );
}
