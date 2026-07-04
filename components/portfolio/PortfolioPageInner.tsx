"use client";

import { useState, lazy, Suspense, useRef, useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useTransform,
  useScroll, useInView, useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { getProjectBySlug, projects } from "@/app/data/projects";
import { getProjectPreview, getProjectPreviewVideo } from "@/lib/projects/screenshot";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  editorialFooterMuted,
  editorialFooterPrimary,
  editorialNavType,
} from "@/lib/editorial-cta";
import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  SPLASH_SESSION_KEY,
  useSplashHandoff,
} from "@/lib/splash/SplashHandoffContext";
import { EASE_CINEMATIC, EASE_OUT_EXPO } from "@/lib/motion/easing";
import {
  heroRevealIndex,
  SplashClipReveal,
  SPLASH_NAV_ITEMS_LG,
  SPLASH_NAV_ITEMS_SM,
} from "@/lib/motion/clip-reveal";
import { useProjectTransition } from "@/lib/transitions/ProjectTransitionContext";
import type { ProjectSlug } from "@/app/data/projects";
import {
  Mail, MessageSquare,
  ArrowRight,
  Asterisk,
} from "lucide-react";
import { ChaosStarIcon } from "@/components/icons/ChaosStarIcon";
import { LinesLoader } from "@/components/splash/LinesLoader";

const GeometricFlowCard = lazy(() => import("@/components/GeometricFlowCard"));

function HeroHalftoneFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden pointer-events-none z-0", className)}
      aria-hidden
      style={{
        backgroundImage:
          "radial-gradient(circle at center, hsl(var(--foreground) / 0.16) 1.1px, transparent 1.2px)",
        backgroundSize: "17px 17px",
      }}
    />
  );
}

function GraphicHeroFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        "bg-[linear-gradient(165deg,rgb(245_245_245/0.9)_0%,rgb(235_235_235/0.95)_40%,rgb(228_228_228/1)_100%)]",
        "dark:bg-[linear-gradient(165deg,rgb(24_24_24/1)_0%,rgb(28_28_28/1)_45%,rgb(32_32_32/1)_100%)]",
        className,
      )}
      aria-hidden
    />
  );
}

const HeroHalftoneP5 = dynamic(
  () => import("@/components/HeroHalftoneP5").then((m) => ({ default: m.HeroHalftoneP5 })),
  {
    ssr: false,
    loading: () => <HeroHalftoneFallback className="pointer-events-none z-0" />,
  },
);

const GraphicDesktopHero = dynamic(
  () =>
    import("@/components/portfolio/GraphicDesktopHero").then((m) => ({
      default: m.GraphicDesktopHero,
    })),
  { ssr: false, loading: () => <GraphicHeroFallback /> },
);

const ContactFormModal = dynamic(
  () => import("@/components/ContactFormModal").then((m) => ({ default: m.ContactFormModal })),
  { ssr: false },
);

export type V2ContentMode = "web" | "graphic";

const SPLASH_EXIT_MS = 950;

const WOHL_STUDIO_URL = "https://wohl.co/";

const SPLASH_LOAD_MS = 1400;

