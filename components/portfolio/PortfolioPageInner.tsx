"use client";

import { useState, lazy, Suspense, useRef, useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { getProjectBySlug } from "@/app/data/projects";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  contactKickerType,
  editorialNavMuted,
  editorialNavPrimary,
  editorialNavType,
  editorialRail,
  editorialTypeBox,
} from "@/lib/editorial-cta";
import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  SPLASH_SESSION_KEY,
  useSplashHandoff,
} from "@/lib/splash/SplashHandoffContext";
import {
  landingHashId,
  scrollToLandingHashReliable,
} from "@/lib/scroll/landingHash";
import { getLandingLenis } from "@/lib/scroll/lenisStore";
import { EASE_OUT_EXPO, FOOTER_PARALLAX_TRAVEL, MOBILE_PARALLAX_TRAVEL } from "@/lib/motion/easing";
import {
  heroRevealIndex,
  SplashClipReveal,
  SPLASH_NAV_ITEMS_LG,
  SPLASH_NAV_ITEMS_SM,
} from "@/lib/motion/clip-reveal";
import { ArrowRight } from "lucide-react";
import { PageReveal } from "@/components/splash/PageReveal";
import { ContactFooterMarquee } from "@/components/portfolio/ContactFooterMarquee";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import { AnimatedLine } from "@/components/portfolio/AnimatedLine";
import { ProjectRow } from "@/components/portfolio/ProjectRow";
import { PROJECT_ROWS } from "@/components/portfolio/projectRows";

const GeometricFlowCard = lazy(() => import("@/components/GeometricFlowCard"));

function HeroHalftoneFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className,
      )}
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

const WOHL_STUDIO_URL = "https://wohl.co/";

/** Work-list dividers — slower than nav so the L→R draw reads clearly. */
const WORK_LINE_DURATION = 2.35;
const WORK_LINE_STAGGER = 0.22;

