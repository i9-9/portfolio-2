"use client";

import {
  useEffect, useState, useRef, useCallback, useMemo,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[10050]"
            aria-modal="true"
            role="dialog"
            aria-labelledby="graphic-block-title"
          >
            <button
              type="button"
              className={cn(
                "absolute inset-0 cursor-zoom-out bg-[#ebe9e6]/92 backdrop-blur-md",
                "dark:bg-neutral-950/88",
              )}
              aria-label="Close"
              onClick={() => setOpenFile(null)}
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 px-3 py-4 sm:gap-4 sm:px-6 sm:py-6">
              {canNavigate ? (
                <button
                  type="button"
                  className={cn(
                    "pointer-events-auto flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-[#fdfcfa]/90 text-foreground/60 shadow-sm backdrop-blur-sm transition-colors",
                    "hover:bg-foreground/5 hover:text-foreground sm:size-11",
                    "dark:border-white/10 dark:bg-[#161616]/90 dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white",
                  )}
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.stopPropagation();
                    navDirRef.current = -1;
                    goAdjacent(-1);
                  }}
                >
                  <ChevronLeft className="size-5 sm:size-6" strokeWidth={1.5} />
                </button>
              ) : (
                <span className="size-10 shrink-0 sm:size-11" aria-hidden />
              )}

              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.99 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "pointer-events-auto relative flex max-h-[min(88dvh,calc(100vh-2rem))] w-full max-w-[min(96vw,56rem)] flex-col rounded-sm border border-foreground/[0.08] bg-[#fdfcfa] shadow-[0_24px_80px_-24px_rgb(0_0_0/0.18)] dark:border-white/[0.08] dark:bg-[#161616]",
                )}
                onClick={(ev) => ev.stopPropagation()}
              >
                <div className="flex shrink-0 items-center gap-3 border-b border-foreground/[0.06] px-4 py-3 dark:border-white/[0.06]">
                  <span
                    id="graphic-block-title"
                    className="min-w-0 flex-1 font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-foreground/70 dark:text-white/65"
                  >
                    {displayName(openFile)}
                  </span>
                  {canNavigate && openIndex >= 0 ? (
                    <span
                      className="shrink-0 tabular-nums font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                      aria-live="polite"
                    >
                      {openIndex + 1}/{images.length}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    className="-m-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                    aria-label="Close block"
                    onClick={() => setOpenFile(null)}
                  >
                    <X className="size-4" strokeWidth={1.5} />
                  </button>
                </div>
                <div
                  className="max-h-[min(calc(88dvh-3.75rem),calc(100vh-8rem))] overflow-x-hidden overflow-y-auto overscroll-contain px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2"
                  style={{ scrollbarGutter: "stable" }}
                >
                  <div className="flex w-full justify-center">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={openFile}
                        role="presentation"
                        initial={{
                          opacity: 0,
                          x: navDirRef.current * 18,
                          filter: "blur(6px)",
                        }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{
                          opacity: 0,
                          x: navDirRef.current * -14,
                          filter: "blur(4px)",
                        }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <img
                          src={`/dg/${openFile}`}
                          alt={displayName(openFile)}
                          className="block max-h-[min(calc(100dvh-9rem),80dvh)] w-auto max-w-full object-contain shadow-sm"
                          decoding="async"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {canNavigate ? (
                <button
                  type="button"
                  className={cn(
                    "pointer-events-auto flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-[#fdfcfa]/90 text-foreground/60 shadow-sm backdrop-blur-sm transition-colors",
                    "hover:bg-foreground/5 hover:text-foreground sm:size-11",
                    "dark:border-white/10 dark:bg-[#161616]/90 dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white",
                  )}
                  aria-label="Next image"
                  onClick={(e) => {
                    e.stopPropagation();
                    navDirRef.current = 1;
                    goAdjacent(1);
                  }}
                >
                  <ChevronRight className="size-5 sm:size-6" strokeWidth={1.5} />
                </button>
              ) : (
                <span className="size-10 shrink-0 sm:size-11" aria-hidden />
              )}
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
          "pointer-events-auto absolute inset-0 z-0 overflow-hidden",
          "bg-[linear-gradient(165deg,rgb(245_245_245/0.9)_0%,rgb(235_235_235/0.95)_40%,rgb(228_228_228/1)_100%)]",
          "dark:bg-[linear-gradient(165deg,rgb(24_24_24/1)_0%,rgb(28_28_28/1)_45%,rgb(32_32_32/1)_100%)]",
          className,
        )}
        aria-hidden
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
