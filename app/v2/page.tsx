"use client";

import {
  useState, lazy, Suspense, useRef, useEffect, useLayoutEffect, useCallback,
} from "react";
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useTransform,
  useScroll, useInView, useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { projects } from "../data/projects";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  editorialMutedReadable,
  editorialPrimary,
} from "@/lib/editorial-cta";
import { V2StrokeTour } from "@/components/V2StrokeTour";
import { HeroHalftoneP5 } from "@/components/HeroHalftoneP5";
import { ContactFormModal } from "@/components/ContactFormModal";
import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  Mail, MessageSquare,
  ArrowRight,
  Asterisk,
} from "lucide-react";

const GeometricFlowCard = lazy(() => import("@/components/GeometricFlowCard"));

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
/** Full-viewport exit: smooth in-out so the slab lifts without a sluggish ease-out tail. */
const SPLASH_EXIT_EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Contact hero display: per-line tracking tuned per script (display size ~clamp 3.5–9rem).
 * Pairs with OpenType kerning on the parent h2.
 */
const CONTACT_DISPLAY_KERN = {
  en: [
    "tracking-[-0.021em]", // “Let it read” — balance t↔i, d hook
    "tracking-[-0.032em]", // “like design.” — second line slightly tighter
  ],
  es: [
    "tracking-[-0.017em]", // “Que se lea” — subjuntivo sin tilde
    "tracking-[-0.026em]", // “como diseño.” — round forms + tilde
  ],
} as const;

