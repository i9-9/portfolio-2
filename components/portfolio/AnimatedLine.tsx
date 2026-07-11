"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  EASE_OUT_EXPO,
  MOBILE_MENU_PANEL_CLOSE_DURATION,
} from "@/lib/motion/easing";

/** Same scaleX reveal as mobile-menu divider lines. */
export function AnimatedLine({
  inView,
  delay = 0,
  duration = MOBILE_MENU_PANEL_CLOSE_DURATION,
}: {
  inView: boolean;
  delay?: number;
  /** Seconds — longer reads clearer on the work list. */
  duration?: number;
}) {
  const reducedMotion = useReducedMotion();
  const skip = reducedMotion === true;

  return (
    <motion.div
      className="h-px w-full origin-left bg-border"
      initial={{ scaleX: skip ? 1 : 0 }}
      animate={{ scaleX: skip || inView ? 1 : 0 }}
      transition={{
        duration: skip ? 0 : duration,
        delay: skip || !inView ? 0 : delay,
        ease: EASE_OUT_EXPO,
      }}
    />
  );
}
