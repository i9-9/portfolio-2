"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useGrid } from '@/lib/grid/GridContext';
import { useSplashHandoff } from '@/lib/splash/SplashHandoffContext';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/custom-sheet';
import { HamburgerMenu } from './ui/hamburger-menu';
import { cn } from '@/lib/utils';
import { editorialNavType } from '@/lib/editorial-cta';

/** CV link temporarily hidden from navbar */
const NAV_SHOW_CV = false;

const NAV_ENTER_EASE = [0.22, 1, 0.36, 1] as const;

/** Shared shell — divider lives in `.nav-shell` CSS, not Tailwind border classes */
const NAV_SHELL_BASE = "fixed top-0 left-0 right-0 z-[100] nav-shell";
const NAV_SHELL_CLASS = cn(NAV_SHELL_BASE, "bg-nav/80 backdrop-blur-sm");

const navLabel = cn(
  editorialNavType,
  "leading-none transition-colors duration-300 whitespace-nowrap",
);

function navLinkClass(active: boolean, isMobile = false) {
  return cn(
    navLabel,
    isMobile && "py-2 min-h-[44px] px-2 flex items-center",
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
    isMobile && "items-center py-2 min-h-[44px] px-2",
  );

  const activeClass = cn(navLabel, "text-nav-link text-foreground");
  const inactiveClass = cn(
    navLabel,
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
  return (
    <Suspense fallback={<NavBarFallback />}>
      <NavBarInner />
    </Suspense>
  );
}

function NavBarFallback() {
  return (
    <header className={NAV_SHELL_CLASS} aria-hidden />
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
  useEffect(() => setMounted(true), []);

  const waitsForSplash = pathname === '/';
  const navLive = !waitsForSplash || splashHandoff || !!reducedMotion;

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10, x: -10 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const NavItems = ({ isMobile = false }: { isMobile?: boolean }) => {
    type NavEntry = { key: string; node: React.ReactNode; active?: boolean };

    const entries: NavEntry[] = [];

    if (isV2) {
      entries.push({
        key: 'web',
        active: v2WebActive,
        node: (
          <Link
            href={v2WebHref}
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
      return (
        <motion.ul
          className="flex flex-col gap-1 border-t border-border pt-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {entries.map((entry, i) => (
            <motion.li key={entry.key} variants={itemVariants}>
              {i === utilityStart && utilityStart > 0 ? (
                <div className="my-4 h-px w-full bg-border" aria-hidden />
              ) : null}
              {entry.node}
            </motion.li>
          ))}
        </motion.ul>
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
            {entry.node}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <motion.header
        className={cn(
          NAV_SHELL_BASE,
          isMobileMenuOpen ? "bg-background" : "bg-nav/80 backdrop-blur-sm",
        )}
        initial={false}
        animate={navLive ? { y: 0 } : { y: "-100%" }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.72, delay: navLive ? 0.1 : 0, ease: NAV_ENTER_EASE }
        }
      >
        <div className="nav-bar-inner">
          <div className="col-span-6 lg:col-span-3 min-w-0">
            <a
              href={homeHref}
              className="optical-edge-start text-name-nav leading-none tracking-[-0.02em] font-helveticaNowDisplayBold text-foreground hover:text-foreground/80 transition-colors duration-300 truncate"
            >
              Ivan Nevares
            </a>
          </div>

          <nav
            className="col-span-6 col-start-7 lg:col-span-3 lg:col-start-10 flex justify-end min-w-0"
            aria-label={t('nav.mobileMenuTitle')}
          >
            <div className="hidden lg:block">
              <NavItems />
            </div>

            <div className="lg:hidden flex items-center gap-3">
              <span className={cn(navLabel, "text-nav-link text-muted-foreground")}>
                Menu
              </span>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className="flex items-center justify-center size-11 -mr-2"
                    aria-label={t('nav.mobileMenuTitle')}
                  >
                    <HamburgerMenu isOpen={isMobileMenuOpen} />
                  </button>
                </SheetTrigger>
                <SheetContent
                  className="inset-x-0 top-0 h-[100dvh] w-full sm:max-w-none border-0 bg-background p-0 pt-[var(--nav-height)] shadow-none"
                  overlayClassName="bg-background"
                  side="top"
                >
                  <SheetTitle className="sr-only">{t('nav.mobileMenuTitle')}</SheetTitle>
                  <div className="flex h-full flex-col px-4 lg:px-12">
                    <div className="grid grid-cols-12 gap-4 lg:gap-6 pt-10 pb-6">
                      <div className="col-span-12 lg:col-span-6">
                        <NavItems isMobile={true} />
                      </div>
                    </div>

                    <div className="mt-auto border-t border-border px-0 py-6">
                      <div className="grid grid-cols-12 gap-4 lg:gap-6 text-[10px] font-helveticaNowTextRegular normal-case tracking-normal text-muted-foreground">
                        <div className="col-span-6">Buenos Aires · AR</div>
                        <div className="col-span-6 text-right tabular-nums">{t('contact.stamp')}</div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </motion.header>
    </>
  );
}