export function PortfolioPageInner({ v2Mode = "web" }: { v2Mode?: V2ContentMode }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactModalLoaded, setContactModalLoaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { t, language } = useLanguage();

  useLayoutEffect(() => {
    if (isContactOpen) setContactModalLoaded(true);
  }, [isContactOpen]);

  const showGraphicDesktopHero = v2Mode === "graphic";
  const heroReduced = useReducedMotion();
  const {
    handoff: splashHandoff,
    notifyHeroVisualReady,
  } = useSplashHandoff();
  const heroLive = splashHandoff || !!heroReduced;

  /**
   * During first-visit splash: mount p5/graphic under the overlay so the loader
   * can wait for a real first frame. On skip (session / reduced motion): idle-defer.
   */
  const [heavyVisualsReady, setHeavyVisualsReady] = useState(false);
  useLayoutEffect(() => {
    if (heroReduced === null) return;

    let skipSplash = !!heroReduced;
    try {
      skipSplash =
        skipSplash ||
        window.sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
    } catch {
      skipSplash = true;
    }

    if (!skipSplash) {
      setHeavyVisualsReady(true);
      return;
    }

    if (heroReduced) {
      notifyHeroVisualReady();
      setHeavyVisualsReady(true);
      return;
    }

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const enable = () => {
      if (!cancelled) setHeavyVisualsReady(true);
    };

    const ric = window.requestIdleCallback?.bind(window);
    if (ric) {
      idleId = ric(enable, { timeout: 1800 });
    } else {
      timeoutId = setTimeout(enable, 200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [heroReduced, notifyHeroVisualReady]);

  /** Static fallbacks still count as hero-ready for the splash gate. */
  useEffect(() => {
    if (!heavyVisualsReady) return;
    if (showGraphicDesktopHero) return;
    if (heroReduced) notifyHeroVisualReady();
  }, [
    heavyVisualsReady,
    showGraphicDesktopHero,
    heroReduced,
    notifyHeroVisualReady,
  ]);

  // /#contact from case study CTA — scroll once #contact is mounted, open modal
  useEffect(() => {
    let cancelScroll: (() => void) | undefined;

    const applyLandingHash = () => {
      const hash = window.location.hash;
      const id = landingHashId(hash);
      if (!id) return;

      // Soft-nav from /work/* races Next scroll-to-top — reliable/instant scroll.
      cancelScroll?.();
      cancelScroll = scrollToLandingHashReliable(hash, {
        getLenis: getLandingLenis,
      });

      if (id === "contact") {
        setContactModalLoaded(true);
        setIsContactOpen(true);
      }
    };

    applyLandingHash();
    window.dispatchEvent(new Event("landing:sections-ready"));
    window.addEventListener("hashchange", applyLandingHash);
    return () => {
      cancelScroll?.();
      window.removeEventListener("hashchange", applyLandingHash);
    };
  }, []);

  const [isLgNav, setIsLgNav] = useState(true);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLgNav(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const splashNavItemCount = isLgNav ? SPLASH_NAV_ITEMS_LG : SPLASH_NAV_ITEMS_SM;

  /** Detect mobile for reduced parallax travel distance */
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const contactSocials = [
    { href: "https://github.com/i9-9", label: "GitHub" },
    {
      href: "https://www.linkedin.com/in/ivan-nevares/",
      label: "LinkedIn",
    },
    { href: "https://www.behance.net/ivan_nevares", label: "Behance" },
    { href: "https://dribbble.com/i9i9", label: "Dribbble" },
  ] as const;

  const workRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const marqueeBandRef = useRef<HTMLDivElement | null>(null);
  const marqueeAnchorRef = useRef<HTMLDivElement | null>(null);
  const sep1Ref = useRef(null);
  const sep2Ref = useRef(null);
  const sep3Ref = useRef(null);
  const [marqueePinned, setMarqueePinned] = useState(false);

  const workInView = useInView(workRef, { once: true, amount: 0.2 });
  const aboutInView = useInView(aboutRef, { once: true, margin: "-10%" });
  const contactInView = useInView(contactRef, { once: true, margin: "-10%" });
  const sep1InView = useInView(sep1Ref, { once: true, margin: "-5%" });
  const sep2InView = useInView(sep2Ref, { once: true, margin: "-5%" });
  const sep3InView = useInView(sep3Ref, { once: true, margin: "-5%" });

  useLayoutEffect(() => {
    const el = marqueeBandRef.current;
    if (!el) return;
    const sync = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) {
        document.documentElement.style.setProperty("--contact-marquee-h", `${h}px`);
      }
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
      document.documentElement.style.removeProperty("--contact-marquee-h");
    };
  }, [heroReduced, language]);

  /**
   * After projects: marquee sits in normal flow. Once it reaches the bottom of
   * the viewport, pin it fixed there for the rest of the page downward.
   */
  useEffect(() => {
    const anchor = marqueeAnchorRef.current;
    if (!anchor) return;

    const update = () => {
      const bandH =
        marqueeBandRef.current?.offsetHeight ||
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--contact-marquee-h",
          ),
        ) ||
        0;
      // Pin when the in-flow slot has scrolled up to (or past) the viewport bottom.
      setMarqueePinned(
        anchor.getBoundingClientRect().top <= window.innerHeight - bandH,
      );
    };

    update();
    document.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);

    const io = new IntersectionObserver(update, { threshold: [0, 1] });
    io.observe(anchor);

    let offLenis: (() => void) | undefined;
    const attachLenis = () => {
      const lenis = getLandingLenis();
      if (!lenis || offLenis) return true;
      lenis.on("scroll", update);
      offLenis = () => lenis.off("scroll", update);
      return true;
    };
    attachLenis();
    const lenisPoll = window.setInterval(() => {
      if (attachLenis()) window.clearInterval(lenisPoll);
    }, 150);
    const lenisPollStop = window.setTimeout(() => window.clearInterval(lenisPoll), 4000);

    return () => {
      document.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
      io.disconnect();
      offLenis?.();
      window.clearInterval(lenisPoll);
      window.clearTimeout(lenisPollStop);
    };
  }, []);

  /**
   * Work section parallax — optimized for all devices. Uses reduced travel
   * on mobile (-50%) for better performance. Forces GPU acceleration via
   * translate3d. Scroll-locked: no spring, no ease — smoothing comes from Lenis.
   */
  const { scrollYProgress: workProgress } = useScroll({
    target: workRef,
    offset: ["start end", "end end"],
  });
  const parallaxTravel = isMobile ? MOBILE_PARALLAX_TRAVEL : FOOTER_PARALLAX_TRAVEL;
  const workParallaxY = useTransform(
    workProgress,
    [0, 1],
    [parallaxTravel, "0%"],
  );
  // Convert to translate3d for GPU acceleration
  const workTransform = useTransform(
    workParallaxY,
    (y) => `translate3d(0, ${y}, 0)`
  );

  /**
   * About section parallax — optimized for all devices. Uses reduced travel
   * on mobile (-50%) for better performance. Forces GPU acceleration via
   * translate3d. Scroll-locked: no spring, no ease — smoothing comes from Lenis.
   */
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end end"],
  });
  const aboutParallaxY = useTransform(
    aboutProgress,
    [0, 1],
    [parallaxTravel, "0%"],
  );
  // Convert to translate3d for GPU acceleration
  const aboutTransform = useTransform(
    aboutParallaxY,
    (y) => `translate3d(0, ${y}, 0)`
  );

  /**
   * Footer reveal — optimized for all devices. Uses reduced travel
   * on mobile (-50%) for better performance. Forces GPU acceleration via
   * translate3d. Scroll-locked: no spring, no ease — smoothing comes from Lenis.
   */
  const { scrollYProgress: footerProgress } = useScroll({
    target: contactRef,
    offset: ["start end", "end end"],
  });
  const footerParallaxY = useTransform(
    footerProgress,
    [0, 1],
    [parallaxTravel, "0%"],
  );
  // Convert to translate3d for GPU acceleration
  const footerTransform = useTransform(
    footerParallaxY,
    (y) => `translate3d(0, ${y}, 0)`
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("ivannevares9@gmail.com");
      setToastMessage(t("contact.mailCopied"));
    } catch {
      setToastMessage(t("contact.mailCopyFailed"));
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const isEn = language === "en";

  return (
    <div className="min-h-screen bg-background lg:cursor-none relative">
      <PageReveal />
      <ScrollProgress />
      <CustomCursor />

      <section className="hero-band relative isolate flex flex-col overflow-hidden px-layout">
        {showGraphicDesktopHero ? (
          heavyVisualsReady ? (
            <GraphicDesktopHero onReady={notifyHeroVisualReady} />
          ) : (
            <GraphicHeroFallback />
          )
        ) : heavyVisualsReady && !heroReduced ? (
          <HeroHalftoneP5
            className="pointer-events-none z-0"
            onReady={notifyHeroVisualReady}
          />
        ) : (
          <HeroHalftoneFallback />
        )}
        {!showGraphicDesktopHero && (
          <div className="relative z-30">
            <h1 className="hero-title-stack font-helveticaNowDisplayBold text-name-hero tracking-[-0.02em]">
              <SplashClipReveal
                live={heroLive}
                index={heroRevealIndex(splashNavItemCount, 0)}
                reduced={heroReduced}
              >
                <span className="hero-name glyph-center optical-edge-start bg-foreground pl-[0.08em] pr-[0.02em] py-[0.12em] text-background">
                  Ivan Nevares
                </span>
              </SplashClipReveal>
              <SplashClipReveal
                live={heroLive}
                index={heroRevealIndex(splashNavItemCount, 1)}
                reduced={heroReduced}
              >
                <span className="text-hero-subtitle glyph-center bg-foreground pl-[0.08em] pr-[0.02em] py-[0.12em] text-background font-helveticaNowTextRegular tracking-normal">
                  {t("hero.subtitle")}
                </span>
              </SplashClipReveal>
            </h1>
          </div>
        )}
      </section>

      <div ref={sep1Ref}>
        <AnimatedLine inView={sep1InView} />
      </div>

      {v2Mode === "web" ? (
        <section id="work" ref={workRef} className="relative overflow-hidden">
          <motion.div
            style={heroReduced ? undefined : { transform: workTransform }}
            className="px-layout py-36 lg:py-28"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={workInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
              className={cn(
                editorialNavType,
                "glyph-center mb-6 inline-block bg-foreground pl-[0.08em] pr-[0.02em] py-[0.15em] text-background",
              )}
            >
              {t("work.title")}
            </motion.p>

            <div>
              {PROJECT_ROWS.map(
                ({ key, metricEn, metricEs }, i) => {
                  const project = getProjectBySlug(key);
                  if (!project) return null;
                  return (
                    <div key={key}>
                      {i > 0 ? (
                        <AnimatedLine
                          inView={workInView}
                          delay={(i - 1) * WORK_LINE_STAGGER}
                          duration={WORK_LINE_DURATION}
                        />
                      ) : null}
                      <ProjectRow
                        slug={key}
                        index={i + 1}
                        name={project.name}
                        category={t(`work.${key}.title` as Parameters<typeof t>[0])}
                        metric={isEn ? metricEn : metricEs}
                        year={project.year}
                        delay={i * 0.06}
                        inView={workInView}
                      />
                    </div>
                  );
                },
              )}
            </div>
          </motion.div>
        </section>
      ) : null}

      <div ref={sep2Ref}>
        <AnimatedLine inView={sep2InView} />
      </div>

      {/*
        In-flow after projects. When this slot hits the viewport bottom, the band
        switches to position:fixed and stays pinned for the rest of the page.
      */}
      <div ref={marqueeAnchorRef}>
        <div
          ref={marqueeBandRef}
          className={cn(
            "bg-[#DFFF4D] text-neutral-950",
            marqueePinned && "contact-cta-marquee-fixed",
          )}
        >
          {heroReduced ? (
            <p className="px-4 py-2 text-center font-helveticaNowTextRegular text-type-micro normal-case leading-none tracking-[-0.02em]">
              {t("contact.marquee")}
            </p>
          ) : (
            <ContactFooterMarquee text={t("contact.marquee")} />
          )}
        </div>
        {marqueePinned ? (
          <div
            className="pointer-events-none"
            style={{ height: "var(--contact-marquee-h)" }}
            aria-hidden
          />
        ) : null}
      </div>

      <section
        id="about"
        ref={aboutRef}
        className="relative overflow-hidden bg-background"
      >
        <motion.div
          style={heroReduced ? undefined : { transform: aboutTransform }}
          className="px-layout py-20 grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-12"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: EASE_OUT_EXPO }}
            className={cn(
              editorialNavType,
              "glyph-center lg:col-span-2 self-start inline-block w-fit bg-foreground pl-[0.08em] pr-[0.02em] py-[0.15em] text-background",
            )}
          >
            {t("about.title")}
          </motion.p>

          <motion.p
            className="lg:col-span-4 text-type-body font-helveticaNowTextRegular text-muted-foreground leading-relaxed"
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
            </a>
            {t("about.p2")}
            <br className="lg:hidden" />{" "}
            {t("about.freelance")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.24, ease: EASE_OUT_EXPO }}
            className="lg:col-span-3 lg:col-start-10"
          >
            {aboutInView ? (
              <Suspense
                fallback={
                  <div className="w-full aspect-square bg-muted/50 animate-pulse" />
                }
              >
                <GeometricFlowCard />
              </Suspense>
            ) : (
              <div className="w-full aspect-square bg-muted/50" aria-hidden />
            )}
          </motion.div>
        </motion.div>
      </section>

      <div ref={sep3Ref}>
        <AnimatedLine inView={sep3InView} />
      </div>

      <footer
        id="contact"
        ref={contactRef}
        className="relative flex min-h-[calc(100dvh-var(--nav-height))] flex-col overflow-hidden bg-background pb-[var(--contact-marquee-h)]"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.17] [background-image:radial-gradient(circle_at_center,rgb(128_128_128/0.35)_1px,transparent_1px)] [background-size:13px_13px] dark:opacity-[0.12] dark:[background-image:radial-gradient(circle_at_center,rgb(255_255_255/0.12)_1px,transparent_1px)]"
          aria-hidden
        />

        <motion.div
          style={heroReduced ? undefined : { transform: footerTransform }}
          className="relative z-[1] flex flex-1 flex-col"
        >
          <div className="relative flex flex-1 flex-col justify-between gap-12 px-layout pt-[var(--space-16)] pb-[var(--space-12)] lg:gap-16 lg:pt-[var(--space-24)] lg:pb-[var(--space-16)]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={
                contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
              }
              transition={{ duration: 1, delay: 0.08, ease: EASE_OUT_EXPO }}
              className="flex w-full flex-wrap items-center gap-x-5 gap-y-3"
            >
              <div className={contactKickerType}>
                <span className="block">
                  <span className="block lg:inline">
                    {t("contact.kickerLine1a")}
                  </span>
                  <span
                    className="contact-kicker__sep hidden lg:inline"
                    aria-hidden
                  >
                    ·
                  </span>
                  <span className="block lg:inline">
                    {t("contact.kickerLine1b")}
                  </span>
                </span>
                <span className="block">{t("contact.kickerLine2")}</span>
              </div>
              <span
                className="hidden h-px min-w-[3rem] flex-1 bg-foreground/25 lg:block"
                aria-hidden
              />
              <p
                className="basis-full shrink-0 font-helveticaNowDisplayBold normal-case tracking-[-0.02em] text-type-micro tabular-nums text-muted-foreground lg:optical-edge-end lg:ml-auto lg:basis-auto"
              >
                {t("contact.stamp")}
              </p>
            </motion.div>

            <div className="mt-auto flex flex-col gap-10 lg:gap-6">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={contactInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.32, ease: EASE_OUT_EXPO }}
                className={cn(
                  editorialNavType,
                  editorialTypeBox,
                  "inline-block w-fit bg-foreground text-background",
                )}
              >
                {t("contact.elsewhere")}
              </motion.p>

              {/* Mobile: socials 2×2, then CTAs below with clear separation. */}
              <div className="flex flex-col gap-10 lg:hidden">
                <nav
                  aria-label={t("contact.socialNav")}
                  className="grid grid-cols-2 gap-2"
                >
                  {contactSocials.map(({ href, label }, i) => (
                    <motion.a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 16 }}
                      animate={contactInView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 1,
                        delay: 0.32 + i * 0.04,
                        ease: EASE_OUT_EXPO,
                      }}
                      className={editorialNavPrimary(
                        cn(editorialRail, "glyph-center group justify-between"),
                        "type",
                      )}
                    >
                      {label}
                      <ArrowRight
                        className="size-4 shrink-0 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                        aria-hidden
                      />
                    </motion.a>
                  ))}
                </nav>

                <div className="grid grid-cols-1 gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 1.05, delay: 0.4, ease: EASE_OUT_EXPO }}
                    className="min-w-0"
                  >
                    <button
                      type="button"
                      onClick={copyEmail}
                      className={editorialNavMuted(editorialRail, "comfortable")}
                      title="ivannevares9@gmail.com"
                    >
                      <span className="truncate">ivannevares9@gmail.com</span>
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 1.05, delay: 0.44, ease: EASE_OUT_EXPO }}
                    className="min-w-0"
                  >
                    <button
                      type="button"
                      onClick={() => setIsContactOpen(true)}
                      className={editorialNavPrimary(editorialRail, "comfortable")}
                    >
                      {isEn ? "Send a message" : "Enviar mensaje"}
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Desktop: original 12-col row — socials left (1 col each), mail + message stacked right. */}
              <div className="hidden grid-cols-12 items-end gap-6 lg:grid">
                <nav
                  aria-label={t("contact.socialNav")}
                  className="col-span-4 grid grid-cols-4 gap-6"
                >
                  {contactSocials.map(({ href, label }, i) => (
                    <motion.a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 16 }}
                      animate={contactInView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 1,
                        delay: 0.32 + i * 0.04,
                        ease: EASE_OUT_EXPO,
                      }}
                      className={editorialNavPrimary(
                        cn(editorialRail, "glyph-center group justify-between"),
                        "type",
                      )}
                    >
                      {label}
                      <ArrowRight
                        className="size-3.5 shrink-0 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                        aria-hidden
                      />
                    </motion.a>
                  ))}
                </nav>

                <div className="col-span-5 col-start-8 flex min-w-0 flex-col gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 1.05, delay: 0.2, ease: EASE_OUT_EXPO }}
                    className="min-w-0"
                  >
                    <button
                      type="button"
                      onClick={copyEmail}
                      className={editorialNavMuted(editorialRail, "comfortable")}
                      title="ivannevares9@gmail.com"
                    >
                      <span className="truncate">ivannevares9@gmail.com</span>
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 1.05, delay: 0.24, ease: EASE_OUT_EXPO }}
                    className="min-w-0"
                  >
                    <button
                      type="button"
                      onClick={() => setIsContactOpen(true)}
                      className={editorialNavPrimary(editorialRail, "comfortable")}
                    >
                      {isEn ? "Send a message" : "Enviar mensaje"}
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </footer>

      {contactModalLoaded ? (
        <ContactFormModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      ) : null}
      <Toast
        message={toastMessage || t("contact.mailCopied")}
        isVisible={showToast}
      />
    </div>
  );
}
