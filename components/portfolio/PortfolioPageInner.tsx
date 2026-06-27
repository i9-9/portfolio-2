"use client";

import { useState, lazy, Suspense, useRef, useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useTransform,
  useScroll, useInView, useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { projects } from "@/app/data/projects";
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
import {
  Mail, MessageSquare,
  ArrowRight,
  Asterisk,
} from "lucide-react";

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

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
/** Full-viewport exit — shorter on slow paths so the site feels responsive. */
const SPLASH_EXIT_EASE = [0.76, 0, 0.24, 1] as const;

const WOHL_STUDIO_URL = "https://wohl.co/";

// --- PageReveal -----------------------------------------------------------
// Editorial splash: counter 00 → 100 over a fixed beat, then waits briefly for
// `document.fonts.ready` (capped) so the overlap hides webfont swap.
function PageReveal() {
  const reduced = useReducedMotion();
  const { notifyHandoff } = useSplashHandoff();
  const handoffRef = useRef(notifyHandoff);
  handoffRef.current = notifyHandoff;

  const [done, setDone]   = useState(false);
  const [count, setCount] = useState(0);

  // Skip splash before first paint when reduced motion or already seen this session.
  useLayoutEffect(() => {
    let skipSession = false;
    try {
      skipSession =
        typeof window !== "undefined" &&
        window.sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
    } catch {
      skipSession = false;
    }
    if (!reduced && !skipSession) return;
    setCount(100);
    handoffRef.current?.();
    setDone(true);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;

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

    const start = performance.now();
    const duration = 720;
    let raf = 0;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
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

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        holdTimer = setTimeout(() => {
          const cap = new Promise<void>((r) => {
            setTimeout(r, FONT_WAIT_CAP_MS);
          });
          void Promise.race([fontsP, cap]).finally(finishSplash);
        }, 90);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (holdTimer !== undefined) clearTimeout(holdTimer);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-background flex flex-col select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: SPLASH_EXIT_EASE }}
        >
          {/* top metadata — row 1, same band as nav */}
          <div className="nav-bar-inner h-[var(--grid-row)] shrink-0">
            <div className="col-span-6 lg:col-span-3 min-w-0">
              <div className="text-name-nav leading-none font-helveticaNowDisplayBold tracking-[-0.02em] text-foreground optical-edge-start">
                Ivan Nevares
              </div>
            </div>
            <div className={cn("col-span-6 lg:col-span-3 lg:col-start-10 text-right leading-none", editorialNavType, "text-muted-foreground")}>
              Portfolio · MMXXVI
            </div>
          </div>

          {/* the counter — optical center, tabular nums for steady width */}
          <div className="flex-1 flex items-center justify-center px-4 lg:px-12">
            <span
              className="font-helveticaNowDisplayBold text-type-display leading-none tabular-nums tracking-[-0.02em]"
            >
              {String(count).padStart(3, "0")}
            </span>
          </div>

          {/* bottom rule + progress + footer label */}
          <div className="px-4 lg:px-12 pb-6 lg:pb-8">
            <div className="relative w-full h-px bg-border mb-3 lg:mb-4 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-foreground"
                style={{ width: `${count}%` }}
              />
            </div>
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
              <div className={cn("col-span-6 lg:col-span-3", editorialNavType, "text-muted-foreground")}>
                Buenos Aires · AR
              </div>
              <div className={cn("hidden lg:block col-span-6", editorialNavType, "text-muted-foreground")}>
                {count < 100 ? "Loading" : "Fonts"}
              </div>
              <div className={cn("col-span-6 lg:col-span-3 text-right tabular-nums", editorialNavType, "text-muted-foreground")}>
                {count}/100
              </div>
            </div>
          </div>
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
    preview: "/projects-v2/heybristol.png",
    metricEn: "",
    metricEs: "",
    marqueeEn: "Hey Bristol · ",
    marqueeEs: "Hey Bristol · ",
  },
  {
    key: "kostume",
    idx: 1,
    preview: "/projects-v2/kostume.png",
    metricEn: "",
    metricEs: "",
    marqueeEn: "Kostüme · ",
    marqueeEs: "Kostüme · ",
  },
  {
    key: "ursulabenavidez",
    idx: 2,
    preview: "/projects-v2/ursulabenavidez.png",
    metricEn: "",
    metricEs: "",
    marqueeEn: "Ursula Benavidez · ",
    marqueeEs: "Ursula Benavidez · ",
  },
  {
    key: "templodetierra",
    idx: 3,
    preview: "/projects-v2/templodetierra.png",
    metricEn: "",
    metricEs: "",
    marqueeEn: "Templo de Tierra · ",
    marqueeEs: "Templo de Tierra · ",
  },
  {
    key: "desenfreno",
    idx: 4,
    preview: "/projects-v2/eldesenfreno.png",
    metricEn: "",
    metricEs: "",
    marqueeEn: "El Desenfreno · ",
    marqueeEs: "El Desenfreno · ",
  },
  {
    key: "grupofrali",
    idx: 5,
    preview: "/projects-v2/grupofrali.png",
    metricEn: "",
    metricEs: "",
    marqueeEn: "Grupo Frali · ",
    marqueeEs: "Grupo Frali · ",
  },
];

