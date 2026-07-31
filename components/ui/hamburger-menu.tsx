"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_CINEMATIC, EASE_OUT_EXPO } from "@/lib/motion/easing";

interface HamburgerMenuProps {
  isOpen: boolean;
}

/**
 * Vertical travel to the shared center.
 * Bars sit farther apart so the converge reads as real motion, not a flicker.
 * (top 5.5 → center 12, bottom 17 → center 12)
 */
const LINE_TRAVEL = 5.75;

/** Long enough to watch each beat: converge, then morph into X. */
const MORPH_DURATION = 0.72;

/** Open: meet → rotate. Close: unwind → separate. */
const openTimes = [0, 0.4, 1] as const;
const closeTimes = [0, 0.38, 1] as const;

const openTransition = {
  duration: MORPH_DURATION,
  times: openTimes,
  ease: [EASE_OUT_EXPO, EASE_CINEMATIC] as const,
};

const closeTransition = {
  duration: MORPH_DURATION * 0.92,
  times: closeTimes,
  ease: [EASE_OUT_EXPO, EASE_CINEMATIC] as const,
};

/** Bottom bar trails slightly so the two lines read as separate actors. */
const LINE_STAGGER = 0.055;

export function HamburgerMenu({ isOpen }: HamburgerMenuProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div
        className="relative flex size-7 items-center justify-center"
        aria-hidden
      >
        <div className="relative size-6 text-foreground">
          <span
            className="absolute left-0 top-[5.5px] h-[1.5px] w-full origin-center bg-current"
            style={{
              transform: isOpen
                ? `translateY(${LINE_TRAVEL}px) rotate(45deg) scaleX(1.12)`
                : undefined,
            }}
          />
          <span
            className="absolute left-0 top-[17px] h-[1.5px] w-full origin-center bg-current"
            style={{
              transform: isOpen
                ? `translateY(${-LINE_TRAVEL}px) rotate(-45deg) scaleX(1.12)`
                : undefined,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex size-7 items-center justify-center"
      aria-hidden
    >
      <div className="relative size-6 text-foreground">
        <motion.span
          className="absolute left-0 top-[5.5px] h-[1.5px] w-full origin-center bg-current will-change-transform"
          initial={false}
          animate={
            isOpen
              ? {
                  y: [0, LINE_TRAVEL, LINE_TRAVEL],
                  rotate: [0, 0, 45],
                  scaleX: [1, 0.82, 1.12],
                }
              : {
                  y: [LINE_TRAVEL, LINE_TRAVEL, 0],
                  rotate: [45, 0, 0],
                  scaleX: [1.12, 0.82, 1],
                }
          }
          transition={isOpen ? openTransition : closeTransition}
        />
        <motion.span
          className="absolute left-0 top-[17px] h-[1.5px] w-full origin-center bg-current will-change-transform"
          initial={false}
          animate={
            isOpen
              ? {
                  y: [0, -LINE_TRAVEL, -LINE_TRAVEL],
                  rotate: [0, 0, -45],
                  scaleX: [1, 0.82, 1.12],
                }
              : {
                  y: [-LINE_TRAVEL, -LINE_TRAVEL, 0],
                  rotate: [-45, 0, 0],
                  scaleX: [1.12, 0.82, 1],
                }
          }
          transition={{
            ...(isOpen ? openTransition : closeTransition),
            delay: LINE_STAGGER,
          }}
        />
      </div>
    </div>
  );
}
