"use client";

interface GridOverlayProps {
  isVisible: boolean;
}

export function GridOverlay({ isVisible }: GridOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Horizontal modules — 1px rule at each multiple of --grid-row (matches nav bottom) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent calc(var(--grid-row) - 1px),
            rgb(239 68 68 / 0.2) calc(var(--grid-row) - 1px),
            rgb(239 68 68 / 0.2) var(--grid-row)
          )`,
        }}
        aria-hidden
      />

      {/* Vertical columns */}
      <div className="w-full h-full px-4 lg:px-12">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`col-${i}`}
              className="bg-red-500/5 border-x border-red-500/20"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
