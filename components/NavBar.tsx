"use client";

import { useState, useEffect, useLayoutEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  motion,
  useReducedMotion,
} from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useGrid } from '@/lib/grid/GridContext';
import { useSplashHandoff } from '@/lib/splash/SplashHandoffContext';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/custom-sheet';
import { HamburgerMenu } from './ui/hamburger-menu';
import { cn } from '@/lib/utils';
import { editorialNavType } from '@/lib/editorial-cta';
import { EASE_CINEMATIC, EASE_OUT_EXPO, MOBILE_MENU_CONTENT_DELAY, MOBILE_MENU_NAME_COLOR_DELAY, MOBILE_MENU_NAME_COLOR_DURATION, MOBILE_MENU_PANEL_CLOSE_DURATION } from '@/lib/motion/easing';
import {
  ClipRevealItem,
  clipRevealShellVariants,
  mobileMenuContainerVariants,
  mobileMenuItemVariants,
  MOBILE_MENU_ITEM_STAGGER,
  SplashClipReveal,
} from '@/lib/motion/clip-reveal';

/** CV link temporarily hidden from navbar */
const NAV_SHOW_CV = false;

const NAV_LINE_DURATION = MOBILE_MENU_PANEL_CLOSE_DURATION;
/** Case study: nav slides down over this scroll distance (matches --nav-height). */
const CASE_STUDY_NAV_REVEAL_PX = 64;

function readPageScrollY() {
  if (typeof window === "undefined") return 0;
  const scrollingElement = document.scrollingElement;
  return (
    document.body.scrollTop ||
    scrollingElement?.scrollTop ||
    window.scrollY ||
    document.documentElement.scrollTop ||
    0
  );
}

function scrollPageToTop() {
  document.body.scrollTop = 0;
  if (document.scrollingElement) {
    document.scrollingElement.scrollTop = 0;
  }
  window.scrollTo(0, 0);
}

const NAV_NAME_COLORS = {
  dark: { closed: "hsl(0 0% 94%)", open: "hsl(0 0% 0%)" },
  light: { closed: "hsl(0 0% 12%)", open: "hsl(0 0% 100%)" },
} as const;

function NavNameLink({
  href,
  isMenuOpen,
  theme,
}: {
  href: string;
  isMenuOpen: boolean;
  theme: "light" | "dark";
}) {
  const colors = NAV_NAME_COLORS[theme];
  const target = isMenuOpen ? colors.open : colors.closed;

  return (
    <a
      href={href}
      className="optical-edge-start text-name-nav leading-none tracking-[-0.02em] font-helveticaNowDisplayBold truncate"
      style={{ color: target }}
    >
      Ivan Nevares
    </a>
  );
}

/** Shared shell — divider lives in `.nav-shell` CSS, not Tailwind border classes */
const NAV_SHELL_BASE = "fixed top-0 left-0 right-0 z-[100] nav-shell";
const NAV_SHELL_CLASS = cn(NAV_SHELL_BASE, "bg-nav/80 backdrop-blur-sm");
const MOBILE_MENU_INVERTED = "mobile-menu-inverted text-foreground";

const navLabel = cn(
  editorialNavType,
  "leading-none transition-colors duration-300 whitespace-nowrap",
);

const navInteractiveFocus =
  "outline-none focus:outline-none [-webkit-tap-highlight-color:transparent]";

function navLinkClass(active: boolean, isMobile = false) {
  return cn(
    navLabel,
    navInteractiveFocus,
    isMobile && "flex w-full min-h-[44px] items-center py-3",
    active
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground",
  );
}

function NavSeparator({ className }: { className?: string }) {
  return (
    <span
      className={cn("mx-2.5 lg:mx-3 text-nav-link text-muted-foreground/35 select-none", className)}
      aria-hidden
    >
      ·
    </span>
  );
}

