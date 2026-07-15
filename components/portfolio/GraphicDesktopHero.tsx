"use client";

import {
  useEffect, useState, useRef, useCallback, useMemo,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MAX_FILES = 18;
/** Pixels of movement before a pointer gesture counts as drag (click opens block view). */
const DRAG_THRESHOLD_PX = 10;

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function seededUnit(seed: number, i: number): number {
  const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

type LayoutItem = {
  name: string;
  leftPct: number;
  topPct: number;
  rot: number;
  baseZ: number;
  width: number;
};

type Interaction = {
  name: string;
  startX: number;
  startY: number;
  isDrag: boolean;
};

function displayName(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

export function GraphicDesktopHero({ className }: { className?: string }) {
  const [images, setImages] = useState<string[]>([]);
  const [offset, setOffset] = useState<Record<string, { dx: number; dy: number }>>({});
  const [zBoost, setZBoost] = useState<Record<string, number>>({});
  const [openFile, setOpenFile] = useState<string | null>(null);
  const [portalReady, setPortalReady] = useState(false);

  const zCounter = useRef(200);
  const dragging = useRef<string | null>(null);
  const lastPtr = useRef({ x: 0, y: 0 });
  const interaction = useRef<Interaction | null>(null);
  /** +/-1 for image crossfade slide direction after keyboard or button navigation */
  const navDirRef = useRef(1);

  /** Viewer swipe state */
  const [viewerSwipeX, setViewerSwipeX] = useState(0);
  const [viewerSwipeY, setViewerSwipeY] = useState(0);
  const viewerSwipeStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const viewerSwiping = useRef(false);
  const viewerSwipeDirection = useRef<"horizontal" | "vertical" | null>(null);

  useEffect(() => setPortalReady(true), []);

  useEffect(() => {
    fetch("/api/graphics-images")
      .then((r) => r.json())
      .then((d: { images?: string[] }) => {
        if (d.images?.length) setImages(d.images.slice(0, MAX_FILES));
      })
      .catch(() => {});
  }, []);

  const goAdjacent = useCallback((delta: number) => {
    setOpenFile((cur) => {
      if (!cur || images.length < 2) return cur;
      const i = images.indexOf(cur);
      if (i < 0) return cur;
      const n = images.length;
      navDirRef.current = delta >= 0 ? 1 : -1;
      return images[(i + delta + n) % n];
    });
  }, [images]);

  useEffect(() => {
    if (!openFile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    // Reset swipe state when image changes
    setViewerSwipeX(0);
    setViewerSwipeY(0);
    viewerSwipeStart.current = null;
    viewerSwiping.current = false;
    viewerSwipeDirection.current = null;
    
    const onKey = (e: KeyboardEvent) => {
      const ae = document.activeElement;
      if (
        ae instanceof HTMLInputElement ||
        ae instanceof HTMLTextAreaElement ||
        (ae instanceof HTMLElement && ae.isContentEditable)
      )
        return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpenFile(null);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goAdjacent(1);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goAdjacent(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [openFile, goAdjacent]);

  const openIndex = openFile ? images.indexOf(openFile) : -1;
  const canNavigate = Boolean(openFile) && images.length > 1;

  const layout = useMemo((): LayoutItem[] => {
    return images.map((name, i) => {
      const seed = hashSeed(name) + i;
      const u = (k: number) => seededUnit(seed, k);
      const leftPct = 4 + u(1) * 72;
      const topPct = 6 + u(2) * 65;
      const rot = (u(3) - 0.5) * 16;
      const baseZ = 10 + Math.floor(u(4) * 80);
      const width = 120 + u(5) * 100;
      return { name, leftPct, topPct, rot, baseZ, width };
    });
  }, [images]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    const inter = interaction.current;

    if (inter && !inter.isDrag && dragging.current === null) {
      const dx = e.clientX - inter.startX;
      const dy = e.clientY - inter.startY;
      if (dx * dx + dy * dy >= DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
        inter.isDrag = true;
        dragging.current = inter.name;
        zCounter.current += 1;
        setZBoost((z) => ({ ...z, [inter.name]: zCounter.current }));
        lastPtr.current = { x: e.clientX, y: e.clientY };
      }
      return;
    }

    const id = dragging.current;
    if (!id) return;
    const pdx = e.clientX - lastPtr.current.x;
    const pdy = e.clientY - lastPtr.current.y;
    lastPtr.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => {
      const cur = prev[id] ?? { dx: 0, dy: 0 };
      return { ...prev, [id]: { dx: cur.dx + pdx, dy: cur.dy + pdy } };
    });
  }, []);

  const onPointerUpWindow = useCallback(() => {
    const inter = interaction.current;
    if (inter && !inter.isDrag && dragging.current === null) {
      navDirRef.current = 1;
      setOpenFile(inter.name);
    }
    dragging.current = null;
    interaction.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUpWindow);
    window.addEventListener("pointercancel", onPointerUpWindow);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUpWindow);
      window.removeEventListener("pointercancel", onPointerUpWindow);
    };
  }, [onPointerMove, onPointerUpWindow]);

  const onCardPointerDown = (name: string, e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    interaction.current = {
      name,
      startX: e.clientX,
      startY: e.clientY,
      isDrag: false,
    };
    lastPtr.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onCardPointerUp = (_name: string, e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore double-release */
    }
  };

  const handleViewerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canNavigate) return;
    viewerSwipeStart.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    viewerSwiping.current = false;
    viewerSwipeDirection.current = null;
    setViewerSwipeX(0);
    setViewerSwipeY(0);
  };

  const handleViewerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canNavigate || !viewerSwipeStart.current) return;
    
    const dx = e.clientX - viewerSwipeStart.current.x;
    const dy = e.clientY - viewerSwipeStart.current.y;
    
    // Detect swipe direction if not yet determined
    if (!viewerSwiping.current && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      if (Math.abs(dx) > Math.abs(dy) * 1.5) {
        // More horizontal than vertical
        viewerSwipeDirection.current = "horizontal";
        viewerSwiping.current = true;
      } else if (Math.abs(dy) > Math.abs(dx) * 1.5) {
        // More vertical than horizontal
        viewerSwipeDirection.current = "vertical";
        viewerSwiping.current = true;
      } else {
        // Ambiguous direction, cancel swipe
        viewerSwipeStart.current = null;
        return;
      }
    }
    
    if (viewerSwiping.current) {
      if (viewerSwipeDirection.current === "horizontal") {
        // Apply smooth resistance curve at boundaries for horizontal swipe
        let swipeX = dx;
        const maxSwipe = window.innerWidth * 0.5;
        if (Math.abs(swipeX) > maxSwipe) {
          const excess = Math.abs(swipeX) - maxSwipe;
          // Smoother resistance curve using logarithmic function
          const resistance = maxSwipe + Math.log(1 + excess) * 30;
          swipeX = Math.sign(swipeX) * resistance;
        }
        setViewerSwipeX(swipeX);
      } else if (viewerSwipeDirection.current === "vertical") {
        // Only allow downward swipe to close, smooth resistance for upward
        let swipeY = dy;
        if (swipeY < 0) {
          // Upward swipe - strong resistance with smooth curve
          swipeY = -Math.log(1 + Math.abs(swipeY)) * 15;
        } else {
          // Downward swipe - allow but with smooth resistance curve at the end
          const maxSwipe = window.innerHeight * 0.6;
          if (swipeY > maxSwipe) {
            const excess = swipeY - maxSwipe;
            swipeY = maxSwipe + Math.log(1 + excess) * 40;
          }
        }
        setViewerSwipeY(swipeY);
      }
    }
  };

  const handleViewerPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canNavigate || !viewerSwipeStart.current) return;
    
    const dx = e.clientX - viewerSwipeStart.current.x;
    const dy = e.clientY - viewerSwipeStart.current.y;
    const dt = Date.now() - viewerSwipeStart.current.time;
    
    if (viewerSwiping.current && viewerSwipeDirection.current === "horizontal") {
      // Handle horizontal swipe for navigation - more sensitive thresholds
      const velocity = Math.abs(dx) / dt; // pixels per ms
      const swipeThreshold = window.innerWidth * 0.2; // Reduced from 0.25
      const velocityThreshold = 0.25; // Reduced from 0.3
      
      if (Math.abs(dx) > swipeThreshold || velocity > velocityThreshold) {
        if (dx > 0) {
          // Swiped right, go to previous
          navDirRef.current = -1;
          goAdjacent(-1);
        } else {
          // Swiped left, go to next
          navDirRef.current = 1;
          goAdjacent(1);
        }
      } else {
        // Animate back to center with spring
        setViewerSwipeX(0);
        setTimeout(() => {
          viewerSwipeStart.current = null;
          viewerSwiping.current = false;
          viewerSwipeDirection.current = null;
        }, 450);
        return;
      }
    } else if (viewerSwiping.current && viewerSwipeDirection.current === "vertical") {
      // Handle vertical swipe to close - more sensitive
      const velocity = dy / dt; // pixels per ms (positive = downward)
      const swipeThreshold = window.innerHeight * 0.12; // Reduced from 0.15
      const velocityThreshold = 0.25; // Reduced from 0.3
      
      if (dy > swipeThreshold || (dy > 0 && velocity > velocityThreshold)) {
        // Swiped down sufficiently, close the viewer
        setOpenFile(null);
      } else {
        // Animate back to original position with spring
        setViewerSwipeY(0);
        setTimeout(() => {
          viewerSwipeStart.current = null;
          viewerSwiping.current = false;
          viewerSwipeDirection.current = null;
        }, 450);
        return;
      }
    } else if (!viewerSwiping.current) {
      // It was a click/tap, not a swipe
      const clickX = e.clientX;
      const screenWidth = window.innerWidth;
      if (clickX < screenWidth / 2) {
        navDirRef.current = -1;
        goAdjacent(-1);
      } else {
        navDirRef.current = 1;
        goAdjacent(1);
      }
    }
    
    // Reset swipe state
    viewerSwipeStart.current = null;
    viewerSwiping.current = false;
    viewerSwipeDirection.current = null;
    setViewerSwipeX(0);
    setViewerSwipeY(0);
  };

  const blockViewer =
    portalReady &&
    typeof document !== "undefined" &&
    createPortal(
      <AnimatePresence>
        {openFile ? (
          <motion.div
            key="graphic-viewer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.35, 
              ease: [0.32, 0.72, 0, 1],
            }}
            className="fixed inset-0 z-[10050] flex flex-col bg-background"
            aria-modal="true"
            role="dialog"
            aria-labelledby="graphic-block-title"
          >
            {/* Window chrome — same traffic lights as thumbnail cards */}
            <div className="flex h-9 shrink-0 items-center gap-1 border-b border-border/60 bg-muted/50 px-2 dark:bg-muted/30">
              <button
                type="button"
                className="group flex size-5 items-center justify-center"
                aria-label="Close"
                onClick={() => setOpenFile(null)}
              >
                <span className="size-2.5 rounded-full bg-[#ff5f57]/90 transition-opacity group-hover:opacity-80" />
              </button>
              <span className="flex size-5 items-center justify-center" aria-hidden>
                <span className="size-2.5 rounded-full bg-[#febc2e]/90" />
              </span>
              <span className="flex size-5 items-center justify-center" aria-hidden>
                <span className="size-2.5 rounded-full bg-[#28c840]/90" />
              </span>
              <span
                id="graphic-block-title"
                className="ml-1 min-w-0 flex-1 truncate font-mono text-[10px] uppercase tracking-wide text-muted-foreground"
              >
                {displayName(openFile)}
              </span>
              {canNavigate && openIndex >= 0 ? (
                <span
                  className="mr-1 shrink-0 tabular-nums font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                  aria-live="polite"
                >
                  {openIndex + 1}/{images.length}
                </span>
              ) : null}
            </div>

            {/* Editorial-style fullscreen slideshow */}
            <div
              className={cn(
                "relative flex min-h-0 flex-1 items-center px-4 py-8 lg:px-6 lg:py-12",
                canNavigate && "cursor-pointer touch-none",
              )}
              onPointerDown={handleViewerPointerDown}
              onPointerMove={handleViewerPointerMove}
              onPointerUp={handleViewerPointerUp}
              onPointerCancel={handleViewerPointerUp}
              style={{
                opacity: viewerSwipeDirection.current === "vertical" && viewerSwipeY > 0
                  ? Math.max(0.4, 1 - viewerSwipeY / (window.innerHeight * 0.6))
                  : 1,
                transition: viewerSwiping.current ? "none" : "opacity 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={openFile}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.35,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  className="relative flex h-full max-h-full max-w-full items-center"
                  style={{
                    transform: viewerSwiping.current
                      ? viewerSwipeDirection.current === "horizontal"
                        ? `translateX(${viewerSwipeX}px)`
                        : `translateY(${viewerSwipeY}px)`
                      : viewerSwipeX !== 0 || viewerSwipeY !== 0
                      ? viewerSwipeDirection.current === "horizontal"
                        ? `translateX(${viewerSwipeX}px)`
                        : `translateY(${viewerSwipeY}px)`
                      : undefined,
                    transition: viewerSwiping.current 
                      ? "none" 
                      : "transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
                  }}
                >
                  <img
                    src={`/dg/${openFile}`}
                    alt={displayName(openFile)}
                    className="block h-full max-h-full w-auto max-w-full object-contain"
                    decoding="async"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
    );

  return (
    <>
      {blockViewer}
      <div
        className={cn(
          "pointer-events-auto absolute inset-0 z-10 overflow-hidden",
          "bg-[linear-gradient(165deg,rgb(245_245_245/0.9)_0%,rgb(235_235_235/0.95)_40%,rgb(228_228_228/1)_100%)]",
          "dark:bg-[linear-gradient(165deg,rgb(24_24_24/1)_0%,rgb(28_28_28/1)_45%,rgb(32_32_32/1)_100%)]",
          className,
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgb(128 128 128 / 0.22) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />

        {layout.map((item) => {
          const o = offset[item.name] ?? { dx: 0, dy: 0 };
          const z = (zBoost[item.name] ?? 0) + item.baseZ;
          return (
            <div
              key={item.name}
              className="absolute touch-none"
              style={{
                left: `${item.leftPct}%`,
                top: `${item.topPct}%`,
                width: item.width,
                maxWidth: "min(42vw, 220px)",
                zIndex: z,
                transform: `translate(${o.dx}px, ${o.dy}px) rotate(${item.rot}deg)`,
              }}
              onPointerDown={(e) => onCardPointerDown(item.name, e)}
              onPointerUp={(e) => onCardPointerUp(item.name, e)}
            >
              <div
                className={cn(
                  "cursor-grab overflow-hidden rounded-lg border border-border/70 bg-card shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)]",
                  "ring-1 ring-inset ring-white/30 dark:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.85)] dark:ring-white/[0.06]",
                  "active:cursor-grabbing",
                )}
              >
                <div className="flex h-6 shrink-0 cursor-grab items-center gap-1 border-b border-border/60 bg-muted/50 px-1.5 dark:bg-muted/30">
                  <span className="size-2 rounded-full bg-[#ff5f57]/90" />
                  <span className="size-2 rounded-full bg-[#febc2e]/90" />
                  <span className="size-2 rounded-full bg-[#28c840]/90" />
                  <span className="ml-1.5 truncate font-mono text-[8px] uppercase tracking-wide text-muted-foreground">
                    {displayName(item.name)}
                  </span>
                </div>
                <div className="w-full cursor-zoom-in bg-muted leading-none">
                  {/* Native img so each file keeps its intrinsic aspect ratio at the card width */}
                  <img
                    src={`/dg/${item.name}`}
                    alt=""
                    className="block h-auto w-full max-w-full select-none"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
