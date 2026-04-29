"use client";

import {
  useState, lazy, Suspense, useRef, useEffect,
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
import { ContactFormModal } from "@/components/ContactFormModal";
import { Toast } from "@/components/ui/toast";
import {
  Mail, ArrowRight, MessageSquare, ChevronDown,
  Github, Linkedin, Dribbble, Palette, ArrowUpRight,
} from "lucide-react";

const GeometricFlowCard = lazy(() => import("@/components/GeometricFlowCard"));

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

// ─── PageReveal ───────────────────────────────────────────────────────────
// Editorial splash in the Müller-Brockmann tradition: huge tabular counter
// in the optical center, asymmetric grid metadata in the corners, single
// horizontal rule. Counts 00 → 100 with ease-out-expo, then the entire
// curtain lifts away as a single slab.
function PageReveal() {
  const [done, setDone]   = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out-expo for a deliberate, decelerating count
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // hold at 100 briefly before lifting the curtain
        setTimeout(() => setDone(true), 220);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-background flex flex-col select-none"
          initial={{ y: 0 }}
          exit={{ y: "-101%" }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
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

// ─── Magnetic ─────────────────────────────────────────────────────────────
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


// ─── WordReveal ───────────────────────────────────────────────────────────
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

// ─── ScrollProgress ───────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[1px] bg-foreground origin-left z-[9998] pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

// ─── CustomCursor ─────────────────────────────────────────────────────────
function CustomCursor() {
  const mouseX    = useMotionValue(-200);
  const mouseY    = useMotionValue(-200);
  const isVisible = useRef(false);
  const [show, setShow] = useState(false);

  const DOT  = 8;
  const RING = 28;

  const dotLeft = useTransform(mouseX, v => v - DOT  / 2);
  const dotTop  = useTransform(mouseY, v => v - DOT  / 2);

  const lagX = useSpring(mouseX, { stiffness: 160, damping: 18, mass: 0.4 });
  const lagY = useSpring(mouseY, { stiffness: 160, damping: 18, mass: 0.4 });

  const ringLeft     = useTransform(lagX, v => v - RING / 2);
  const ringTop      = useTransform(lagY, v => v - RING / 2);
  const ringScale    = useMotionValue(1);
  const ringScaleSp  = useSpring(ringScale, { stiffness: 350, damping: 28 });
  const dotOpacity   = useMotionValue(0);
  const dotOpacitySp = useSpring(dotOpacity, { stiffness: 350, damping: 28 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible.current) {
        isVisible.current = true;
        setShow(true);
        dotOpacity.set(1);
      }
    };
    const onOver  = (e: MouseEvent) => { if ((e.target as Element).closest("a, button")) ringScale.set(2); };
    const onOut   = (e: MouseEvent) => { if ((e.target as Element).closest("a, button")) ringScale.set(1); };
    const onLeave = () => dotOpacity.set(0);
    const onEnter = () => dotOpacity.set(1);

    window.addEventListener("mousemove",       onMove);
    document.addEventListener("mouseover",     onOver);
    document.addEventListener("mouseout",      onOut);
    document.addEventListener("mouseleave",    onLeave);
    document.addEventListener("mouseenter",    onEnter);
    return () => {
      window.removeEventListener("mousemove",      onMove);
      document.removeEventListener("mouseover",    onOver);
      document.removeEventListener("mouseout",     onOut);
      document.removeEventListener("mouseleave",   onLeave);
      document.removeEventListener("mouseenter",   onEnter);
    };
  }, []);

  if (!show) return null;
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
        style={{ left: dotLeft, top: dotTop, width: DOT, height: DOT, opacity: dotOpacitySp }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-white pointer-events-none z-[9999] mix-blend-difference"
        style={{ left: ringLeft, top: ringTop, width: RING, height: RING, scale: ringScaleSp, opacity: dotOpacitySp }}
      />
    </>
  );
}

// ─── AnimatedLine ─────────────────────────────────────────────────────────
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

// ─── NumberScramble ───────────────────────────────────────────────────────
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

// ─── Project rows data ────────────────────────────────────────────────────
const PROJECT_ROWS = [
  { key: "heybristol",      idx: 0, year: 2024, preview: "/projects-v2/heybristol.png",      metricEn: "100% custom design system",    metricEs: "100% design system custom"   },
  { key: "kostume",         idx: 1, year: 2023, preview: "/projects-v2/kostume.png",         metricEn: "Live in 6 weeks",               metricEs: "Live en 6 semanas"            },
  { key: "vinorodante",     idx: 2, year: 2023, preview: "/projects-v2/vinorodante.png",     metricEn: "Full brand identity included",  metricEs: "Identidad de marca completa" },
  { key: "ursulabenavidez", idx: 3, year: 2024, preview: "/projects-v2/ursulabenavidez.png", metricEn: "Zero third-party deps",         metricEs: "Sin dependencias externas"   },
  { key: "templodetierra",  idx: 4, year: 2024, preview: "/projects-v2/templodetierra.png",  metricEn: "Mobile-first UX from scratch",  metricEs: "UX mobile-first desde cero"  },
  { key: "desenfreno",      idx: 5, year: 2023, preview: "/projects-v2/eldesenfreno.png",    metricEn: "Custom CMS + e-commerce",       metricEs: "CMS custom + e-commerce"     },
];

// ─── ProjectRow ───────────────────────────────────────────────────────────
function ProjectRow({
  index, name, category, metric, year, url, previewImage, delay, inView,
}: {
  index: number; name: string; category: string; metric: string;
  year: number; url: string; previewImage: string; delay: number; inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  // preview image follows cursor via spring — strict orthogonal motion only,
  // no rotation. Müller-Brockmann grid discipline.
  const pvX   = useMotionValue(0);
  const pvY   = useMotionValue(0);
  const pvXSp = useSpring(pvX, { stiffness: 220, damping: 24, mass: 0.6 });
  const pvYSp = useSpring(pvY, { stiffness: 220, damping: 24, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent) => {
    pvX.set(e.clientX + 28);
    pvY.set(e.clientY - 96);
  };

  return (
    <>
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        animate={inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 24, filter: "blur(6px)" }}
        transition={{ duration: 0.85, delay, ease: EASE_OUT_EXPO }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        className="group relative flex items-center justify-between gap-4 py-5 lg:py-6 -mx-4 lg:-mx-12 px-4 lg:px-12 transition-colors duration-500 hover:bg-foreground hover:text-background"
      >
        {/* left: index + name + category */}
        <div className="flex items-center gap-5 lg:gap-8 min-w-0">
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
        <div className="relative flex items-center gap-6 flex-shrink-0">
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
            animate={hovered ? { x: 4, y: -4, rotate: 0 } : { x: 0, y: 0, rotate: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          >
            <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
          </motion.span>
        </div>
      </motion.a>

      {/* cursor-following image preview — flat, orthogonal, editorial */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="fixed pointer-events-none z-[9990] w-96 aspect-[16/10] overflow-hidden hidden lg:block bg-muted"
            style={{ left: pvXSp, top: pvYSp }}
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

// ─── Page ─────────────────────────────────────────────────────────────────
export default function ProfileLayoutV2() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showToast,     setShowToast]     = useState(false);
  const { t, language } = useLanguage();

  const workRef    = useRef(null);
  const aboutRef   = useRef(null);
  const contactRef = useRef(null);
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

  const heroLines = isEn
    ? ["I design interfaces", "& systems for", "startups that need", "to scale fast."]
    : ["Diseño interfaces", "y sistemas para", "startups que necesitan", "escalar rápido."];

  return (
    <div className="min-h-screen bg-background lg:cursor-none relative">
      <PageReveal />
      <ScrollProgress />
      <CustomCursor />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-6rem)] pt-24 flex flex-col justify-between px-4 lg:px-12 pb-16">
        <div>
          {/* availability — dot + text appear sequentially */}
          <div className="flex items-center gap-2.5 mb-10">
            <motion.span
              className="relative flex h-2 w-2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.45, ease: EASE_OUT_EXPO }}
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -6, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 1.55, ease: EASE_OUT_EXPO }}
              className="text-xs font-helveticaNowTextRegular tracking-[0.15em] uppercase text-muted-foreground"
            >
              {isEn ? "Available for freelance projects" : "Disponible para proyectos freelance"}
            </motion.span>
          </div>

          {/* h1 — per-word reveal with stagger */}
          <h1 className="font-helveticaNowDisplayBold leading-[0.95]">
            {heroLines.map((line, lineIdx) => {
              // accumulate word counts to compute the absolute delay across lines
              const wordsBefore = heroLines
                .slice(0, lineIdx)
                .reduce((acc, l) => acc + l.split(" ").length, 0);
              return (
                <span key={lineIdx} className="block">
                  <WordReveal
                    text={line}
                    baseDelay={1.5 + wordsBefore * 0.045}
                    wordStagger={0.045}
                    duration={1.0}
                  />
                </span>
              );
            })}
          </h1>
        </div>

        {/* bottom row: subtitle | scroll indicator | CTAs */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mt-16">
          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 2.2, ease: EASE_OUT_EXPO }}
            className="font-helveticaNowTextRegular text-muted-foreground text-base lg:text-lg max-w-xs"
          >
            {isEn
              ? "UX/UI Design · Design Systems · Next.js & React"
              : "Diseño UX/UI · Design Systems · Next.js & React"}
          </motion.p>

          {/* scroll indicator — desktop center */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.7, ease: EASE_OUT_EXPO }}
            className="hidden lg:flex flex-col items-center gap-1.5 pb-1 text-muted-foreground"
          >
            <span className="text-[10px] font-helveticaNowTextRegular tracking-[0.2em] uppercase">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>
          </motion.div>

          {/* CTAs — solid editorial blocks, no magnetic. Swiss precision. */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={() => setIsContactOpen(true)}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 2.35, ease: EASE_OUT_EXPO }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-4 text-sm tracking-[0.12em] uppercase font-helveticaNowTextRegular transition-colors duration-300 hover:bg-foreground/90"
            >
              {isEn ? "Let's talk" : "Hablemos"}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
            <motion.a
              href="#work"
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 2.45, ease: EASE_OUT_EXPO }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 border border-foreground px-6 py-4 text-sm tracking-[0.12em] uppercase font-helveticaNowTextRegular transition-colors duration-300 hover:bg-foreground hover:text-background"
            >
              {isEn ? "See my work" : "Ver proyectos"}
            </motion.a>
          </div>
        </div>
      </section>

      {/* separator 1 */}
      <div ref={sep1Ref}><AnimatedLine inView={sep1InView} /></div>

      {/* ── WORK ───────────────────────────────────────────────────────── */}
      <section id="work" ref={workRef} className="px-4 lg:px-12 py-20">
        <motion.p
          initial={{ opacity: 0 }}
          animate={workInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-xs font-helveticaNowTextRegular tracking-[0.2em] uppercase text-muted-foreground mb-10"
        >
          {t("work.title")}
        </motion.p>

        <div className="divide-y divide-border">
          {PROJECT_ROWS.map(({ key, idx, year, preview, metricEn, metricEs }, i) => (
            <ProjectRow
              key={key}
              index={i + 1}
              name={projects[idx].name}
              category={t(`work.${key}.title` as Parameters<typeof t>[0])}
              metric={isEn ? metricEn : metricEs}
              year={year}
              url={projects[idx].anchor}
              previewImage={preview}
              delay={i * 0.07}
              inView={workInView}
            />
          ))}
        </div>
      </section>

      {/* separator 2 */}
      <div ref={sep2Ref}><AnimatedLine inView={sep2InView} /></div>

      {/* ── ABOUT ──────────────────────────────────────────────────────── */}
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

      {/* ── CONTACT ────────────────────────────────────────────────────── */}
      <section ref={contactRef} className="px-4 lg:px-12 py-20">
        <h2
          className="font-helveticaNowDisplayBold leading-[0.95] mb-16"
          style={{ fontSize: "clamp(3.5rem, 9vw, 9rem)" }}
        >
          {(isEn ? ["Let's work", "together."] : ["Trabajemos", "juntos."]).map((line, lineIdx) => {
            const lines = isEn ? ["Let's work", "together."] : ["Trabajemos", "juntos."];
            const wordsBefore = lines
              .slice(0, lineIdx)
              .reduce((acc, l) => acc + l.split(" ").length, 0);
            return (
              <span key={lineIdx} className="block">
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
          animate={contactInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE_OUT_EXPO }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Magnetic strength={0.2}>
            <button
              onClick={copyEmail}
              className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-3 text-sm font-helveticaNowTextRegular tracking-wide transition-colors duration-300 hover:bg-accent active:scale-[0.98]"
            >
              <Mail className="w-4 h-4" />
              ivannevares9@gmail.com
            </button>
          </Magnetic>
          <Magnetic strength={0.2}>
            <button
              onClick={() => setIsContactOpen(true)}
              className="group inline-flex items-center gap-2 rounded-sm bg-foreground text-background px-5 py-3 text-sm font-helveticaNowTextRegular tracking-wide transition-colors duration-300 hover:bg-foreground/90 active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4" />
              {isEn ? "Send a message" : "Enviar mensaje"}
            </button>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={contactInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.65, ease: EASE_OUT_EXPO }}
          className="flex items-center gap-2 mt-8"
        >
          {[
            { href: "https://github.com/i9-9",                  Icon: Github   },
            { href: "https://www.linkedin.com/in/ivan-nevares/", Icon: Linkedin },
            { href: "https://www.behance.net/ivan_nevares",      Icon: Palette  },
            { href: "https://dribbble.com/i9i9",                 Icon: Dribbble },
          ].map(({ href, Icon }, i) => (
            <Magnetic key={href} strength={0.4}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            </Magnetic>
          ))}
        </motion.div>
      </section>

      <Footer />

      <ContactFormModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <Toast message={t("contact.mailCopied")} isVisible={showToast} />
    </div>
  );
}
