"use client";

/**
 * One-time (per session) opening stroke: dual frames on GD + Dev merge into one,
 * then a snake-like line runs between each “hold” (hero → name → nav → off-screen → home).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useAnimationControls,
  AnimatePresence,
} from "framer-motion";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "portfolio-v2-stroke-tour-v1";

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

type Box = { left: number; top: number; width: number; height: number };

function box(el: Element): Box {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type Edge = "n" | "s" | "e" | "w";

/** Point on rectangle edge facing toward target box center (for clean exits/entries). */
function anchorFacing(from: Box, toward: Box, edge: Edge): { x: number; y: number } {
  const cx = from.left + from.width / 2;
  const cy = from.top + from.height / 2;
  const tcx = toward.left + toward.width / 2;
  const tcy = toward.top + toward.height / 2;
  const dx = tcx - cx;
  const dy = tcy - cy;

  switch (edge) {
    case "n":
      return { x: cx + dx * 0.05, y: from.top };
    case "s":
      return { x: cx - dx * 0.05, y: from.top + from.height };
    case "w":
      return { x: from.left, y: cy + dy * 0.05 };
    case "e":
      return { x: from.left + from.width, y: cy - dy * 0.05 };
  }
}

function pickExitEntry(from: Box, to: Box): { exit: { x: number; y: number }; entry: { x: number; y: number } } {
  const fc = { x: from.left + from.width / 2, y: from.top + from.height / 2 };
  const tc = { x: to.left + to.width / 2, y: to.top + to.height / 2 };
  const dx = tc.x - fc.x;
  const dy = tc.y - fc.y;
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);

  if (ay >= ax * 0.85) {
    if (dy <= 0) {
      return {
        exit: anchorFacing(from, to, "n"),
        entry: anchorFacing(to, from, "s"),
      };
    }
    return {
      exit: anchorFacing(from, to, "s"),
      entry: anchorFacing(to, from, "n"),
    };
  }
  if (dx <= 0) {
    return {
      exit: anchorFacing(from, to, "w"),
      entry: anchorFacing(to, from, "e"),
    };
  }
  return {
    exit: anchorFacing(from, to, "e"),
    entry: anchorFacing(to, from, "w"),
  };
}

/** Cubic Bézier with lateral bend (reads as a snake / cable between UI nodes). */
function snakePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bend: number,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * bend;
  const ny = (dx / len) * bend;
  const cx1 = x1 + dx * 0.32 + nx * 1.15;
  const cy1 = y1 + dy * 0.32 + ny * 1.15;
  const cx2 = x1 + dx * 0.68 + nx * 1.15;
  const cy2 = y1 + dy * 0.68 + ny * 1.15;
  return `M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`;
}

function snakeBetween(from: Box, to: Box, bendScale = 1): string {
  const { exit, entry } = pickExitEntry(from, to);
  const dist = Math.hypot(entry.x - exit.x, entry.y - exit.y);
  const bend = Math.min(120, Math.max(36, dist * 0.22)) * bendScale;
  const flip = from.left + from.width / 2 > to.left + to.width / 2 ? -1 : 1;
  return snakePath(exit.x, exit.y, entry.x, entry.y, bend * flip);
}

type SnakeSeg = { id: number; d: string; duration: number };

function SnakeLayer({
  seg,
  onComplete,
}: {
  seg: SnakeSeg;
  onComplete: () => void;
}) {
  return (
    <motion.path
      d={seg.d}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      className="text-foreground"
      initial={{ pathLength: 0, opacity: 1 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ pathLength: { duration: seg.duration, ease: EASE }, opacity: { duration: 0.2 } }}
      onAnimationComplete={onComplete}
    />
  );
}

