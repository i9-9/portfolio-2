"use client";

import { useState, lazy, Suspense, useRef, useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { getProjectBySlug } from "@/app/data/projects";
import BottomSpacer from "@/components/BottomSpacer";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  editorialFooterMuted,
  editorialFooterPrimary,
  editorialNavType,
} from "@/lib/editorial-cta";
import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useSplashHandoff } from "@/lib/splash/SplashHandoffContext";
import {
  landingHashId,
  scrollToLandingHashReliable,
} from "@/lib/scroll/landingHash";
import { getLandingLenis } from "@/lib/scroll/lenisStore";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";
import {
  heroRevealIndex,
  SplashClipReveal,
  SPLASH_NAV_ITEMS_LG,
  SPLASH_NAV_ITEMS_SM,
} from "@/lib/motion/clip-reveal";
import { Mail, MessageSquare, ArrowRight } from "lucide-react";
import { PageReveal } from "@/components/splash/PageReveal";
import { ContactFooterMarquee } from "@/components/portfolio/ContactFooterMarquee";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import { AnimatedLine } from "@/components/portfolio/AnimatedLine";
import { ProjectRow } from "@/components/portfolio/ProjectRow";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { ProjectList } from "@/components/portfolio/ProjectList";
import { DisciplineFilter, type DisciplineFilterValue } from "@/components/portfolio/DisciplineFilter";
import { PROJECT_ROWS } from "@/components/portfolio/projectRows";

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

/** Bauhaus view modes — semantic correspondence with geometric forms */
export type BauhausViewMode = "flow" | "grid" | "list";

const WOHL_STUDIO_URL = "https://wohl.co/";

/** Work-list dividers — slower than nav so the L→R draw reads clearly. */
const WORK_LINE_DURATION = 2.35;
const WORK_LINE_STAGGER = 0.22;

