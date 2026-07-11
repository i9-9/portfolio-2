"use client";

import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";

export function AnimatedLine({
  inView,
  delay = 0,
}: {
  inView: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className="w-full h-px bg-border origin-left"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: inView ? 1 : 0 }}
      transition={{ duration: 1.4, delay, ease: EASE_OUT_EXPO }}
    />
  );
}