// --- PageReveal -----------------------------------------------------------
// Editorial splash in the Müller-Brockmann tradition: huge tabular counter
// in the optical center, asymmetric grid metadata in the corners, single
// horizontal rule. Counts 00 → 100 with ease-out-expo, then the entire
// curtain lifts away as a single slab.
function PageReveal({ onHandoff }: { onHandoff?: () => void }) {
  const reduced = useReducedMotion();
  const handoffRef = useRef(onHandoff);
  handoffRef.current = onHandoff;

  const [done, setDone]   = useState(false);
  const [count, setCount] = useState(0);

  // Skip splash before first paint when reduced motion is requested
  useLayoutEffect(() => {
    if (!reduced) return;
    setCount(100);
    handoffRef.current?.();
    setDone(true);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;

    const start = performance.now();
    const duration = 1100;
    let raf = 0;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out-expo for a deliberate, decelerating count
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // hold at 100 briefly before lifting the curtain — handoff + exit same beat
        holdTimer = setTimeout(() => {
          handoffRef.current?.();
          setDone(true);
        }, 220);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (holdTimer !== undefined) clearTimeout(holdTimer);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-background flex flex-col select-none"
          initial={{ y: 0 }}
          exit={{ y: "-101%" }}
          transition={{ duration: 0.78, ease: SPLASH_EXIT_EASE }}
        >
          {/* top metadata — asymmetric grid, Swiss style */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6 px-4 lg:px-12 pt-6 lg:pt-8 text-[10px] lg:text-xs font-helveticaNowTextRegular tracking-[0.2em] uppercase text-muted-foreground">
            <div className="col-span-6 lg:col-span-3">Ivan Nevares</div>
            <div className="hidden lg:block col-span-6">UX/UI · Front-End</div>
            <div className="col-span-6 lg:col-span-3 text-right">Portfolio · MMXXVI</div>
          </div>

          {/* the counter — optical center, tabular nums for steady width */}
          <div className="flex-1 flex items-center justify-center px-4 lg:px-12">
            <span
              className="font-helveticaNowDisplayBold leading-none tabular-nums tracking-tighter"
              style={{ fontSize: "clamp(8rem, 28vw, 22rem)" }}
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
            <div className="grid grid-cols-12 gap-4 lg:gap-6 text-[10px] lg:text-xs font-helveticaNowTextRegular tracking-[0.2em] uppercase text-muted-foreground">
              <div className="col-span-6 lg:col-span-3">Buenos Aires · AR</div>
              <div className="hidden lg:block col-span-6">{count < 100 ? "Loading" : "Ready"}</div>
              <div className="col-span-6 lg:col-span-3 text-right tabular-nums">{count}/100</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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


// --- WordReveal -----------------------------------------------------------
// Splits a string into words and animates each with stagger.
// No overflow clipping → no ascender/descender cuts. Uses opacity + blur to
// mask in-flight motion. The signature animation pattern of high-end design
// portfolios (Locomotive, Active Theory, Resn).
function WordReveal({
  text,
  inView = true,
  baseDelay = 0,
  wordStagger = 0.045,
  duration = 0.95,
  className = "",
  as: Tag = "span",
}: {
  text: string;
  inView?: boolean;
  baseDelay?: number;
  wordStagger?: number;
  duration?: number;
  className?: string;
  as?: "span" | "div";
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  // accessibility: respect prefers-reduced-motion. show text immediately,
  // skipping the animation entirely.
  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "0.55em", opacity: 0, filter: "blur(8px)" }}
            animate={
              inView
                ? { y: 0, opacity: 1, filter: "blur(0px)" }
                : { y: "0.55em", opacity: 0, filter: "blur(8px)" }
            }
            transition={{
              duration,
              delay: baseDelay + i * wordStagger,
              ease: EASE_OUT_EXPO,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
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
  const mouseX    = useMotionValue(-200);
  const mouseY    = useMotionValue(-200);
  const isVisible = useRef(false);
  const [ready, setReady] = useState(false);

  const DOT  = 8;
  const RING = 28;

  const dotLeft = useTransform(mouseX, v => v - DOT  / 2);
  const dotTop  = useTransform(mouseY, v => v - DOT  / 2);

  const lagX = useSpring(mouseX, { stiffness: 220, damping: 22, mass: 0.35 });
  const lagY = useSpring(mouseY, { stiffness: 220, damping: 22, mass: 0.35 });

  const ringLeft     = useTransform(lagX, v => v - RING / 2);
  const ringTop      = useTransform(lagY, v => v - RING / 2);
  const ringScale    = useMotionValue(1);
  const ringScaleSp  = useSpring(ringScale, { stiffness: 400, damping: 30 });
  const dotOpacity   = useMotionValue(0);

  useLayoutEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setReady(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible.current) {
        isVisible.current = true;
        dotOpacity.set(1);
      }
    };
    const onOver  = (e: MouseEvent) => { if ((e.target as Element).closest("a, button")) ringScale.set(2); };
    const onOut   = (e: MouseEvent) => { if ((e.target as Element).closest("a, button")) ringScale.set(1); };
    const onLeave = () => dotOpacity.set(0);
    const onEnter = () => dotOpacity.set(1);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  if (!ready) return null;
  const invertBackdrop = {
    /** Triggers reliable backdrop-filter compositing (WebKit/Chrome). */
    backgroundColor: "rgba(255,255,255,0.015)",
    backdropFilter: "invert(1)",
    WebkitBackdropFilter: "invert(1)",
  } as const;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[10000] will-change-[transform,opacity] border border-foreground/25 dark:border-white/35"
        style={{
          left: ringLeft,
          top: ringTop,
          width: RING,
          height: RING,
          scale: ringScaleSp,
          opacity: dotOpacity,
          ...invertBackdrop,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[10001] will-change-[transform,opacity]"
        style={{
          left: dotLeft,
          top: dotTop,
          width: DOT,
          height: DOT,
          opacity: dotOpacity,
          ...invertBackdrop,
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
    metricEn: "100% custom design system",
    metricEs: "100% design system custom",
    marqueeEn: "Lead design & frontend · Hey Bristol · Next.js · TypeScript · ",
    marqueeEs: "Diseño y frontend · Hey Bristol · Next.js · TypeScript · ",
  },
  {
    key: "kostume",
    idx: 1,
    preview: "/projects-v2/kostume.png",
    metricEn: "Live in 6 weeks",
    metricEs: "Live en 6 semanas",
    marqueeEn: "Lead design & frontend · Kostüme · Next.js · Tienda Nube · ",
    marqueeEs: "Diseño y frontend · Kostüme · Next.js · Tienda Nube · ",
  },
  {
    key: "vinorodante",
    idx: 2,
    preview: "/projects-v2/vinorodante.png",
    metricEn: "Full brand identity included",
    metricEs: "Identidad de marca completa",
    marqueeEn: "Brand, UX/UI & build · Vino Rodante · Next.js · ",
    marqueeEs: "Marca, UX/UI y desarrollo · Vino Rodante · Next.js · ",
  },
  {
    key: "ursulabenavidez",
    idx: 3,
    preview: "/projects-v2/ursulabenavidez.png",
    metricEn: "Zero third-party deps",
    metricEs: "Sin dependencias externas",
    marqueeEn: "UX/UI & development · Ursula Benavidez · Next.js · ",
    marqueeEs: "UX/UI y desarrollo · Ursula Benavidez · Next.js · ",
  },
  {
    key: "templodetierra",
    idx: 4,
    preview: "/projects-v2/templodetierra.png",
    metricEn: "Mobile-first UX from scratch",
    metricEs: "UX mobile-first desde cero",
    marqueeEn: "UX/UI & frontend · Templo de Tierra · Next.js · ",
    marqueeEs: "UX/UI y frontend · Templo de Tierra · Next.js · ",
  },
  {
    key: "desenfreno",
    idx: 5,
    preview: "/projects-v2/eldesenfreno.png",
    metricEn: "Custom CMS + e-commerce",
    metricEs: "CMS custom + e-commerce",
    marqueeEn: "Product design & CMS · El Desenfreno · Next.js · Stripe · ",
    marqueeEs: "Diseño de producto y CMS · El Desenfreno · Next.js · Stripe · ",
  },
  {
    key: "grupofrali",
    idx: 6,
    preview: "/projects-v2/grupofrali.png",
    metricEn: "Corporate site with live project metrics",
    metricEs: "Sitio corporativo con métricas en vivo",
    marqueeEn: "UX/UI & frontend · Grupo Frali · Next.js · TypeScript · ",
    marqueeEs: "UX/UI y frontend · Grupo Frali · Next.js · TypeScript · ",
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
        <div className="relative flex items-center justify-between gap-4 py-5 lg:py-6">
        {/* Editorial marquee — desktop: thin strip under row content (not tucked under title) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-8 motion-reduce:hidden lg:block overflow-hidden opacity-0 transition-opacity duration-500 [mask-image:linear-gradient(180deg,transparent_0%,#000_40%,#000_100%)] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,#000_40%,#000_100%)] group-hover:opacity-100"
          aria-hidden
        >
          <div className="flex h-full items-end pb-1">
            <div className="work-row-marquee-track">
              <span className="inline-block whitespace-nowrap pr-12 text-[9px] font-helveticaNowTextRegular uppercase tracking-[0.22em] text-background/40">
                {marqueeLine}
              </span>
              <span className="inline-block whitespace-nowrap pr-12 text-[9px] font-helveticaNowTextRegular uppercase tracking-[0.22em] text-background/40">
                {marqueeLine}
              </span>
            </div>
          </div>
        </div>

        {/* left: index + name + category */}
        <div className="relative z-10 flex items-center gap-5 lg:gap-8 min-w-0">
          <span className="text-xs font-helveticaNowTextRegular text-muted-foreground group-hover:text-background/40 transition-colors duration-500 w-6 flex-shrink-0 tabular-nums">
            <NumberScramble value={index} inView={inView} />
          </span>
          <div className="min-w-0">
            <motion.p
              className="font-helveticaNowDisplayBold text-xl lg:text-3xl transition-colors duration-500"
              animate={{ x: hovered ? 12 : 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            >
              {name}
            </motion.p>
            <motion.p
              className="text-xs font-helveticaNowTextRegular text-muted-foreground mt-0.5 group-hover:text-background/50 transition-colors duration-500"
              animate={{ x: hovered ? 12 : 0 }}
              transition={{ duration: 0.6, delay: 0.04, ease: EASE_OUT_EXPO }}
            >
              {category}
            </motion.p>
          </div>
        </div>

        {/* right: metric (absolute, on hover) + year (fixed col) + arrow */}
        <div className="relative z-10 flex items-center gap-6 flex-shrink-0">
          <motion.span
            initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
            animate={hovered
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : { opacity: 0, x: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="hidden lg:block absolute right-full mr-6 text-xs font-helveticaNowTextRegular text-background/70 whitespace-nowrap"
          >
            {metric}
          </motion.span>
          <span className="hidden lg:block text-xs font-helveticaNowTextRegular text-muted-foreground group-hover:text-background/40 tabular-nums transition-colors duration-500 w-10 text-right">
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
export default function ProfileLayoutV2() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showToast,     setShowToast]     = useState(false);
  const { t, language } = useLanguage();
  const heroReduced = useReducedMotion();
  const [splashHandoff, setSplashHandoff] = useState(false);
  const onSplashHandoff = useCallback(() => {
    setSplashHandoff(true);
  }, []);
  /** Hero motion is synced to splash lift (same frame as setDone), not fixed mount delays */
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

  const contactHeadlines = isEn
    ? (["Let it read", "like design."] as const)
    : (["Que se lea", "como diseño."] as const);

  return (
    <div className="min-h-screen bg-background lg:cursor-none relative">
      <PageReveal onHandoff={onSplashHandoff} />
      <V2StrokeTour active={splashHandoff} />
      <ScrollProgress />
      <CustomCursor />

      {/* -- HERO — halftone dots (p5), glass plate over dots, stamp / name / blurb */}
      <section className="relative isolate min-h-[calc(100vh-6rem)] flex flex-col justify-end overflow-hidden px-4 lg:px-12 pb-10 lg:pb-14 pt-24">
        <HeroHalftoneP5 className="pointer-events-none z-0" />
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={
            heroLive
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 18, filter: "blur(8px)" }
          }
          transition={{ duration: 0.95, delay: heroLive ? 0.06 : 0, ease: EASE_OUT_EXPO }}
          className={cn(
            "relative z-30 w-full max-w-[13rem] sm:max-w-[14rem] space-y-2.5 rounded-[22px]",
            "border border-border/50 bg-background/55 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]",
            "backdrop-blur-2xl backdrop-saturate-150",
            "ring-1 ring-inset ring-white/50 dark:border-white/[0.09] dark:bg-background/45 dark:shadow-[0_12px_48px_-16px_rgba(0,0,0,0.65)] dark:ring-inset dark:ring-white/[0.07]",
            "p-4 sm:p-[1.125rem]",
          )}
        >
          <div
            className="inline-flex overflow-hidden rounded-[10px] border border-foreground/12 bg-foreground/[0.04] text-[7px] sm:text-[7.5px] font-helveticaNowTextRegular uppercase tracking-[0.18em] text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)] dark:border-white/[0.12] dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
            aria-hidden
            data-v2-stroke-hero="wrap"
          >
            <div
              className="flex items-center px-1.5 py-1 sm:px-2 sm:py-1 border-r border-foreground/12 tabular-nums dark:border-white/10"
              data-v2-stroke-hero="gd"
            >
              {t("hero.stampGd")}
            </div>
            <div
              className="flex items-center px-1.5 py-1 sm:px-2 sm:py-1 tabular-nums"
              data-v2-stroke-hero="dev"
            >
              {t("hero.stampDev")}
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-helveticaNowDisplayBold text-[clamp(1.35rem,4vw,1.9rem)] leading-[0.98] tracking-tight">
              {t("hero.stampName")}
            </p>
            <p className="font-helveticaNowDisplayBold text-[11px] sm:text-xs leading-[0.95] tracking-tight text-foreground/88 hyphens-none">
              {t("contact.blurb")}
              <Asterisk
                className="inline-block align-top w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 mt-0.5 text-muted-foreground opacity-80"
                strokeWidth={1.25}
                aria-hidden
              />
            </p>
          </div>

          <a
            href="#work"
            className="group inline-flex items-center gap-1.5 pt-0.5 text-[9px] font-helveticaNowTextRegular uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("hero.stampWorkLink")}
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:rotate-45" />
          </a>
        </motion.div>
      </section>

      {/* separator 1 */}
      <div ref={sep1Ref}><AnimatedLine inView={sep1InView} /></div>

      {/* -- WORK --------------------------------------------------------- */}
      <section id="work" ref={workRef} className="px-4 lg:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={
            workInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 16, filter: "blur(6px)" }
          }
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="mb-12"
        >
          <p className="max-w-2xl font-helveticaNowTextRegular text-sm leading-relaxed text-muted-foreground lg:text-[15px] lg:leading-relaxed">
            {t("work.trustLead")}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={workInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-xs font-helveticaNowTextRegular tracking-[0.2em] uppercase text-muted-foreground mb-10"
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

      {/* separator 2 */}
      <div ref={sep2Ref}><AnimatedLine inView={sep2InView} /></div>

      {/* -- ABOUT -------------------------------------------------------- */}
      <section ref={aboutRef} className="px-4 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-12">
        <motion.p
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={aboutInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className="lg:col-span-2 text-xs font-helveticaNowTextRegular tracking-[0.2em] uppercase text-muted-foreground self-start pt-1"
        >
          {isEn ? "About" : "Sobre mí"}
        </motion.p>

        <div className="lg:col-span-6 space-y-4 font-helveticaNowTextRegular text-muted-foreground leading-relaxed">
          {(isEn
            ? "I'm a UX/UI Designer and Front-End Developer based in Buenos Aires. I work with startups and independent brands to build digital products that are fast, polished, and pleasant to use.\n\nI care about the details that make an interface feel right — hierarchy, spacing, feedback, performance. My stack is React / Next.js / TypeScript, and I design in Figma before I write a single line of code."
            : "Soy Diseñador UX/UI y Desarrollador Front-End basado en Buenos Aires. Trabajo con startups y marcas independientes para construir productos digitales rápidos, pulidos y agradables de usar.\n\nMe importan los detalles que hacen que una interfaz se sienta bien — jerarquía, espaciado, feedback, rendimiento. Mi stack es React / Next.js / TypeScript, y diseño en Figma antes de escribir una línea de código."
          ).split("\n\n").map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={aboutInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE_OUT_EXPO }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={aboutInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE_OUT_EXPO }}
          className="lg:col-span-3 lg:col-start-10 space-y-6"
        >
          <div className="space-y-3">
            <p className="text-xs font-helveticaNowDisplayBold tracking-[0.15em] uppercase">
              {t("focus.development")}
            </p>
            <div className="flex flex-wrap gap-2">
              {["React", "Next.js", "TypeScript"].map(s => (
                <Badge key={s} variant="outline" className="text-[9px] tracking-[0.2em] uppercase">{s}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-helveticaNowDisplayBold tracking-[0.15em] uppercase">
              {t("focus.design")}
            </p>
            <div className="flex flex-wrap gap-2">
              {["UX/UI", "Adobe", "Figma"].map(s => (
                <Badge key={s} variant="outline" className="text-[9px] tracking-[0.2em] uppercase">{s}</Badge>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <Suspense fallback={<div className="w-full aspect-square bg-muted/50 rounded-lg animate-pulse" />}>
              <GeometricFlowCard />
            </Suspense>
          </div>
        </motion.div>
      </section>

      {/* separator 3 */}
      <div ref={sep3Ref}><AnimatedLine inView={sep3InView} /></div>

      {/* -- CONTACT — editorial / graphic studio block ------------------- */}
      <section
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
            <p className="max-w-[min(100%,42rem)] text-[10px] font-helveticaNowDisplayBold uppercase leading-relaxed tracking-[0.14em] text-foreground">
              {t("contact.kicker")}
            </p>
            <span className="hidden h-px min-w-[3rem] flex-1 bg-foreground/25 sm:block" aria-hidden />
            <p className="text-[10px] font-helveticaNowTextRegular tabular-nums tracking-[0.22em] text-muted-foreground">
              {t("contact.stamp")}
            </p>
          </motion.div>

          <h2
            lang={isEn ? "en" : "es"}
            className="mb-8 font-helveticaNowDisplayBold leading-[0.82] [font-feature-settings:'kern'_1] [font-kerning:normal] [text-rendering:optimizeLegibility]"
            style={{ fontSize: "clamp(3.5rem, 9vw, 9rem)" }}
          >
            {contactHeadlines.map((line, lineIdx) => {
              const wordsBefore = contactHeadlines
                .slice(0, lineIdx)
                .reduce((acc, l) => acc + l.split(" ").length, 0);
              const kernLine = CONTACT_DISPLAY_KERN[isEn ? "en" : "es"][lineIdx];
              return (
                <span key={lineIdx} className={cn("block", kernLine)}>
                  <WordReveal
                    text={line}
                    inView={contactInView}
                    baseDelay={wordsBefore * 0.06}
                    wordStagger={0.06}
                    duration={1.0}
                  />
                </span>
              );
            })}
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={
              contactInView
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 16, filter: "blur(6px)" }
            }
            transition={{ duration: 0.9, delay: 0.32, ease: EASE_OUT_EXPO }}
            className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic strength={0.2}>
              <button
                type="button"
                onClick={copyEmail}
                className={editorialMutedReadable("justify-start text-left")}
              >
                <Mail className="w-4 h-4" aria-hidden />
                ivannevares9@gmail.com
              </button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className={editorialPrimary("inline-flex items-center gap-2", "compact")}
              >
                <MessageSquare className="w-4 h-4" aria-hidden />
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
          <p className="mb-4 text-[10px] font-helveticaNowTextRegular uppercase tracking-[0.22em] text-muted-foreground">
            {t("contact.elsewhere")}
          </p>
          <div className="flex flex-wrap items-baseline gap-x-1 gap-y-2 font-helveticaNowTextRegular text-sm text-muted-foreground">
            {(
              [
                { href: "https://github.com/i9-9", label: "GitHub" },
                { href: "https://www.linkedin.com/in/ivan-nevares/", label: "LinkedIn" },
                { href: "https://www.behance.net/ivan_nevares", label: "Behance" },
                { href: "https://dribbble.com/i9i9", label: "Dribbble" },
              ] as const
            ).map(({ href, label }, i) => (
              <span key={href} className="inline-flex flex-wrap items-baseline gap-x-1">
                {i > 0 && (
                  <span className="select-none px-1 text-muted-foreground/35" aria-hidden>
                    —
                  </span>
                )}
                <Magnetic strength={0.22}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 tracking-[0.06em] transition-colors duration-300 hover:text-foreground"
                  >
                    {label}
                    <ArrowRight className="size-3.5 shrink-0 opacity-60 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100" aria-hidden />
                  </a>
                </Magnetic>
              </span>
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
            <p className="px-4 py-2.5 text-center font-helveticaNowTextRegular text-[8px] uppercase leading-relaxed tracking-[0.3em]">
              {t("contact.marquee")}
            </p>
          ) : (
            <div className="contact-cta-marquee-viewport py-2" aria-hidden>
              <div className="contact-cta-marquee-track font-helveticaNowTextRegular text-[7px] uppercase leading-none tracking-[0.32em] sm:text-[8px]">
                {([0, 1] as const).map((key) => (
                  <span key={key} className="inline-flex shrink-0 items-center whitespace-nowrap pr-14 sm:pr-20">
                    {t("contact.marquee")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </section>

      <Footer />

      <ContactFormModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <Toast message={t("contact.mailCopied")} isVisible={showToast} />
    </div>
  );
}
