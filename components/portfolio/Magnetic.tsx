"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Wraps any element to be magnetically attracted to the cursor.
 * Spring-damped translate based on distance from element center.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSp = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const ySp = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x: xSp, y: ySp }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
