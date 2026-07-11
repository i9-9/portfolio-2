"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export function CustomCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const isVisible = useRef(false);
  const [ready, setReady] = useState(false);

  const DOT = 8;
  const RING = 28;

  const dotLeft = useTransform(mouseX, (v) => v - DOT / 2);
  const dotTop = useTransform(mouseY, (v) => v - DOT / 2);

  const lagX = useSpring(mouseX, { stiffness: 220, damping: 22, mass: 0.35 });
  const lagY = useSpring(mouseY, { stiffness: 220, damping: 22, mass: 0.35 });

  const ringLeft = useTransform(lagX, (v) => v - RING / 2);
  const ringTop = useTransform(lagY, (v) => v - RING / 2);
  const ringScale = useMotionValue(1);
  const ringScaleSp = useSpring(ringScale, { stiffness: 400, damping: 30 });
  const dotOpacity = useMotionValue(0);

  useLayoutEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setReady(true);

    let raf = 0;
    const pending = { x: 0, y: 0, dirty: false };

    const flushMove = () => {
      raf = 0;
      if (!pending.dirty) return;
      pending.dirty = false;
      mouseX.set(pending.x);
      mouseY.set(pending.y);
      if (!isVisible.current) {
        isVisible.current = true;
        dotOpacity.set(1);
      }
    };

    const onMove = (e: MouseEvent) => {
      pending.x = e.clientX;
      pending.y = e.clientY;
      pending.dirty = true;
      if (raf === 0) raf = requestAnimationFrame(flushMove);
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button")) ringScale.set(2);
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button")) ringScale.set(1);
    };
    const onLeave = () => dotOpacity.set(0);
    const onEnter = () => dotOpacity.set(1);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      if (raf !== 0) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[10000] will-change-transform border border-foreground/30 bg-transparent dark:border-white/40"
        style={{
          left: ringLeft,
          top: ringTop,
          width: RING,
          height: RING,
          scale: ringScaleSp,
          opacity: dotOpacity,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[10001] will-change-transform bg-foreground dark:bg-white"
        style={{
          left: dotLeft,
          top: dotTop,
          width: DOT,
          height: DOT,
          opacity: dotOpacity,
        }}
      />
    </>
  );
}