// --- ProjectRow -----------------------------------------------------------
function ProjectRow({
  index,
  name,
  category,
  metric,
  year,
  slug,
  previewImage,
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
  previewImage: string;
  marqueeLine: string;
  delay: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

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

  return (
    <>
      <motion.a
        href={`/work/${slug}`}
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        animate={inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 24, filter: "blur(6px)" }}
        transition={{ duration: 0.85, delay, ease: EASE_OUT_EXPO }}
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
        className="group relative flex flex-col -mx-4 px-4 transition-colors duration-500 hover:bg-foreground hover:text-background overflow-hidden lg:-mx-12 lg:px-12"
      >
        <div className="relative grid grid-cols-[auto_1fr_auto] gap-x-5 items-center py-5 lg:py-6 lg:grid-cols-12 lg:gap-x-6">
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

        <span className="relative z-10 text-type-micro font-helveticaNowTextRegular text-muted-foreground group-hover:text-background/40 transition-colors duration-500 w-6 flex-shrink-0 tabular-nums lg:col-start-1">
          <NumberScramble value={index} inView={inView} />
        </span>

        <div className="relative z-10 min-w-0 lg:col-start-3 lg:col-span-6">
          <motion.p
            className="font-helveticaNowDisplayBold text-type-project transition-colors duration-500"
            animate={{ x: hovered ? 12 : 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            {name}
          </motion.p>
          <motion.p
            className="text-type-0 font-helveticaNowTextRegular text-muted-foreground mt-0.5 group-hover:text-background/50 transition-colors duration-500"
            animate={{ x: hovered ? 12 : 0 }}
            transition={{ duration: 0.6, delay: 0.04, ease: EASE_OUT_EXPO }}
          >
            {category}
          </motion.p>
        </div>

        {/* right: metric (absolute, on hover) + year (fixed col) + arrow */}
        <div className="relative z-10 flex items-center gap-6 flex-shrink-0 justify-self-end lg:col-start-10 lg:col-span-3">
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
            <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform duration-500 ease-out group-hover:rotate-45" />
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
            <Image src={previewImage} alt={name} fill className="object-cover" sizes="384px" />
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
  /** Hero focus fade is synced to splash handoff (same frame as setDone), not fixed mount delays */
  const heroLive = splashHandoff || !!heroReduced;

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
      <section className="hero-band relative isolate flex flex-col overflow-hidden px-4 lg:px-12">
        {showGraphicDesktopHero ? (
          <GraphicDesktopHero />
        ) : (
          <HeroHalftoneP5 className="pointer-events-none z-0" />
        )}
        <motion.div
          initial={{ opacity: 0, filter: "blur(14px)" }}
          animate={
            heroLive
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0, filter: "blur(14px)" }
          }
          transition={{
            delay: heroLive ? 0.06 : 0,
            ease: EASE_OUT_EXPO,
            opacity: { duration: 0.85 },
            filter: { duration: 1.15 },
          }}
          className="relative z-30"
        >
          <h1 className="hero-title-stack font-helveticaNowDisplayBold text-name-hero tracking-[-0.02em]">
            <span className="hero-name optical-edge-start">Ivan Nevares</span>
            <span className="text-hero-subtitle font-helveticaNowTextRegular text-muted-foreground tracking-normal leading-none">
              {t("hero.subtitle")}
            </span>
          </h1>
        </motion.div>
      </section>

      {/* separator 1 */}
      <div ref={sep1Ref}><AnimatedLine inView={sep1InView} /></div>

      {/* -- WORK --------------------------------------------------------- */}
      {(v2Mode === "web") ? (
      <section id="work" ref={workRef} className="px-4 lg:px-12 py-20">
        <motion.p
          initial={{ opacity: 0 }}
          animate={workInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className={cn(editorialNavType, "mb-6 text-foreground")}
        >
          {t("work.title")}
        </motion.p>

        <div className="divide-y divide-border">
          {PROJECT_ROWS.map(({ key, idx, preview, metricEn, metricEs, marqueeEn, marqueeEs }, i) => (
            <ProjectRow
              key={key}
              slug={key}
              index={i + 1}
              name={projects[idx].name}
              category={t(`work.${key}.title` as Parameters<typeof t>[0])}
              metric={isEn ? metricEn : metricEs}
              year={projects[idx].year}
              previewImage={preview}
              marqueeLine={isEn ? marqueeEn : marqueeEs}
              delay={i * 0.07}
              inView={workInView}
            />
          ))}
        </div>
      </section>
      ) : null}

      {/* separator 2 */}
      <div ref={sep2Ref}><AnimatedLine inView={sep2InView} /></div>

      {/* -- ABOUT -------------------------------------------------------- */}
      <section id="about" ref={aboutRef} className="px-4 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-12">
        <motion.p
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={aboutInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className={cn(editorialNavType, "lg:col-span-2 self-start text-foreground")}
        >
          {t("about.title")}
        </motion.p>

        <motion.p
          className="lg:col-span-6 text-type-body font-helveticaNowTextRegular text-muted-foreground leading-relaxed"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={aboutInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
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
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={aboutInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE_OUT_EXPO }}
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
        className="relative overflow-hidden px-4 py-16 pb-14 lg:px-12 lg:py-20 lg:pb-16"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.17] [background-image:radial-gradient(circle_at_center,rgb(128_128_128/0.35)_1px,transparent_1px)] [background-size:13px_13px] dark:opacity-[0.12] dark:[background-image:radial-gradient(circle_at_center,rgb(255_255_255/0.12)_1px,transparent_1px)]"
          aria-hidden
        />

        <div className="relative z-[1]">
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={
              contactInView
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 10, filter: "blur(6px)" }
            }
            transition={{ duration: 0.75, delay: 0.08, ease: EASE_OUT_EXPO }}
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
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={
              contactInView
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 16, filter: "blur(6px)" }
            }
            transition={{ duration: 0.9, delay: 0.32, ease: EASE_OUT_EXPO }}
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
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={contactInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.85, delay: 0.58, ease: EASE_OUT_EXPO }}
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
          transition={{ duration: 0.75, delay: 0.7, ease: EASE_OUT_EXPO }}
          className="relative z-[1] mt-16 -mx-4 bg-[#DFFF4D] text-neutral-950 lg:-mx-12"
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
