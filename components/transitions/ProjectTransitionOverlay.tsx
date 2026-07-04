"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { getProjectBySlug, type ProjectSlug } from "@/app/data/projects";
import {
  PROJECT_TRANSITION_BACKDROP,
  PROJECT_TRANSITION_LOGO_CLASS,
  PROJECT_TRANSITION_VARIANT,
  TRANSITION_EASE,
  TRANSITION_ENTER_MS,
  TRANSITION_EXIT_MS,
  type ProjectTransitionBackdrop,
  type ProjectTransitionVariant,
} from "@/lib/transitions/config";
import type { TransitionOrigin, TransitionPhase } from "@/lib/transitions/ProjectTransitionContext";
import { cn } from "@/lib/utils";

const SLICE_COUNT = 6;
const GRID_COLS = 12;

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

/** Full-bleed screenshot, heavily blurred — backdrop for the logo. */
function BlurredBackground({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image
        src={src}
        alt=""
        fill
        className="scale-[1.12] object-cover object-center blur-3xl brightness-[0.45] saturate-[1.15]"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-black/25" aria-hidden />
    </div>
  );
}

function TransitionBackdrop({
  backdrop,
  previewImage,
}: {
  backdrop: ProjectTransitionBackdrop;
  previewImage: string;
}) {
  if (backdrop === "white") {
    return <div className="absolute inset-0 bg-white" aria-hidden />;
  }

  return <BlurredBackground src={previewImage} />;
}

function logoClassForBackdrop(
  backdrop: ProjectTransitionBackdrop,
  slug?: ProjectSlug,
) {
  return cn(
    logoClassForBackdropTone(backdrop),
    slug ? PROJECT_TRANSITION_LOGO_CLASS[slug] : undefined,
  );
}

function logoClassForBackdropTone(backdrop: ProjectTransitionBackdrop) {
  return backdrop === "white"
    ? "drop-shadow-none"
    : "drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)]";
}

function TransitionLogo({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(
        "h-auto max-h-[min(28vh,200px)] w-auto max-w-[min(72vw,440px)] object-contain",
        className,
      )}
    />
  );
}

function LetterboxTransition({
  phase,
  previewImage,
  backdrop,
  logo,
  logoAlt,
  logoClassName,
  origin,
}: {
  phase: TransitionPhase;
  previewImage: string;
  backdrop: ProjectTransitionBackdrop;
  logo: string;
  logoAlt: string;
  logoClassName: string;
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
    <FullscreenStage>
      <TransitionBackdrop backdrop={backdrop} previewImage={previewImage} />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={
          viewport
            ? { x: fromX, y: fromY, scale: fromScale, opacity: 1 }
            : { scale: fromScale, opacity: 1 }
        }
        animate={
          exiting
            ? { x: 0, y: 0, scale: 1, opacity: 1 }
            : entering
              ? { x: 0, y: 0, scale: 1.06, opacity: 0 }
              : { x: 0, y: 0, scale: 1, opacity: 1 }
        }
        transition={{ duration: TRANSITION_EXIT_MS / 1000, ease: TRANSITION_EASE }}
      >
        <TransitionLogo
          src={logo}
          alt={logoAlt}
          className={logoClassName}
        />
      </motion.div>
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
  backdrop,
  logo,
  logoAlt,
  logoClassName,
  direction = "up",
}: {
  phase: TransitionPhase;
  previewImage: string;
  backdrop: ProjectTransitionBackdrop;
  logo: string;
  logoAlt: string;
  logoClassName: string;
  direction?: "up" | "down";
}) {
  const exiting = phase === "exit";
  const fromBottom = direction === "up";

  const hidden = fromBottom ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)";
  const visible = "inset(0% 0 0 0)";
  const exitAway = fromBottom ? "inset(0% 0 100% 0)" : "inset(100% 0 0 0)";

  return (
    <FullscreenStage>
      <TransitionBackdrop backdrop={backdrop} previewImage={previewImage} />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ clipPath: hidden }}
        animate={{ clipPath: exiting ? visible : exitAway }}
        transition={{
          duration: (exiting ? TRANSITION_EXIT_MS : TRANSITION_ENTER_MS) / 1000,
          ease: TRANSITION_EASE,
        }}
      >
        <motion.div
          animate={exiting ? { scale: 1.02 } : { scale: 1 }}
          transition={{
            duration: (exiting ? TRANSITION_EXIT_MS : TRANSITION_ENTER_MS) / 1000,
            ease: TRANSITION_EASE,
          }}
        >
          <TransitionLogo
            src={logo}
            alt={logoAlt}
            className={logoClassName}
          />
        </motion.div>
      </motion.div>
    </FullscreenStage>
  );
}

function ExpandTransition({
  phase,
  previewImage,
  backdrop,
  logo,
  logoAlt,
  logoClassName,
  origin,
}: {
  phase: TransitionPhase;
  previewImage: string;
  backdrop: ProjectTransitionBackdrop;
  logo: string;
  logoAlt: string;
  logoClassName: string;
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
    <FullscreenStage>
      <TransitionBackdrop backdrop={backdrop} previewImage={previewImage} />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
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
        <TransitionLogo
          src={logo}
          alt={logoAlt}
          className={logoClassName}
        />
      </motion.div>
    </FullscreenStage>
  );
}

