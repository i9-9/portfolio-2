"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
} from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getProjectBySlug } from "@/app/data/projects";
import type { ProjectSlug } from "@/app/data/projects";
import {
  getProjectPreview,
  getProjectPreviewVideo,
} from "@/lib/projects/screenshot";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";
import { useProjectTransition } from "@/lib/transitions/ProjectTransitionContext";
import { ChaosStarIcon } from "@/components/icons/ChaosStarIcon";
import { NumberScramble } from "@/components/portfolio/NumberScramble";

function HoverPreviewVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const play = () => {
      void video.play().catch(() => {});
    };

    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 h-full w-full object-cover"
      aria-hidden
    />
  );
}

function ProjectRowIcon({ hovered }: { hovered: boolean }) {
  return (
    <span className="relative inline-flex size-[18px] shrink-0">
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          opacity: hovered ? 0 : 1,
          scale: hovered ? 0.7 : 1,
        }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        aria-hidden={hovered}
      >
        <ArrowRight className="size-4" />
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.7,
        }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        aria-hidden={!hovered}
      >
        <ChaosStarIcon />
      </motion.span>
    </span>
  );
}

export function ProjectRow({
  index,
  name,
  category,
  metric,
  year,
  slug,
  delay,
  inView,
}: {
  index: number;
  name: string;
  category: string;
  metric: string;
  year: number;
  slug: string;
  delay: number;
  inView: boolean;
}) {
  const project = getProjectBySlug(slug);
  const desktopPreview = project?.previewImage ?? "";
  const desktopPreviewVideo = project
    ? getProjectPreviewVideo(project, false)
    : undefined;
  const [hovered, setHovered] = useState(false);
  const { navigateToProject } = useProjectTransition();

  const PREVIEW_OFF = -9_999;
  const pvX = useMotionValue(PREVIEW_OFF);
  const pvY = useMotionValue(PREVIEW_OFF);

  const seedPreview = (clientX: number, clientY: number) => {
    pvX.set(clientX + 28);
    pvY.set(clientY - 96);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    seedPreview(e.clientX, e.clientY);
  };

  const PREVIEW_WIDTH = 384;
  const PREVIEW_HEIGHT = 240;

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    e.preventDefault();
    const rowRect = e.currentTarget.getBoundingClientRect();
    const useHoverPreview =
      hovered &&
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches;
    const origin = useHoverPreview
      ? {
          x: pvX.get(),
          y: pvY.get(),
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
        }
      : {
          x: rowRect.left,
          y: rowRect.top,
          width: rowRect.width,
          height: rowRect.height,
        };
    const preview = project ? getProjectPreview(project) : "";
    navigateToProject(slug as ProjectSlug, preview, origin);
  };

  return (
    <>
      <motion.a
        href={`/work/${slug}`}
        onClick={handleNavigate}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1.05, delay, ease: EASE_OUT_EXPO }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => {
          setHovered(false);
          pvX.set(PREVIEW_OFF);
          pvY.set(PREVIEW_OFF);
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") {
            seedPreview(e.clientX, e.clientY);
          }
        }}
        onMouseMove={handleMouseMove}
        className="group relative flex flex-col -mx-4 px-4 transition-colors duration-500 [@media(hover:hover)]:hover:bg-foreground [@media(hover:hover)]:hover:text-background overflow-hidden lg:-mx-6 lg:px-6"
      >
        <div className="relative grid grid-cols-[auto_1fr_auto] gap-x-5 py-5 lg:py-6 lg:grid-cols-12 lg:gap-x-6">
          <span className="relative z-10 col-start-1 row-start-1 flex h-[1em] w-6 shrink-0 items-center self-start text-type-project leading-none lg:col-start-1">
            <span className="text-type-micro font-helveticaNowTextRegular text-muted-foreground [@media(hover:hover)]:group-hover:text-background/40 transition-colors duration-500 tabular-nums">
              <NumberScramble value={index} inView={inView} />
            </span>
          </span>

          <motion.p
            className="relative z-10 col-start-2 row-start-1 self-start min-w-0 font-helveticaNowDisplayBold text-type-project leading-none transition-colors duration-500 lg:col-start-3 lg:col-span-6"
            animate={{ x: hovered ? 12 : 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            {name}
          </motion.p>

          <motion.p
            className="relative z-10 col-start-2 row-start-2 min-w-0 text-type-project-subtitle font-helveticaNowTextRegular text-muted-foreground mt-0.5 [@media(hover:hover)]:group-hover:text-background/50 transition-colors duration-500 lg:col-start-3 lg:col-span-6"
            animate={{ x: hovered ? 12 : 0 }}
            transition={{ duration: 0.6, delay: 0.04, ease: EASE_OUT_EXPO }}
          >
            <span className="lg:hidden tabular-nums after:content-['·'] after:mx-1.5 after:text-muted-foreground/50">
              {year}
            </span>
            {category}
          </motion.p>

          <div className="relative z-10 col-start-3 row-start-1 row-span-2 flex items-center gap-6 flex-shrink-0 justify-self-end self-center lg:col-start-10 lg:col-span-3">
            {metric ? (
              <motion.span
                initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                animate={
                  hovered
                    ? { opacity: 1, x: 0, filter: "blur(0px)" }
                    : { opacity: 0, x: -10, filter: "blur(4px)" }
                }
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                className="hidden lg:block absolute right-full mr-6 text-type-0 font-helveticaNowTextRegular text-background/70 whitespace-nowrap"
              >
                {metric}
              </motion.span>
            ) : null}
            <span className="hidden lg:block text-type-0 font-helveticaNowTextRegular text-muted-foreground [@media(hover:hover)]:group-hover:text-background/40 tabular-nums transition-colors duration-500 w-10 text-right">
              {year}
            </span>
            <motion.span
              className="inline-flex"
              animate={hovered ? { x: 3, y: 3 } : { x: 0, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
              <ProjectRowIcon hovered={hovered} />
            </motion.span>
          </div>
        </div>
      </motion.a>

      <AnimatePresence>
        {hovered && (
          <motion.div
            className="fixed pointer-events-none z-[9990] w-96 aspect-[16/10] overflow-hidden hidden lg:block bg-muted"
            style={{ left: pvX, top: pvY }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
          >
            {desktopPreviewVideo ? (
              <HoverPreviewVideo
                src={desktopPreviewVideo}
                poster={desktopPreview}
              />
            ) : (
              <Image
                src={desktopPreview}
                alt={name}
                fill
                className="object-cover"
                sizes="384px"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