export function PortfolioPageInner({ v2Mode = "web" }: { v2Mode?: V2ContentMode }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactModalLoaded, setContactModalLoaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [viewMode, setViewMode] = useState<BauhausViewMode>("flow");
  const [disciplineFilter, setDisciplineFilter] = useState<DisciplineFilterValue>("all");
  const { t, language } = useLanguage();

  useLayoutEffect(() => {
    if (isContactOpen) setContactModalLoaded(true);
  }, [isContactOpen]);

  const showGraphicDesktopHero = v2Mode === "graphic";
  const heroReduced = useReducedMotion();
  const { handoff: splashHandoff } = useSplashHandoff();
  const heroLive = splashHandoff || !!heroReduced;

  /** Defer p5/Three until after first paint so LCP/TBT aren't blocked by canvas libs. */
  const [heavyVisualsReady, setHeavyVisualsReady] = useState(false);
  useEffect(() => {
    if (!heroLive) return;

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
  }, [heroLive]);

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

  const workRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const sep1Ref = useRef(null);
  const sep2Ref = useRef(null);
  const sep3Ref = useRef(null);

  const workInView = useInView(workRef, { once: true, amount: 0.2 });
  const aboutInView = useInView(aboutRef, { once: true, margin: "-10%" });
  const contactInView = useInView(contactRef, { once: true, margin: "-10%" });
  const sep1InView = useInView(sep1Ref, { once: true, margin: "-5%" });
  const sep2InView = useInView(sep2Ref, { once: true, margin: "-5%" });
  const sep3InView = useInView(sep3Ref, { once: true, margin: "-5%" });

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

  const filteredProjects = PROJECT_ROWS.filter(({ key }) => {
    if (disciplineFilter === "all") return true;
    const project = getProjectBySlug(key);
    if (!project) return false;
    return project.discipline === disciplineFilter || project.discipline === "both";
  });

  return (
    <div className="min-h-screen bg-background lg:cursor-none relative">
      <PageReveal />
      <ScrollProgress />
      <CustomCursor />

      <section className="hero-band relative isolate flex flex-col overflow-hidden px-4 lg:px-6">
        {showGraphicDesktopHero ? (
          heavyVisualsReady ? (
            <GraphicDesktopHero />
          ) : (
            <GraphicHeroFallback />
          )
        ) : heavyVisualsReady && !heroReduced ? (
          <HeroHalftoneP5 className="pointer-events-none z-0" />
        ) : (
          <HeroHalftoneFallback className="pointer-events-none z-0" />
        )}
        {!showGraphicDesktopHero && (
          <>
            <div
              className={cn(
                "relative z-30",
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

            <div
              className="relative z-30 mt-auto flex justify-end gap-3"
              role="group"
              aria-label="View mode controls"
            >
              <button
                type="button"
                onClick={() => setViewMode("flow")}
                className={cn(
                  "group flex size-12 items-center justify-center border-2 transition-all duration-500 lg:size-14",
                  viewMode === "flow"
                    ? "border-[var(--bauhaus-blue)] text-[var(--bauhaus-blue)] scale-105"
                    : "border-foreground/50 text-foreground hover:scale-105 hover:border-[var(--bauhaus-blue)] hover:text-[var(--bauhaus-blue)]"
                )}
                aria-label="Flow view (circular, continuous)"
                aria-pressed={viewMode === "flow"}
              >
                <span className="block size-[40%] rounded-full bg-current transition-colors duration-500" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "group flex size-12 items-center justify-center border-2 transition-all duration-500 lg:size-14",
                  viewMode === "grid"
                    ? "border-[var(--bauhaus-red)] text-[var(--bauhaus-red)] scale-105"
                    : "border-foreground/50 text-foreground hover:scale-105 hover:border-[var(--bauhaus-red)] hover:text-[var(--bauhaus-red)]"
                )}
                aria-label="Grid view (square, structured)"
                aria-pressed={viewMode === "grid"}
              >
                <span className="block size-[40%] bg-current transition-colors duration-500" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "group flex size-12 items-center justify-center border-2 transition-all duration-500 lg:size-14",
                  viewMode === "list"
                    ? "border-[var(--bauhaus-yellow)] text-[var(--bauhaus-yellow)] scale-105"
                    : "border-foreground/50 text-foreground hover:scale-105 hover:border-[var(--bauhaus-yellow)] hover:text-[var(--bauhaus-yellow)]"
                )}
                aria-label="List view (triangular, directional)"
                aria-pressed={viewMode === "list"}
              >
                <span
                  className="block size-[40%] bg-current transition-colors duration-500"
                  style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                />
              </button>
            </div>
          </>
        )}
      </section>

      <div ref={sep1Ref}>
        <AnimatedLine inView={sep1InView} />
      </div>

      {v2Mode === "web" ? (
        <section id="work" ref={workRef} className="px-4 lg:px-6 py-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={workInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
            className={cn(editorialNavType, "mb-6 text-foreground")}
          >
            {t("work.title")}
          </motion.p>

          <DisciplineFilter
            active={disciplineFilter}
            onChange={setDisciplineFilter}
            labels={{
              all: t("work.filterAll"),
              web: t("work.filterWeb"),
              graphic: t("work.filterGraphic"),
            }}
            inView={workInView}
          />

          {viewMode === "flow" ? (
            <div>
              {filteredProjects.map(
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
          ) : viewMode === "grid" ? (
            <ProjectGrid
              projectKeys={filteredProjects.map((r) => r.key)}
              inView={workInView}
            />
          ) : (
            <ProjectList
              projectKeys={filteredProjects.map((r) => r.key)}
              categories={Object.fromEntries(
                filteredProjects.map(({ key }) => [
                  key,
                  t(`work.${key}.title` as Parameters<typeof t>[0]),
                ])
              )}
              inView={workInView}
            />
          )}
        </section>
      ) : null}

      <div ref={sep2Ref}>
        <AnimatedLine inView={sep2InView} />
      </div>

      <section
        id="about"
        ref={aboutRef}
        className="px-4 lg:px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-12"
      >
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
          {aboutInView ? (
            <Suspense
              fallback={
                <div className="w-full aspect-square bg-muted/50 rounded-lg animate-pulse" />
              }
            >
              <GeometricFlowCard />
            </Suspense>
          ) : (
            <div className="w-full aspect-square bg-muted/50 rounded-lg" aria-hidden />
          )}
        </motion.div>
      </section>

      <div ref={sep3Ref}>
        <AnimatedLine inView={sep3InView} />
      </div>

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
            <p
              className={cn(
                editorialNavType,
                "max-w-[min(100%,42rem)] text-foreground",
              )}
            >
              {t("contact.kicker")}
            </p>
            <span
              className="hidden h-px min-w-[3rem] flex-1 bg-foreground/25 sm:block"
              aria-hidden
            />
            <p
              className={cn(
                editorialNavType,
                "tabular-nums text-muted-foreground",
              )}
            >
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
            <div className="min-w-0 w-full sm:w-auto sm:max-w-full">
              <button
                type="button"
                onClick={copyEmail}
                className={editorialFooterMuted()}
                title="ivannevares9@gmail.com"
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden />
                <span className="truncate">ivannevares9@gmail.com</span>
              </button>
            </div>
            <div className="w-full sm:w-auto sm:max-w-full">
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className={editorialFooterPrimary()}
              >
                <MessageSquare className="w-4 h-4 shrink-0" aria-hidden />
                {isEn ? "Send a message" : "Enviar mensaje"}
              </button>
            </div>
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
                {
                  href: "https://www.linkedin.com/in/ivan-nevares/",
                  label: "LinkedIn",
                },
                { href: "https://www.behance.net/ivan_nevares", label: "Behance" },
                { href: "https://dribbble.com/i9i9", label: "Dribbble" },
              ] as const
            ).map(({ href, label }) => (
              <div
                key={href}
                className="col-span-6 lg:col-span-1"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center gap-1 tracking-[0.06em] transition-colors duration-300 hover:text-foreground"
                >
                  {label}
                  <ArrowRight
                    className="size-3.5 shrink-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                </a>
              </div>
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

      <BottomSpacer />

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
