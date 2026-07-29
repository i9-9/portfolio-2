"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_CINEMATIC, EASE_OUT_EXPO } from "@/lib/motion/easing";

interface HamburgerMenuProps {
  isOpen: boolean;
}

/** Half the vertical gap between the two bars (14 − 8.5) / 2. */
const LINE_TRAVEL = 2.75;

/** Converge + rotate — long, cinematic, with a marked settle. */
const MORPH_DURATION = 0.58;

const morphTransition = {
  duration: MORPH_DURATION,
  ease: EASE_CINEMATIC,
};

/** Open: soft spring with clear overshoot. Close: cinematic unwind. */
const openRotate = {
  type: "spring" as const,
  stiffness: 320,
  damping: 18,
  mass: 0.95,
  delay: 0.06,
};

const closeRotate = {
  duration: MORPH_DURATION * 0.9,
  ease: EASE_OUT_EXPO,
};

export function HamburgerMenu({ isOpen }: HamburgerMenuProps) {
  const reducedMotion = useReducedMotion();

  const yTransition = reducedMotion ? { duration: 0 } : morphTransition;
  const rotateTransition = reducedMotion
    ? { duration: 0 }
    : isOpen
      ? openRotate
      : closeRotate;

  return (
    <div
      className="relative flex size-7 items-center justify-center"
      aria-hidden
    >
      <div className="relative size-6 text-foreground">
        <motion.span
          className="absolute left-0 top-[8.5px] h-[1.5px] w-full origin-center bg-current will-change-transform"
          initial={false}
          animate={{
            y: isOpen ? LINE_TRAVEL : 0,
            rotate: isOpen ? 45 : 0,
            scaleX: isOpen ? 1.12 : 1,
          }}
          transition={{
            y: yTransition,
            scaleX: yTransition,
            rotate: rotateTransition,
          }}
        />
        <motion.span
          className="absolute left-0 top-[14px] h-[1.5px] w-full origin-center bg-current will-change-transform"
          initial={false}
          animate={{
            y: isOpen ? -LINE_TRAVEL : 0,
            rotate: isOpen ? -45 : 0,
            scaleX: isOpen ? 1.12 : 1,
          }}
          transition={{
            y: yTransition,
            scaleX: yTransition,
            rotate: rotateTransition,
          }}
        />
      </div>
    </div>
  );
}