function LanguageToggle({ isMobile = false }: { isMobile?: boolean }) {
  const { language, setLanguage } = useLanguage();

  const shellClass = cn(
    "inline-flex items-baseline",
    isMobile && "flex w-full min-h-[44px] items-center py-3",
  );

  const activeClass = cn(navLabel, "text-nav-link text-foreground");
  const inactiveClass = cn(
    navLabel,
    navInteractiveFocus,
    "text-nav-link text-muted-foreground hover:text-foreground transition-colors duration-300",
    isMobile && "min-h-[44px] inline-flex items-center",
  );

  return (
    <span className={shellClass} role="group" aria-label="Language">
      {language === "en" ? (
        <span aria-current="true" className={activeClass}>
          En
        </span>
      ) : (
        <button type="button" onClick={() => setLanguage("en")} className={inactiveClass}>
          En
        </button>
      )}
      <span className="mx-1.5 text-nav-link text-muted-foreground/35 select-none" aria-hidden>
        ·
      </span>
      {language === "es" ? (
        <span aria-current="true" className={activeClass}>
          Es
        </span>
      ) : (
        <button type="button" onClick={() => setLanguage("es")} className={inactiveClass}>
          Es
        </button>
      )}
    </span>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const isCaseStudyRoute = pathname.startsWith("/work/");

  return (
    <Suspense fallback={<NavBarFallback hidden={isCaseStudyRoute} />}>
      <NavBarInner />
    </Suspense>
  );
}

function NavBarFallback({ hidden = false }: { hidden?: boolean }) {
  return (
    <header
      className={cn(
        NAV_SHELL_CLASS,
        hidden && "-translate-y-full pointer-events-none",
      )}
      aria-hidden
    />
  );
}

function NavBarInner() {
  const { language, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { isGridVisible, toggleGrid } = useGrid();
  const { handoff: splashHandoff } = useSplashHandoff();
  const reducedMotion = useReducedMotion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [caseStudyScrollY, setCaseStudyScrollY] = useState(0);
  useEffect(() => setMounted(true), []);

  const isCaseStudy = pathname.startsWith("/work/");
  const caseStudyNavHidden =
    isCaseStudy && caseStudyScrollY <= 0 && !isMobileMenuOpen;

  useLayoutEffect(() => {
    if (!isCaseStudy) {
      setCaseStudyScrollY(0);
      return;
    }
    scrollPageToTop();
    setCaseStudyScrollY(0);
  }, [isCaseStudy, pathname]);

  useEffect(() => {
    if (!isCaseStudy) {
      setCaseStudyScrollY(0);
      return;
    }

    let rafId = 0;

    const update = () => {
      setCaseStudyScrollY(readPageScrollY());
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    document.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [isCaseStudy, pathname]);

  const caseStudyRevealProgress =
    caseStudyScrollY <= 0
      ? 0
      : Math.min(caseStudyScrollY / CASE_STUDY_NAV_REVEAL_PX, 1);

  const caseStudyNavY = isMobileMenuOpen
    ? "0%"
    : caseStudyNavHidden
      ? "-100%"
      : reducedMotion
        ? "0%"
        : `${(1 - caseStudyRevealProgress) * -100}%`;

  const caseStudyNavInteractive = caseStudyScrollY > 0;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname, searchParams]);

  const waitsForSplash = pathname === '/';

  /** Avoid hydration mismatch: pathname from usePathname can differ SSR vs first client paint for shared layout. */
  const isV2 =
    mounted &&
    (pathname === '/' ||
      pathname === '/v2' ||
      pathname.startsWith('/v2/'));
  const v2Graphic = mounted && searchParams.get('mode') === 'graphic';
  const portfolioHome = '/';
  const homeHref = portfolioHome;
  const v2WebHref = portfolioHome;
  const v2GraphicHref = `${portfolioHome}?mode=graphic`;
  const v2WebActive =
    mounted && (pathname === '/' || pathname === '/v2') && !v2Graphic;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const lineVariants = {
    hidden: { scaleX: reducedMotion ? 1 : 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: reducedMotion ? 0 : NAV_LINE_DURATION,
        ease: EASE_OUT_EXPO,
      },
    },
  };

  const itemShellVariants = clipRevealShellVariants;
  const mobileItemRevealVariants = mobileMenuItemVariants(!!reducedMotion);
  const mobileContainerVariants = mobileMenuContainerVariants(
    reducedMotion ? 0 : MOBILE_MENU_CONTENT_DELAY,
  );

  const splashRevealActive = waitsForSplash;
  const splashRevealLive = !waitsForSplash || splashHandoff;

  const NavItems = ({
    isMobile = false,
    onMobileClose,
    revealIndexOffset = 1,
  }: {
    isMobile?: boolean;
    onMobileClose?: () => void;
    revealIndexOffset?: number;
  }) => {
    type NavEntry = { key: string; node: React.ReactNode; active?: boolean };

    const entries: NavEntry[] = [];

    if (isV2) {
      entries.push({
        key: 'web',
        active: v2WebActive,
        node: (
          <Link
            href={v2WebHref}
            onClick={() => onMobileClose?.()}
            className={cn(
              navLinkClass(v2WebActive, isMobile),
              isMobile && "text-xl min-h-[52px]",
            )}
          >
            {t('work.filterWeb')}
          </Link>
        ),
      });
      entries.push({
        key: 'graphic',
        active: v2Graphic,
        node: (
          <Link
            href={v2GraphicHref}
            onClick={() => onMobileClose?.()}
            className={cn(
              navLinkClass(v2Graphic, isMobile),
              isMobile && "text-xl min-h-[52px]",
            )}
          >
            {t('work.filterGraphic')}
          </Link>
        ),
      });
    }

    const utilityItems = [
      ...(NAV_SHOW_CV
        ? [
            {
              id: 'cv' as const,
              element: isMobile ? (
                <a
                  href={`/CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
                  download={`CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
                  className={cn(navLinkClass(false, true), "text-foreground hover:opacity-90")}
                >
                  {t('nav.cv')}
                </a>
              ) : (
                <div className="relative group">
                  <button
                    type="button"
                    className={navLinkClass(false, false)}
                  >
                    {t('nav.cv')}
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-36 border border-border bg-background shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 dark:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.55)]">
                    <div className="py-1">
                      <a
                        href={`/CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
                        download={`CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
                        className="block px-3 py-2 text-[9px] font-helveticaNowTextRegular normal-case text-foreground hover:bg-accent transition-colors"
                      >
                        {t('nav.cvDropdown.download')}
                      </a>
                      <a
                        href={`/CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 text-[9px] font-helveticaNowTextRegular normal-case text-foreground hover:bg-accent transition-colors"
                      >
                        {t('nav.cvDropdown.view')}
                      </a>
                    </div>
                  </div>
                </div>
              ),
            },
          ]
        : []),
      {
        id: 'theme',
        element: (
          <button
            onClick={toggleTheme}
            className={navLinkClass(false, isMobile)}
          >
            {t(`nav.theme.${theme}`)}
          </button>
        ),
      },
      {
        id: 'language',
        element: <LanguageToggle isMobile={isMobile} />,
      },
      {
        id: 'grid',
        element: (
          <button
            onClick={toggleGrid}
            className={navLinkClass(isGridVisible, isMobile)}
          >
            Grid
          </button>
        ),
      },
    ];

    utilityItems.forEach((item) => {
      entries.push({ key: item.id, node: item.element, active: item.id === 'grid' && isGridVisible });
    });

    const utilityStart = isV2 ? 2 : 0;

    if (isMobile) {
      const mobileChildren: React.ReactNode[] = [
        <motion.div
          key="menu-line-top"
          className="h-px w-full origin-left bg-border"
          variants={lineVariants}
          aria-hidden
        />,
      ];

      entries.forEach((entry, i) => {
        if (i === utilityStart && utilityStart > 0) {
          mobileChildren.push(
            <motion.div
              key="menu-line-divider"
              className="my-4 h-px w-full origin-left bg-border"
              variants={lineVariants}
              aria-hidden
            />,
          );
        }
        mobileChildren.push(
          <ClipRevealItem
            key={entry.key}
            role="listitem"
            shellVariants={itemShellVariants}
            revealVariants={mobileItemRevealVariants}
          >
            {entry.node}
          </ClipRevealItem>,
        );
      });

      return (
        <motion.div
          role="list"
          className="flex flex-col gap-1 pt-8 optical-edge-start"
          variants={mobileContainerVariants}
          initial="hidden"
          animate={isMobileMenuOpen ? "visible" : "hidden"}
        >
          {mobileChildren}
        </motion.div>
      );
    }

    return (
      <ul className="flex flex-row items-baseline">
        {entries.map((entry, i) => (
          <li
            key={entry.key}
            className={cn("flex items-center", i === entries.length - 1 && "optical-edge-end")}
          >
            {i > 0 ? <NavSeparator /> : null}
            <SplashClipReveal
              live={splashRevealLive}
              index={revealIndexOffset + i}
              reduced={reducedMotion}
              active={splashRevealActive}
            >
              {entry.node}
            </SplashClipReveal>
          </li>
        ))}
      </ul>
    );
  };

  const mobileEntryCount = (isV2 ? 2 : 0) + 3 + (NAV_SHOW_CV ? 1 : 0);
  const mobileFooterStartDelay = reducedMotion
    ? 0
    : MOBILE_MENU_CONTENT_DELAY +
      (1 + (isV2 ? 1 : 0) + mobileEntryCount) * MOBILE_MENU_ITEM_STAGGER;

  const footerContainerVariants = mobileMenuContainerVariants(mobileFooterStartDelay);

  return (
    <>
      <motion.header
        style={isCaseStudy ? { y: caseStudyNavY } : undefined}
        className={cn(
          NAV_SHELL_BASE,
          caseStudyNavHidden && "-translate-y-full",
          isCaseStudy &&
            !caseStudyNavInteractive &&
            !isMobileMenuOpen &&
            "pointer-events-none",
          isCaseStudy
            ? "transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]"
            : cn(
                "transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]",
                "max-lg:transition-[background-color,box-shadow,backdrop-filter,transform] max-lg:ease-[cubic-bezier(0.16,1,0.3,1)]",
              ),
          isMobileMenuOpen
            ? cn(
                "z-[110] bg-background pointer-events-auto max-lg:duration-[var(--mobile-menu-panel-open-duration)]",
                MOBILE_MENU_INVERTED,
              )
            : cn(
                "bg-nav/80 backdrop-blur-sm max-lg:duration-[var(--mobile-menu-panel-close-duration)]",
                isCaseStudy &&
                  !caseStudyNavInteractive &&
                  !isMobileMenuOpen &&
                  "bg-transparent backdrop-blur-none [box-shadow:none]",
              ),
        )}
      >
        <div className="nav-bar-inner">
          <SplashClipReveal
            live={splashRevealLive}
            index={0}
            reduced={reducedMotion}
            active={splashRevealActive}
            className="col-span-6 lg:col-span-3"
          >
            <NavNameLink
              href={homeHref}
              isMenuOpen={isMobileMenuOpen}
              theme={theme}
            />
          </SplashClipReveal>

          <nav
            className="col-span-6 col-start-7 lg:col-span-3 lg:col-start-10 flex justify-end min-w-0"
            aria-label={t('nav.mobileMenuTitle')}
          >
            <div className="hidden lg:block">
              <NavItems revealIndexOffset={1} />
            </div>

            <div className="lg:hidden flex items-center gap-3">
              <SplashClipReveal
                live={splashRevealLive}
                index={1}
                reduced={reducedMotion}
                active={splashRevealActive}
              >
                <span className={cn(navLabel, "text-nav-link text-muted-foreground")}>
                  Menu
                </span>
              </SplashClipReveal>
              <SplashClipReveal
                live={splashRevealLive}
                index={2}
                reduced={reducedMotion}
                active={splashRevealActive}
              >
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((open) => !open)}
                    className={cn(
                      "flex items-center justify-center size-11 -mr-2",
                      navInteractiveFocus,
                    )}
                    aria-label={t('nav.mobileMenuTitle')}
                    aria-expanded={isMobileMenuOpen}
                  >
                    <HamburgerMenu isOpen={isMobileMenuOpen} />
                  </button>
                  <SheetContent
                    motion="clip"
                    className={cn(
                      MOBILE_MENU_INVERTED,
                      "inset-x-0 top-[var(--nav-height)] h-[calc(100dvh-var(--nav-height))] w-full sm:max-w-none bg-background p-0 z-[90]",
                    )}
                    overlayClassName={cn(
                      MOBILE_MENU_INVERTED,
                      "inset-x-0 top-[var(--nav-height)] bottom-0 bg-background",
                    )}
                    side="top"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <SheetTitle className="sr-only">{t('nav.mobileMenuTitle')}</SheetTitle>
                    <div className="flex h-full flex-col">
                      <div className="grid-container flex-1 pt-10 pb-6">
                        <div className="col-span-12">
                          <NavItems
                            isMobile={true}
                            onMobileClose={() => setIsMobileMenuOpen(false)}
                          />
                        </div>
                      </div>

                      <motion.div
                        className="grid-container relative py-6 text-[10px] font-helveticaNowTextRegular normal-case tracking-normal text-muted-foreground"
                        variants={footerContainerVariants}
                        initial="hidden"
                        animate={isMobileMenuOpen ? "visible" : "hidden"}
                      >
                        <motion.div
                          className="absolute inset-x-0 top-0 h-px origin-left bg-border"
                          variants={lineVariants}
                          aria-hidden
                        />
                        <ClipRevealItem
                          className="col-span-6 optical-edge-start"
                          shellVariants={itemShellVariants}
                          revealVariants={mobileItemRevealVariants}
                        >
                          <span>Buenos Aires · AR</span>
                        </ClipRevealItem>
                        <ClipRevealItem
                          className="col-span-6 optical-edge-end"
                          shellVariants={itemShellVariants}
                          revealVariants={mobileItemRevealVariants}
                        >
                          <span className="block text-right tabular-nums">
                            {t('contact.stamp')}
                          </span>
                        </ClipRevealItem>
                      </motion.div>
                    </div>
                  </SheetContent>
                </Sheet>
              </SplashClipReveal>
            </div>
          </nav>
        </div>
      </motion.header>
    </>
  );
}