// --- PageReveal -----------------------------------------------------------
// Loader: horizontal lines sweep left → right, then waits for fonts (capped).
function PageReveal() {
  const reduced = useReducedMotion();
  const { notifyHandoff } = useSplashHandoff();
  const handoffRef = useRef(notifyHandoff);
  handoffRef.current = notifyHandoff;

  const [done, setDone] = useState(false);

  // Skip splash before first paint when reduced motion or already seen this session.
  useLayoutEffect(() => {
    if (reduced === null) return;
    let skipSession = false;
    try {
      skipSession =
        typeof window !== "undefined" &&
        window.sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
    } catch {
      skipSession = false;
    }
    if (!reduced && !skipSession) return;
    handoffRef.current?.();
    setDone(true);
  }, [reduced]);

  useEffect(() => {
    if (reduced !== false) return;

    let skipSession = false;
    try {
      skipSession = window.sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
    } catch {
      skipSession = false;
    }
    if (skipSession) return;

    const fontsP =
      typeof document !== "undefined" && document.fonts?.ready
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve(undefined);

    const FONT_WAIT_CAP_MS = 1400;
    let loadTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const finishSplash = () => {
      if (cancelled) return;
      try {
        window.sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
      } catch {
        /* private mode / quota */
      }
      handoffRef.current?.();
      setDone(true);
    };

    loadTimer = setTimeout(() => {
      const cap = new Promise<void>((r) => {
        setTimeout(r, FONT_WAIT_CAP_MS);
      });
      void Promise.race([fontsP, cap]).finally(finishSplash);
    }, SPLASH_LOAD_MS);

    return () => {
      cancelled = true;
      if (loadTimer !== undefined) clearTimeout(loadTimer);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-background select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: SPLASH_EXIT_MS / 1000, ease: EASE_CINEMATIC }}
          role="status"
          aria-label="Loading"
        >
          <LinesLoader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Two identical rails, each ≥ viewport width → seamless -50% loop with no gaps. */
function ContactFooterMarquee({ text }: { text: string }) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [copiesPerRail, setCopiesPerRail] = useState(6);

  useLayoutEffect(() => {
    const update = () => {
      const itemW = measureRef.current?.getBoundingClientRect().width;
      if (!itemW) return;
      setCopiesPerRail(Math.max(4, Math.ceil(window.innerWidth / itemW) + 2));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [text]);

  const itemClass =
    "inline-flex shrink-0 items-center whitespace-nowrap pr-14 sm:pr-20";

  const rail = (keyPrefix: number, measureFirst = false) => (
    <div className="contact-cta-marquee-rail flex shrink-0" aria-hidden={keyPrefix > 0}>
      {Array.from({ length: copiesPerRail }, (_, i) => (
        <span
          key={`${keyPrefix}-${i}`}
          ref={measureFirst && i === 0 ? measureRef : undefined}
          className={itemClass}
        >
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <div className="contact-cta-marquee-viewport py-2" aria-hidden>
      <div className="contact-cta-marquee-track font-helveticaNowTextRegular text-type-micro normal-case leading-none tracking-[-0.02em]">
        {rail(0, true)}
        {rail(1)}
      </div>
    </div>
  );
}

// --- Magnetic -------------------------------------------------------------
// Wraps any element to be "magnetically attracted" to the cursor. The hallmark
// micro-interaction of high-end portfolios (Awwwards SOTD staple). Spring-
// damped translate based on distance from element center.
function Magnetic({
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


// --- ScrollProgress -------------------------------------------------------
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[1px] bg-foreground origin-left z-[9998] pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

// --- CustomCursor ---------------------------------------------------------
function CustomCursor() {
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

// --- AnimatedLine ---------------------------------------------------------
function AnimatedLine({ inView, delay = 0 }: { inView: boolean; delay?: number }) {
  return (
    <motion.div
      className="w-full h-px bg-border origin-left"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: inView ? 1 : 0 }}
      transition={{ duration: 1.4, delay, ease: EASE_OUT_EXPO }}
    />
  );
}

// --- NumberScramble -------------------------------------------------------
function NumberScramble({ value, inView }: { value: number; inView: boolean }) {
  const target = String(value).padStart(2, "0");
  const [display, setDisplay] = useState(target); // same width from start

  useEffect(() => {
    if (!inView) return;
    let step = 0;
    const total = 10;
    const id = setInterval(() => {
      step++;
      if (step >= total) {
        setDisplay(target);
        clearInterval(id);
      } else {
        setDisplay(String(Math.floor(Math.random() * 99)).padStart(2, "0"));
      }
    }, 45);
    return () => clearInterval(id);
  }, [inView, target]);

  return <span className="tabular-nums">{display}</span>;
}

// --- Project rows data ----------------------------------------------------
const PROJECT_ROWS = [
  {
    key: "heybristol",
    idx: 0,
    metricEn: "",
    metricEs: "",
    marqueeEn: "Hey Bristol · ",
    marqueeEs: "Hey Bristol · ",
  },
  {
    key: "kostume",
    idx: 1,
    metricEn: "",
    metricEs: "",
    marqueeEn: "Kostüme · ",
    marqueeEs: "Kostüme · ",
  },
  {
    key: "ursulabenavidez",
    idx: 2,
    metricEn: "",
    metricEs: "",
    marqueeEn: "Ursula Benavidez · ",
    marqueeEs: "Ursula Benavidez · ",
  },
  {
    key: "desenfreno",
    idx: 3,
    metricEn: "",
    metricEs: "",
    marqueeEn: "El Desenfreno · ",
    marqueeEs: "El Desenfreno · ",
  },
  {
    key: "grupofrali",
    idx: 4,
    metricEn: "",
    metricEs: "",
    marqueeEn: "Grupo Frali · ",
    marqueeEs: "Grupo Frali · ",
  },
];

// --- HoverPreviewVideo ----------------------------------------------------
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

// --- ProjectRowIcon -------------------------------------------------------
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

// --- ProjectRow -----------------------------------------------------------
function ProjectRow({
  index,
  name,
  category,
  metric,
  year,
  slug,
  marqueeLine,
  delay,
  inView,
}: {
  index: number;
  name: string;
  category: string;
  metric: string;
  year: number;
  slug: string;
  marqueeLine: string;
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
    const rect = e.currentTarget.getBoundingClientRect();
    const preview = project ? getProjectPreview(project) : "";
    navigateToProject(slug as ProjectSlug, preview, {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });
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
        className="group relative flex flex-col -mx-4 px-4 transition-colors duration-500 hover:bg-foreground hover:text-background overflow-hidden lg:-mx-6 lg:px-6"
      >
        <div className="relative grid grid-cols-[auto_1fr_auto] gap-x-5 py-5 lg:py-6 lg:grid-cols-12 lg:gap-x-6">
        {/* Editorial marquee — desktop: thin strip under row content (not tucked under title) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-8 motion-reduce:hidden lg:block overflow-hidden opacity-0 transition-opacity duration-500 [mask-image:linear-gradient(180deg,transparent_0%,#000_40%,#000_100%)] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,#000_40%,#000_100%)] group-hover:opacity-100"
          aria-hidden
        >
          <div className="flex h-full items-end pb-1">
            <div className="work-row-marquee-track">
              <span className="inline-block whitespace-nowrap pr-12 text-type-micro font-helveticaNowTextRegular uppercase tracking-[0.22em] text-background/40">
                {marqueeLine}
              </span>
              <span className="inline-block whitespace-nowrap pr-12 text-type-micro font-helveticaNowTextRegular uppercase tracking-[0.22em] text-background/40">
                {marqueeLine}
              </span>
            </div>
          </div>
        </div>

        <span className="relative z-10 col-start-1 row-start-1 flex h-[1em] w-6 shrink-0 items-center self-start text-type-project leading-none lg:col-start-1">
          <span className="text-type-micro font-helveticaNowTextRegular text-muted-foreground group-hover:text-background/40 transition-colors duration-500 tabular-nums">
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
          className="relative z-10 col-start-2 row-start-2 min-w-0 text-type-0 font-helveticaNowTextRegular text-muted-foreground mt-0.5 group-hover:text-background/50 transition-colors duration-500 lg:col-start-3 lg:col-span-6"
          animate={{ x: hovered ? 12 : 0 }}
          transition={{ duration: 0.6, delay: 0.04, ease: EASE_OUT_EXPO }}
        >
          {category}
        </motion.p>

        {/* right: metric (absolute, on hover) + year (fixed col) + arrow */}
        <div className="relative z-10 col-start-3 row-start-1 row-span-2 flex items-center gap-6 flex-shrink-0 justify-self-end self-center lg:col-start-10 lg:col-span-3">
          {metric ? (
            <motion.span
              initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
              animate={hovered
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="hidden lg:block absolute right-full mr-6 text-type-0 font-helveticaNowTextRegular text-background/70 whitespace-nowrap"
            >
              {metric}
            </motion.span>
          ) : null}
          <span className="hidden lg:block text-type-0 font-helveticaNowTextRegular text-muted-foreground group-hover:text-background/40 tabular-nums transition-colors duration-500 w-10 text-right">
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

      {/* cursor-following image preview — flat, orthogonal, editorial */}
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
              <HoverPreviewVideo src={desktopPreviewVideo} poster={desktopPreview} />
            ) : (
              <Image src={desktopPreview} alt={name} fill className="object-cover" sizes="384px" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- Page -----------------------------------------------------------------
export function PortfolioPageInner({ v2Mode = "web" }: { v2Mode?: V2ContentMode }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactModalLoaded, setContactModalLoaded] = useState(false);
  const [showToast,     setShowToast]     = useState(false);
  const { t, language } = useLanguage();

  useLayoutEffect(() => {
    if (isContactOpen) setContactModalLoaded(true);
  }, [isContactOpen]);

  const showGraphicDesktopHero = v2Mode === "graphic";
  const heroReduced = useReducedMotion();
  const { handoff: splashHandoff } = useSplashHandoff();
  const heroLive = splashHandoff || !!heroReduced;

  const [isLgNav, setIsLgNav] = useState(true);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLgNav(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const splashNavItemCount = isLgNav ? SPLASH_NAV_ITEMS_LG : SPLASH_NAV_ITEMS_SM;

  const workRef    = useRef(null);
  const aboutRef   = useRef(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const sep1Ref    = useRef(null);
  const sep2Ref    = useRef(null);
  const sep3Ref    = useRef(null);

  const workInView    = useInView(workRef,    { once: true, margin: "-10%" });
  const aboutInView   = useInView(aboutRef,   { once: true, margin: "-10%" });
  const contactInView = useInView(contactRef, { once: true, margin: "-10%" });
  const sep1InView    = useInView(sep1Ref,    { once: true, margin: "-5%"  });
  const sep2InView    = useInView(sep2Ref,    { once: true, margin: "-5%"  });
  const sep3InView    = useInView(sep3Ref,    { once: true, margin: "-5%"  });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("ivannevares9@gmail.com");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {}
  };

  const isEn = language === "en";

  return (
    <div className="min-h-screen bg-background lg:cursor-none relative">
      <PageReveal />
      <ScrollProgress />
      <CustomCursor />

      {/* -- HERO — halftone (landing / v2 web) or draggable graphic "desktop" (v2 graphic) */}
      <section className="hero-band relative isolate flex flex-col overflow-hidden px-4 lg:px-6">
        {showGraphicDesktopHero ? (
          <GraphicDesktopHero />
        ) : (
          <HeroHalftoneP5 className="pointer-events-none z-0" />
        )}
        <div
          className={cn(
            "relative z-30",
            showGraphicDesktopHero && "pointer-events-none",
          )}
        >
          <h1 className="hero-title-stack font-helveticaNowDisplayBold text-name-hero tracking-[-0.02em]">
            <SplashClipReveal
              live={heroLive}
              index={heroRevealIndex(splashNavItemCount, 0)}
              reduced={heroReduced}
            >
              <span className="hero-name optical-edge-start">Ivan Nevares</span>
            </SplashClipReveal>
            <SplashClipReveal
              live={heroLive}
              index={heroRevealIndex(splashNavItemCount, 1)}
              reduced={heroReduced}
            >
              <span className="text-hero-subtitle block font-helveticaNowTextRegular text-muted-foreground tracking-normal leading-none">
                {t("hero.subtitle")}
              </span>
            </SplashClipReveal>
          </h1>
        </div>
      </section>

      {/* separator 1 */}
      <div ref={sep1Ref}><AnimatedLine inView={sep1InView} /></div>

      {/* -- WORK --------------------------------------------------------- */}
      {(v2Mode === "web") ? (
      <section id="work" ref={workRef} className="px-4 lg:px-6 py-20">
        <motion.p
          initial={{ opacity: 0 }}
          animate={workInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
          className={cn(editorialNavType, "mb-6 text-foreground")}
        >
          {t("work.title")}
        </motion.p>

        <div className="divide-y divide-border">
          {PROJECT_ROWS.map(({ key, idx, metricEn, metricEs, marqueeEn, marqueeEs }, i) => (
            <ProjectRow
              key={key}
              slug={key}
              index={i + 1}
              name={projects[idx].name}
              category={t(`work.${key}.title` as Parameters<typeof t>[0])}
              metric={isEn ? metricEn : metricEs}
              year={projects[idx].year}
              marqueeLine={isEn ? marqueeEn : marqueeEs}
              delay={i * 0.06}
              inView={workInView}
            />
          ))}
        </div>
      </section>
      ) : null}

      {/* separator 2 */}
      <div ref={sep2Ref}><AnimatedLine inView={sep2InView} /></div>

      {/* -- ABOUT -------------------------------------------------------- */}
      <section id="about" ref={aboutRef} className="px-4 lg:px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-12">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={aboutInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
          className={cn(editorialNavType, "lg:col-span-2 self-start text-foreground")}
        >
          {t("about.title")}
        </motion.p>

        <motion.p
          className="lg:col-span-6 text-type-body font-helveticaNowTextRegular text-muted-foreground leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={aboutInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.12, ease: EASE_OUT_EXPO }}
        >
          {t("about.p1")}
          <a
            href={WOHL_STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/90 underline decoration-muted-foreground/50 underline-offset-2 transition-colors hover:text-foreground hover:decoration-foreground/50"
          >
            {t("contact.blurbWohl")}
          </a>{" "}
          {t("about.p2")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={aboutInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.24, ease: EASE_OUT_EXPO }}
          className="lg:col-span-3 lg:col-start-10"
        >
          <Suspense fallback={<div className="w-full aspect-square bg-muted/50 rounded-lg animate-pulse" />}>
            <GeometricFlowCard />
          </Suspense>
        </motion.div>
      </section>

      {/* separator 3 */}
      <div ref={sep3Ref}><AnimatedLine inView={sep3InView} /></div>

      {/* -- CONTACT — editorial / graphic studio block ------------------- */}
      <section
        id="contact"
        ref={contactRef}
        className="relative overflow-hidden px-4 py-16 pb-14 lg:px-6 lg:py-20 lg:pb-16"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.17] [background-image:radial-gradient(circle_at_center,rgb(128_128_128/0.35)_1px,transparent_1px)] [background-size:13px_13px] dark:opacity-[0.12] dark:[background-image:radial-gradient(circle_at_center,rgb(255_255_255/0.12)_1px,transparent_1px)]"
          aria-hidden
        />

        <div className="relative z-[1]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={
              contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
            }
            transition={{ duration: 1, delay: 0.08, ease: EASE_OUT_EXPO }}
            className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <p className={cn(editorialNavType, "max-w-[min(100%,42rem)] text-foreground")}>
              {t("contact.kicker")}
            </p>
            <span className="hidden h-px min-w-[3rem] flex-1 bg-foreground/25 sm:block" aria-hidden />
            <p className={cn(editorialNavType, "tabular-nums text-muted-foreground")}>
              {t("contact.stamp")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 1.05, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="flex flex-col gap-4 sm:flex-row sm:flex-wrap"
          >
            <Magnetic strength={0.2} className="min-w-0 w-full sm:w-auto sm:max-w-full">
              <button
                type="button"
                onClick={copyEmail}
                className={editorialFooterMuted()}
                title="ivannevares9@gmail.com"
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden />
                <span className="truncate">ivannevares9@gmail.com</span>
              </button>
            </Magnetic>
            <Magnetic strength={0.2} className="w-full sm:w-auto sm:max-w-full">
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className={editorialFooterPrimary()}
              >
                <MessageSquare className="w-4 h-4 shrink-0" aria-hidden />
                {isEn ? "Send a message" : "Enviar mensaje"}
              </button>
            </Magnetic>
          </motion.div>
        </div>

        <motion.nav
          initial={{ opacity: 0, y: 16 }}
          animate={contactInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.32, ease: EASE_OUT_EXPO }}
          className="relative z-[1] mt-12"
          aria-label={t("contact.socialNav")}
        >
          <p className={cn(editorialNavType, "mb-4 text-foreground")}>
            {t("contact.elsewhere")}
          </p>
          <div className="grid grid-cols-12 gap-4 lg:gap-6 font-helveticaNowTextRegular text-type-0 text-muted-foreground">
            {(
              [
                { href: "https://github.com/i9-9", label: "GitHub" },
                { href: "https://www.linkedin.com/in/ivan-nevares/", label: "LinkedIn" },
                { href: "https://www.behance.net/ivan_nevares", label: "Behance" },
                { href: "https://dribbble.com/i9i9", label: "Dribbble" },
              ] as const
            ).map(({ href, label }) => (
              <Magnetic
                key={href}
                strength={0.22}
                className="col-span-6 lg:col-span-1"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center gap-1 tracking-[0.06em] transition-colors duration-300 hover:text-foreground"
                >
                  {label}
                  <ArrowRight className="size-3.5 shrink-0 opacity-60 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100" aria-hidden />
                </a>
              </Magnetic>
            ))}
          </div>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={contactInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.44, ease: EASE_OUT_EXPO }}
          className="relative z-[1] mt-16 -mx-4 bg-[#DFFF4D] text-neutral-950 lg:-mx-6"
        >
          {heroReduced ? (
            <p className="px-4 py-2.5 text-center font-helveticaNowTextRegular text-type-micro normal-case leading-relaxed tracking-[-0.02em]">
              {t("contact.marquee")}
            </p>
          ) : (
            <ContactFooterMarquee text={t("contact.marquee")} />
          )}
        </motion.div>
      </section>

      <Footer />

      {contactModalLoaded ? (
        <ContactFormModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      ) : null}
      <Toast message={t("contact.mailCopied")} isVisible={showToast} />
    </div>
  );
}
