"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[1px] bg-foreground origin-left z-[9998] pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
