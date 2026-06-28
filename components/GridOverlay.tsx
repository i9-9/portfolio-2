"use client";

interface GridOverlayProps {
  isVisible: boolean;
}

export function GridOverlay({ isVisible }: GridOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden>
      {/* Horizontal modules */}
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
      />

      {/* Margin guides */}
      <div
        className="absolute inset-y-0 left-0 border-r border-dashed border-red-500/15"
        style={{ width: "var(--grid-spec-margin, 80px)" }}
      />
      <div
        className="absolute inset-y-0 right-0 border-l border-dashed border-red-500/15"
        style={{ width: "var(--grid-spec-margin, 80px)" }}
      />

      {/* Columns */}
      <div className="h-full w-full px-4 lg:px-6">
        <div className="grid h-full grid-cols-12 gap-4 lg:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`col-${i}`}
              className="h-full border-x border-red-500/20 bg-red-500/[0.05]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
