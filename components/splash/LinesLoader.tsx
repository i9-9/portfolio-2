"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LINE_COUNT = 24;

export function LinesLoader() {
  return (
    <div
      className="absolute inset-0 flex h-full min-h-dvh flex-col justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:px-6"
      aria-hidden
    >
      {Array.from({ length: LINE_COUNT }, (_, i) => (
        <div key={i} className="relative h-[2px] w-full shrink-0 overflow-hidden bg-border/50">
          <motion.div
            className="absolute inset-y-0 w-[22%] bg-foreground"
            initial={{ x: "-100%" }}
            animate={{ x: "560%" }}
            transition={{
              duration: 1.25,
              repeat: Infinity,
              delay: i * 0.045,
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
        "fixed inset-0 min-h-dvh bg-background select-none",
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