function SlicesTransition({
  phase,
  previewImage,
  backdrop,
  logo,
  logoAlt,
  logoClassName,
}: {
  phase: TransitionPhase;
  previewImage: string;
  backdrop: ProjectTransitionBackdrop;
  logo: string;
  logoAlt: string;
  logoClassName: string;
}) {
  const exiting = phase === "exit";

  return (
    <FullscreenStage>
      <TransitionBackdrop backdrop={backdrop} previewImage={previewImage} />
      <div className="absolute inset-0 flex flex-col">
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
              className="absolute left-0 flex w-full items-center justify-center"
              style={{
                height: "100dvh",
                top: `calc(-${i} * 100dvh / ${SLICE_COUNT})`,
              }}
            >
              <TransitionLogo
                src={logo}
                alt={logoAlt}
                className={logoClassName}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </FullscreenStage>
  );
}

function GridTransition({
  phase,
  previewImage,
  backdrop,
  logo,
  logoAlt,
  logoClassName,
}: {
  phase: TransitionPhase;
  previewImage: string;
  backdrop: ProjectTransitionBackdrop;
  logo: string;
  logoAlt: string;
  logoClassName: string;
}) {
  const exiting = phase === "exit";

  return (
    <FullscreenStage>
      <TransitionBackdrop backdrop={backdrop} previewImage={previewImage} />
      <div className="absolute inset-0 grid grid-cols-12">
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
              className="absolute top-0 flex h-[100dvh] w-[100vw] items-center justify-center"
              style={{ left: `calc(-${i} * 100vw / ${GRID_COLS})` }}
            >
              <TransitionLogo
                src={logo}
                alt={logoAlt}
                className={logoClassName}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </FullscreenStage>
  );
}

/** Wordmark — quiet fade, baseline settle, slight horizontal breathe. */
function TypographicTransition({
  phase,
  previewImage,
  backdrop,
  logo,
  logoAlt,
  logoClassName,
}: {
  phase: TransitionPhase;
  previewImage: string;
  backdrop: ProjectTransitionBackdrop;
  logo: string;
  logoAlt: string;
  logoClassName: string;
}) {
  const exiting = phase === "exit";
  const entering = phase === "enter";
  const duration =
    (exiting ? TRANSITION_EXIT_MS : TRANSITION_ENTER_MS) / 1000;

  return (
    <FullscreenStage>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: exiting ? 0.72 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration * 0.9, ease: TRANSITION_EASE }}
      >
        <TransitionBackdrop backdrop={backdrop} previewImage={previewImage} />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center px-6"
        initial={{ opacity: 0, y: 14, scaleX: 0.97 }}
        animate={
          exiting
            ? { opacity: 1, y: 0, scaleX: 1 }
            : entering
              ? { opacity: 0, y: -8, scaleX: 0.985 }
              : { opacity: 1, y: 0, scaleX: 1 }
        }
        transition={{ duration, ease: TRANSITION_EASE }}
        style={{ transformOrigin: "center center" }}
      >
        <TransitionLogo src={logo} alt={logoAlt} className={logoClassName} />
      </motion.div>
    </FullscreenStage>
  );
}

function VariantLayer({
  variant,
  phase,
  previewImage,
  backdrop,
  logo,
  logoAlt,
  logoClassName,
  origin,
}: {
  variant: ProjectTransitionVariant;
  phase: TransitionPhase;
  previewImage: string;
  backdrop: ProjectTransitionBackdrop;
  logo: string;
  logoAlt: string;
  logoClassName: string;
  origin: TransitionOrigin;
}) {
  switch (variant) {
    case "letterbox":
      return (
        <LetterboxTransition
          phase={phase}
          previewImage={previewImage}
          backdrop={backdrop}
          logo={logo}
          logoAlt={logoAlt}
          logoClassName={logoClassName}
          origin={origin}
        />
      );
    case "curtain":
      return (
        <CurtainTransition
          phase={phase}
          previewImage={previewImage}
          backdrop={backdrop}
          logo={logo}
          logoAlt={logoAlt}
          logoClassName={logoClassName}
        />
      );
    case "curtainDown":
      return (
        <CurtainTransition
          phase={phase}
          previewImage={previewImage}
          backdrop={backdrop}
          logo={logo}
          logoAlt={logoAlt}
          logoClassName={logoClassName}
          direction="down"
        />
      );
    case "expand":
      return (
        <ExpandTransition
          phase={phase}
          previewImage={previewImage}
          backdrop={backdrop}
          logo={logo}
          logoAlt={logoAlt}
          logoClassName={logoClassName}
          origin={origin}
        />
      );
    case "slices":
      return (
        <SlicesTransition
          phase={phase}
          previewImage={previewImage}
          backdrop={backdrop}
          logo={logo}
          logoAlt={logoAlt}
          logoClassName={logoClassName}
        />
      );
    case "grid":
      return (
        <GridTransition
          phase={phase}
          previewImage={previewImage}
          backdrop={backdrop}
          logo={logo}
          logoAlt={logoAlt}
          logoClassName={logoClassName}
        />
      );
    case "typographic":
      return (
        <TypographicTransition
          phase={phase}
          previewImage={previewImage}
          backdrop={backdrop}
          logo={logo}
          logoAlt={logoAlt}
          logoClassName={logoClassName}
        />
      );
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

  const project = getProjectBySlug(slug);
  if (!project?.logo) return null;

  const variant = PROJECT_TRANSITION_VARIANT[slug];
  const backdrop = PROJECT_TRANSITION_BACKDROP[slug];
  const logoClassName = logoClassForBackdrop(backdrop, slug);

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
          backdrop={backdrop}
          logo={project.logo}
          logoAlt={project.name}
          logoClassName={logoClassName}
          origin={origin}
        />
      </motion.div>
    </AnimatePresence>
  );
}
