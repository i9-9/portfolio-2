"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LINE_COUNT = 14;
const LINE_GAP = "calc(var(--grid-row) / 4)";

export function LinesLoader() {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-center px-4 lg:px-6"
      style={{ gap: LINE_GAP }}
      aria-hidden
    >
      {Array.from({ length: LINE_COUNT }, (_, i) => (
        <div key={i} className="relative h-px w-full overflow-hidden bg-border/50">
          <motion.div
            className="absolute inset-y-0 w-[22%] bg-foreground"
            initial={{ x: "-100%" }}
            animate={{ x: "560%" }}
            transition={{
              duration: 1.25,
              repeat: Infinity,
              delay: i * 0.065,
              ease: [0.45, 0, 0.15, 1],
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function LinesLoaderScreen({
  className,
  zClassName = "z-[10000]",
}: {
  className?: string;
  zClassName?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-background select-none",
        zClassName,
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <LinesLoader />
    </div>
  );
}
