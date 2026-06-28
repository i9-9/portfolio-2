"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { ProjectSlug } from "@/app/data/projects";
import {
  PROJECT_TRANSITION_VARIANT,
  TRANSITION_EASE,
  TRANSITION_ENTER_MS,
  TRANSITION_EXIT_MS,
  type ProjectTransitionVariant,
} from "@/lib/transitions/config";
import type { TransitionOrigin, TransitionPhase } from "@/lib/transitions/ProjectTransitionContext";
import { cn } from "@/lib/utils";

const SLICE_COUNT = 6;
const GRID_COLS = 12;

/** Full-viewport stage — image always covers the screen edge-to-edge. */
function FullscreenStage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 h-[100dvh] w-full overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

function TransitionImage({
  src,
  alt,
  className,
  priority,
  fit = "cover",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn(
        fit === "contain" ? "object-contain object-center" : "object-cover object-center",
        className,
      )}
      sizes="100vw"
      priority={priority}
    />
  );
}

function LetterboxTransition({
  phase,
  previewImage,
  origin,
}: {
  phase: TransitionPhase;
  previewImage: string;
  origin: TransitionOrigin;
}) {
  const exiting = phase === "exit";
  const entering = phase === "enter";
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(
    null,
  );

  useEffect(() => {
    setViewport({
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    });
  }, []);

  const fromScale = viewport
    ? Math.max(origin.width / viewport.w, origin.height / viewport.h, 0.12)
    : 0.22;
  const fromX = viewport
    ? origin.x + origin.width / 2 - viewport.w / 2
    : 0;
  const fromY = viewport
    ? origin.y + origin.height / 2 - viewport.h / 2
    : 0;

  return (
    <FullscreenStage className="bg-black">
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={
          viewport
            ? { x: fromX, y: fromY, scale: fromScale, opacity: 1 }
            : { scale: fromScale, opacity: 1 }
        }
        animate={
          exiting
            ? { x: 0, y: 0, scale: 1, opacity: 1 }
            : entering
              ? { x: 0, y: 0, scale: 1.03, opacity: 0 }
              : { x: 0, y: 0, scale: 1, opacity: 1 }
        }
        transition={{ duration: TRANSITION_EXIT_MS / 1000, ease: TRANSITION_EASE }}
      >
        <TransitionImage src={previewImage} alt="" priority />
      </motion.div>
      {/* Cinematic bars — brief accent, then pull away for full-bleed hold */}
      <motion.div
        className="absolute inset-x-0 top-0 bg-black"
        initial={{ height: "0%" }}
        animate={{ height: exiting ? ["0%", "10%", "0%"] : "0%" }}
        transition={{
          duration: 0.65,
          ease: TRANSITION_EASE,
          times: [0, 0.45, 1],
        }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 bg-black"
        initial={{ height: "0%" }}
        animate={{ height: exiting ? ["0%", "10%", "0%"] : "0%" }}
        transition={{
          duration: 0.65,
          ease: TRANSITION_EASE,
          times: [0, 0.45, 1],
        }}
      />
    </FullscreenStage>
  );
}

function CurtainTransition({
  phase,
  previewImage,
  direction = "up",
}: {
  phase: TransitionPhase;
  previewImage: string;
  direction?: "up" | "down";
}) {
  const exiting = phase === "exit";
  const fromBottom = direction === "up";

  const hidden = fromBottom ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)";
  const visible = "inset(0% 0 0 0)";
  const exitAway = fromBottom ? "inset(0% 0 100% 0)" : "inset(100% 0 0 0)";

  return (
    <motion.div
      className="absolute inset-0 h-[100dvh] w-full overflow-hidden bg-neutral-950"
      initial={{ clipPath: hidden }}
      animate={{ clipPath: exiting ? visible : exitAway }}
      transition={{
        duration: (exiting ? TRANSITION_EXIT_MS : TRANSITION_ENTER_MS) / 1000,
        ease: TRANSITION_EASE,
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={exiting ? { scale: 1.02 } : { scale: 1 }}
        transition={{
          duration: (exiting ? TRANSITION_EXIT_MS : TRANSITION_ENTER_MS) / 1000,
          ease: TRANSITION_EASE,
        }}
      >
        <TransitionImage src={previewImage} alt="" priority fit="contain" />
      </motion.div>
    </motion.div>
  );
}

/** Scale from project row to full frame — no clip artifacts, image stays intact. */
function ExpandTransition({
  phase,
  previewImage,
  origin,
}: {
  phase: TransitionPhase;
  previewImage: string;
  origin: TransitionOrigin;
}) {
  const exiting = phase === "exit";
  const entering = phase === "enter";
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(
    null,
  );

  useEffect(() => {
    setViewport({
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    });
  }, []);

  const fromScale = viewport
    ? Math.max(origin.width / viewport.w, origin.height / viewport.h, 0.12)
    : 0.22;
  const fromX = viewport
    ? origin.x + origin.width / 2 - viewport.w / 2
    : 0;
  const fromY = viewport
    ? origin.y + origin.height / 2 - viewport.h / 2
    : 0;

  return (
    <FullscreenStage className="bg-neutral-950">
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={
          viewport
            ? { x: fromX, y: fromY, scale: fromScale, opacity: 1 }
            : { scale: fromScale, opacity: 1 }
        }
        animate={
          exiting
            ? { x: 0, y: 0, scale: 1, opacity: 1 }
            : entering
              ? { x: 0, y: 0, scale: 1, opacity: 0 }
              : { x: 0, y: 0, scale: 1, opacity: 1 }
        }
        transition={{ duration: TRANSITION_EXIT_MS / 1000, ease: TRANSITION_EASE }}
      >
        <TransitionImage src={previewImage} alt="" priority fit="contain" />
      </motion.div>
    </FullscreenStage>
  );
}

function SlicesTransition({
  phase,
  previewImage,
}: {
  phase: TransitionPhase;
  previewImage: string;
}) {
  const exiting = phase === "exit";

  return (
    <FullscreenStage className="flex flex-col bg-background">
      {Array.from({ length: SLICE_COUNT }, (_, i) => (
        <motion.div
          key={i}
          className="relative min-h-0 flex-1 overflow-hidden"
          initial={{ x: exiting ? (i % 2 === 0 ? "-105%" : "105%") : 0 }}
          animate={
            exiting
              ? { x: 0 }
              : { x: i % 2 === 0 ? "-105%" : "105%" }
          }
          transition={{
            duration: 0.52,
            ease: TRANSITION_EASE,
            delay: exiting ? i * 0.045 : (SLICE_COUNT - 1 - i) * 0.035,
          }}
        >
          <div
            className="absolute left-0 w-full"
            style={{
              height: "100dvh",
              top: `calc(-${i} * 100dvh / ${SLICE_COUNT})`,
            }}
          >
            <TransitionImage src={previewImage} alt="" priority />
          </div>
        </motion.div>
      ))}
    </FullscreenStage>
  );
}

function GridTransition({
  phase,
  previewImage,
}: {
  phase: TransitionPhase;
  previewImage: string;
}) {
  const exiting = phase === "exit";

  return (
    <div className="absolute inset-0 grid h-[100dvh] w-full grid-cols-12 bg-background">
      {Array.from({ length: GRID_COLS }, (_, i) => (
        <motion.div
          key={i}
          className="relative h-full overflow-hidden"
          initial={{ scaleY: exiting ? 0 : 1 }}
          animate={{ scaleY: exiting ? 1 : 0 }}
          style={{ transformOrigin: "top" }}
          transition={{
            duration: 0.48,
            ease: TRANSITION_EASE,
            delay: exiting ? i * 0.035 : (GRID_COLS - 1 - i) * 0.028,
          }}
        >
          <div
            className="absolute top-0"
            style={{
              height: "100dvh",
              width: "100vw",
              left: `calc(-${i} * 100vw / ${GRID_COLS})`,
            }}
          >
            <TransitionImage src={previewImage} alt="" priority />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function VariantLayer({
  variant,
  phase,
  previewImage,
  origin,
}: {
  variant: ProjectTransitionVariant;
  phase: TransitionPhase;
  previewImage: string;
  origin: TransitionOrigin;
}) {
  switch (variant) {
    case "letterbox":
      return (
        <LetterboxTransition
          phase={phase}
          previewImage={previewImage}
          origin={origin}
        />
      );
    case "curtain":
      return <CurtainTransition phase={phase} previewImage={previewImage} />;
    case "curtainDown":
      return (
        <CurtainTransition
          phase={phase}
          previewImage={previewImage}
          direction="down"
        />
      );
    case "expand":
      return (
        <ExpandTransition
          phase={phase}
          previewImage={previewImage}
          origin={origin}
        />
      );
    case "slices":
      return <SlicesTransition phase={phase} previewImage={previewImage} />;
    case "grid":
      return <GridTransition phase={phase} previewImage={previewImage} />;
  }
}

export function ProjectTransitionOverlay({
  phase,
  slug,
  previewImage,
  origin,
}: {
  phase: TransitionPhase;
  slug: ProjectSlug | null;
  previewImage: string | null;
  origin: TransitionOrigin | null;
}) {
  if (!slug || !previewImage || !origin || phase === "idle") return null;

  const variant = PROJECT_TRANSITION_VARIANT[slug];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slug}
        className="fixed inset-0 z-[10001] h-[100dvh] w-full pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "enter" ? 0 : 1 }}
        transition={{
          duration: TRANSITION_ENTER_MS / 1000,
          ease: TRANSITION_EASE,
          delay: phase === "enter" ? 0.08 : 0,
        }}
        aria-hidden
      >
        <VariantLayer
          variant={variant}
          phase={phase}
          previewImage={previewImage}
          origin={origin}
        />
      </motion.div>
    </AnimatePresence>
  );
}