export function V2StrokeTour({ active }: { active: boolean }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const ran = useRef(false);
  const controls = useAnimationControls();
  const controlsRef = useRef(controls);
  controlsRef.current = controls;

  const [dualVisible, setDualVisible] = useState(false);
  const [dualL, setDualL] = useState<Box | null>(null);
  const [dualR, setDualR] = useState<Box | null>(null);
  const [monoVisible, setMonoVisible] = useState(false);
  const [snake, setSnake] = useState<SnakeSeg | null>(null);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
  const snakeDone = useRef<(() => void) | null>(null);

  const onSnakePathComplete = useCallback(() => {
    setSnake(null);
    const done = snakeDone.current;
    snakeDone.current = null;
    done?.();
  }, []);

  useEffect(() => {
    if (!active || reduced || pathname !== "/v2") return;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;
    if (ran.current) return;
    ran.current = true;

    const animation = controlsRef.current;
    let cancelled = false;

    const finish = () => {
      document.documentElement.classList.remove("v2-stroke-tour-active");
      setMonoVisible(false);
      setDualVisible(false);
      setSnake(null);
      if (typeof sessionStorage !== "undefined") sessionStorage.setItem(STORAGE_KEY, "1");
    };

    const runSnake = (d: string, duration: number) =>
      new Promise<void>((resolve) => {
        if (cancelled) {
          resolve();
          return;
        }
        snakeDone.current = resolve;
        setSvgSize({ w: window.innerWidth, h: window.innerHeight });
        setSnake({ id: Date.now() + Math.random(), d, duration });
      });

    (async () => {
      await sleep(520);
      if (cancelled) return;

      const wrap = document.querySelector('[data-v2-stroke-hero="wrap"]');
      const gd = document.querySelector('[data-v2-stroke-hero="gd"]');
      const dev = document.querySelector('[data-v2-stroke-hero="dev"]');
      const brand = document.querySelector('[data-v2-stroke-target="nav-brand"]');
      const links = document.querySelector('[data-v2-stroke-target="nav-links"]');

      if (!wrap || !gd || !dev || !brand) {
        ran.current = false;
        return;
      }

      document.documentElement.classList.add("v2-stroke-tour-active");

      const wrap0 = box(wrap);
      setDualL(box(gd));
      setDualR(box(dev));
      setDualVisible(true);

      await sleep(620);
      if (cancelled) return;

      setDualVisible(false);
      setMonoVisible(true);
      await animation.set({
        left: wrap0.left,
        top: wrap0.top,
        width: wrap0.width,
        height: wrap0.height,
        opacity: 1,
        transition: { duration: 0 },
      });
      await sleep(40);
      if (cancelled) return;

      const wrap1 = box(wrap);
      await animation.start({
        left: wrap1.left,
        top: wrap1.top,
        width: wrap1.width,
        height: wrap1.height,
        opacity: 1,
        transition: { duration: 0.58, ease: EASE },
      });
      await sleep(280);
      if (cancelled) return;

      /* --- snake: hero → name --- */
      await animation.start({ opacity: 0, transition: { duration: 0.14, ease: EASE } });
      const brandB0 = box(brand);
      const path1 = snakeBetween(wrap1, brandB0, 1);
      await runSnake(path1, 0.72);
      if (cancelled) return;

      await animation.set({
        left: brandB0.left,
        top: brandB0.top,
        width: brandB0.width,
        height: brandB0.height,
        opacity: 0,
        transition: { duration: 0 },
      });
      await animation.start({ opacity: 1, transition: { duration: 0.22, ease: EASE } });
      await sleep(2580);
      if (cancelled) return;

      const linksEl =
        links && links.getClientRects().length > 0 ? links : null;
      if (linksEl) {
        const brandB = box(brand);
        const lb0 = box(linksEl);

        await animation.start({ opacity: 0, transition: { duration: 0.14, ease: EASE } });
        const path2 = snakeBetween(brandB, lb0, 0.85);
        await runSnake(path2, 0.62);
        if (cancelled) return;

        await animation.set({
          left: lb0.left,
          top: lb0.top,
          width: lb0.width,
          height: lb0.height,
          opacity: 0,
          transition: { duration: 0 },
        });
        await animation.start({ opacity: 1, transition: { duration: 0.22, ease: EASE } });
        await sleep(1680);
        if (cancelled) return;

        const lb1 = box(linksEl);
        const vw = window.innerWidth;

        await animation.start({ opacity: 0, transition: { duration: 0.14, ease: EASE } });
        const ghost: Box = {
          left: vw + 24,
          top: lb1.top + lb1.height / 2 - 12,
          width: 24,
          height: 24,
        };
        const path3 = snakeBetween(lb1, ghost, 1.1);
        await runSnake(path3, 0.48);
        if (cancelled) return;

        const wrap2 = box(wrap);
        const path4 = snakeBetween(ghost, wrap2, 1.15);
        await runSnake(path4, 0.92);
        if (cancelled) return;

        await animation.set({
          left: wrap2.left,
          top: wrap2.top,
          width: wrap2.width,
          height: wrap2.height,
          opacity: 0,
          transition: { duration: 0 },
        });
        await animation.start({
          opacity: 1,
          transition: { duration: 0.28, ease: EASE_IN_OUT },
        });
        await sleep(400);
        if (cancelled) return;

        await animation.start({
          opacity: 0,
          transition: { duration: 0.32, ease: EASE },
        });
      } else {
        const brandB = box(brand);
        const vw = window.innerWidth;
        await animation.start({ opacity: 0, transition: { duration: 0.14, ease: EASE } });
        const ghost: Box = {
          left: vw + 24,
          top: brandB.top + brandB.height / 2 - 12,
          width: 24,
          height: 24,
        };
        const pathFallback = snakeBetween(brandB, ghost, 1);
        await runSnake(pathFallback, 0.5);
        if (cancelled) return;

        const wrap2 = box(wrap);
        const pathBack = snakeBetween(ghost, wrap2, 1.15);
        await runSnake(pathBack, 0.92);
        if (cancelled) return;

        await animation.set({
          left: wrap2.left,
          top: wrap2.top,
          width: wrap2.width,
          height: wrap2.height,
          opacity: 0,
          transition: { duration: 0 },
        });
        await animation.start({
          opacity: 1,
          transition: { duration: 0.28, ease: EASE_IN_OUT },
        });
        await sleep(400);
        if (cancelled) return;
        await animation.start({
          opacity: 0,
          transition: { duration: 0.32, ease: EASE },
        });
      }

      finish();
    })().catch(() => {
      finish();
    });

    return () => {
      cancelled = true;
      const pending = snakeDone.current;
      snakeDone.current = null;
      pending?.();
      document.documentElement.classList.remove("v2-stroke-tour-active");
    };
  }, [active, reduced, pathname]);

  useEffect(() => {
    if (!snake) return;
    const onResize = () =>
      setSvgSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [snake]);

  if (reduced || pathname !== "/v2") return null;

  const svgW = svgSize.w || (typeof window !== "undefined" ? window.innerWidth : 0);
  const svgH = svgSize.h || (typeof window !== "undefined" ? window.innerHeight : 0);

  return (
    <>
      <AnimatePresence>
        {dualVisible && dualL && dualR && (
          <>
            <motion.div
              key="dual-l"
              className="fixed z-[9990] pointer-events-none border border-foreground box-border"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.32, ease: EASE } }}
              transition={{ duration: 0.38, ease: EASE }}
              style={{
                left: dualL.left,
                top: dualL.top,
                width: dualL.width,
                height: dualL.height,
              }}
            />
            <motion.div
              key="dual-r"
              className="fixed z-[9990] pointer-events-none border border-foreground box-border"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.32, ease: EASE } }}
              transition={{ duration: 0.38, ease: EASE }}
              style={{
                left: dualR.left,
                top: dualR.top,
                width: dualR.width,
                height: dualR.height,
              }}
            />
          </>
        )}
      </AnimatePresence>

      {monoVisible && (
        <motion.div
          className="fixed z-[9990] pointer-events-none border border-foreground box-border bg-transparent"
          initial={false}
          animate={controls}
        />
      )}

      {snake && svgW > 0 && svgH > 0 && (
        <svg
          className="fixed inset-0 z-[9991] pointer-events-none text-foreground"
          width={svgW}
          height={svgH}
          aria-hidden
        >
          <SnakeLayer key={snake.id} seg={snake} onComplete={onSnakePathComplete} />
        </svg>
      )}
    </>
  );
}
