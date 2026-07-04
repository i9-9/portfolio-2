import { cn } from "@/lib/utils";

type ChaosStarIconProps = {
  className?: string;
};

/** Eight-point chaos star — eight outward arrows from center. */
export function ChaosStarIcon({ className }: ChaosStarIconProps) {
  const cx = 12;
  const cy = 12;
  const inner = 3.5;
  const outer = 10;
  const head = 2.2;

  const rays = Array.from({ length: 8 }, (_, i) => {
    const rad = ((i * 45 - 90) * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const x1 = cx + inner * cos;
    const y1 = cy + inner * sin;
    const x2 = cx + outer * cos;
    const y2 = cy + outer * sin;

    const wingRad = (25 * Math.PI) / 180;
    const hx1 = x2 - head * Math.cos(rad - wingRad);
    const hy1 = y2 - head * Math.sin(rad - wingRad);
    const hx2 = x2 - head * Math.cos(rad + wingRad);
    const hy2 = y2 - head * Math.sin(rad + wingRad);

    return { x1, y1, x2, y2, hx1, hy1, hx2, hy2 };
  });

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 shrink-0", className)}
      aria-hidden
    >
      {rays.map((ray, i) => (
        <g key={i}>
          <line x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2} />
          <polyline points={`${ray.hx1},${ray.hy1} ${ray.x2},${ray.y2} ${ray.hx2},${ray.hy2}`} />
        </g>
      ))}
    </svg>
  );
}
