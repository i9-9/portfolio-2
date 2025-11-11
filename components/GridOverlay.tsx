"use client";

interface GridOverlayProps {
  isVisible: boolean;
}

export function GridOverlay({ isVisible }: GridOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Horizontal rows with 32px spacing */}
      <div className="absolute inset-0">
        <div className="max-w-[1600px] mx-auto h-full px-4 lg:px-12">
          <div className="h-full flex flex-col">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={`row-${i}`}
                className="h-8 border-t border-red-500/20"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Vertical columns */}
      <div className="max-w-[1600px] mx-auto h-full px-4 lg:px-12">
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
