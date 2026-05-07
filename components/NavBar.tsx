"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useGrid } from '@/lib/grid/GridContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/custom-sheet';
import { HamburgerMenu } from './ui/hamburger-menu';
import { cn } from '@/lib/utils';

export function NavBar() {
  return (
    <Suspense fallback={<NavBarFallback />}>
      <NavBarInner />
    </Suspense>
  );
}

function NavBarFallback() {
  return (
    <header
      className="fixed top-0 left-0 right-0 bg-nav/80 backdrop-blur-sm z-[100] min-h-[48px] lg:min-h-[40px]"
      aria-hidden
    />
  );
}

function NavBarInner() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { isGridVisible, toggleGrid } = useGrid();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /** Avoid hydration mismatch: pathname from usePathname can differ SSR vs first client paint for shared layout. */
  const isV2 =
    mounted &&
    (pathname === '/' ||
      pathname === '/v2' ||
      pathname.startsWith('/v2/'));
  const v2Graphic = mounted && searchParams.get('mode') === 'graphic';
  const portfolioHome = '/v2';
  const homeHref = portfolioHome;
  const v2WebHref = portfolioHome;
  const v2GraphicHref = `${portfolioHome}?mode=graphic`;
  const v2WebActive =
    mounted && (pathname === '/' || pathname === '/v2') && !v2Graphic;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

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
    const v2NavLinks = isV2 ? (
      <>
        <li>
          <Link
            href={v2WebHref}
            className={cn(
              'tracking-[0.2em] uppercase transition-colors whitespace-nowrap',
              isMobile
                ? 'text-xs text-foreground hover:opacity-90 py-2 min-h-[44px] px-2 flex items-center transition-opacity'
                : 'text-[9px] py-1 px-2',
              v2WebActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t('work.filterWeb')}
          </Link>
        </li>
        <li>
          <Link
            href={v2GraphicHref}
            className={cn(
              'tracking-[0.2em] uppercase transition-colors whitespace-nowrap',
              isMobile
                ? 'text-xs text-foreground hover:opacity-90 py-2 min-h-[44px] px-2 flex items-center transition-opacity'
                : 'text-[9px] py-1 px-2',
              v2Graphic ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t('work.filterGraphic')}
          </Link>
        </li>
      </>
    ) : null;

    const items = [
      {
        id: 'cv',
        element: isMobile ? (
          <a
            href={`/CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
            download={`CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
            className="text-xs tracking-[0.2em] uppercase transition-opacity whitespace-nowrap text-foreground hover:opacity-90 py-2 min-h-[44px] px-2 flex items-center"
          >
            {t('nav.cv')}
          </a>
        ) : (
          <div className="relative group">
            <button
              className="text-[9px] tracking-[0.2em] uppercase transition-colors whitespace-nowrap py-1 px-2 text-muted-foreground hover:text-foreground"
            >
              {t('nav.cv')}
            </button>
            <div className="absolute top-full right-0 mt-1 w-32 bg-popover border border-border rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <a
                  href={`/CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
                  download={`CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
                  className="block px-3 py-1.5 text-[8px] tracking-[0.2em] uppercase text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {t('nav.cvDropdown.download')}
                </a>
                <a
                  href={`/CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-1.5 text-[8px] tracking-[0.2em] uppercase text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {t('nav.cvDropdown.view')}
                </a>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'theme',
        element: (
          <button
            onClick={toggleTheme}
            className={cn(
              "tracking-[0.2em] uppercase transition-colors whitespace-nowrap",
              isMobile ? "text-xs text-foreground hover:opacity-90 py-2 min-h-[44px] px-2 transition-opacity" : "text-[9px] text-muted-foreground hover:text-foreground py-1 px-2"
            )}
          >
            {t(`nav.theme.${theme}`)}
          </button>
        ),
      },
      {
        id: 'language',
        element: (
          <button
            onClick={toggleLanguage}
            className={cn(
              "tracking-[0.2em] uppercase transition-colors whitespace-nowrap",
              isMobile ? "text-xs text-foreground hover:opacity-90 py-2 min-h-[44px] px-2 transition-opacity" : "text-[9px] text-muted-foreground hover:text-foreground py-1 px-2"
            )}
          >
            {t('nav.language')}
          </button>
        ),
      },
      {
        id: 'grid',
        element: (
          <button
            onClick={toggleGrid}
            className={cn(
              "tracking-[0.2em] uppercase transition-colors whitespace-nowrap",
              isMobile ? "text-xs text-foreground hover:opacity-90 py-2 min-h-[44px] px-2 transition-opacity" : "text-[9px] text-muted-foreground hover:text-foreground py-1 px-2",
              isGridVisible && "text-foreground"
            )}
          >
            Grid
          </button>
        ),
      },
    ];

    const listContent = (
      <>
        {v2NavLinks}
        {items.map((item) => (
          <li key={item.id}>
            {item.element}
          </li>
        ))}
      </>
    );

    if (isMobile) {
      return (
        <motion.ul
          className={cn("flex flex-col gap-6")}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isV2 ? (
            <>
              <motion.li variants={itemVariants}>
                <Link
                  href={v2WebHref}
                  className={cn(
                    'text-xs tracking-[0.2em] uppercase transition-opacity whitespace-nowrap py-2 min-h-[44px] px-2 flex items-center',
                    v2WebActive ? 'text-foreground' : 'text-foreground/80',
                  )}
                >
                  {t('work.filterWeb')}
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link
                  href={v2GraphicHref}
                  className={cn(
                    'text-xs tracking-[0.2em] uppercase transition-opacity whitespace-nowrap py-2 min-h-[44px] px-2 flex items-center',
                    v2Graphic ? 'text-foreground' : 'text-foreground/80',
                  )}
                >
                  {t('work.filterGraphic')}
                </Link>
              </motion.li>
            </>
          ) : null}
          {items.map((item) => (
            <motion.li
              key={item.id}
              variants={itemVariants}
            >
              {item.element}
            </motion.li>
          ))}
        </motion.ul>
      );
    }

    return (
      <ul className="flex flex-row gap-6 -mr-2">
        {listContent}
      </ul>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-nav/80 backdrop-blur-sm z-[100]">
        <div className="w-full grid grid-cols-12 gap-4 lg:gap-6 px-4 lg:px-12">
          {/* Logo - 6 columns on mobile, auto on desktop */}
          <div className="col-span-6 flex items-center h-[48px] lg:h-[40px]">
            <a
              href={homeHref}
              className="text-xs md:text-[9px] tracking-[0.2em] uppercase flex items-center text-foreground/90 hover:text-foreground py-2 md:py-0"
            >
              Ivan Nevares
            </a>
          </div>

          {/* Navigation - 3 columns starting at column 10 (aligned with sidebar) */}
          <nav
            className="col-span-6 col-start-7 lg:col-span-3 lg:col-start-10 flex items-center justify-end h-[48px] lg:h-[40px]"
          >
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <NavItems />
            </div>
            
            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="p-3 flex items-center -mr-1 min-h-[44px] min-w-[44px] justify-center">
                    <HamburgerMenu isOpen={isMobileMenuOpen} />
                  </button>
                </SheetTrigger>
                <SheetContent
                  className="w-full h-[100vh] sm:max-w-none border-b border-border/80 bg-background mt-[48px] p-0"
                  side="top"
                >
                  <div className="w-full h-full">
                    <div className="grid grid-cols-12 px-4 lg:px-12 pt-24">
                      <div className="col-span-6">
                        <NavItems isMobile={true} />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
