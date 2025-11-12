"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useGrid } from '@/lib/grid/GridContext';
import { AboutModal } from './AboutModal';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/custom-sheet';
import { HamburgerMenu } from './ui/hamburger-menu';
import { cn } from '@/lib/utils';

export function NavBar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { isGridVisible, toggleGrid } = useGrid();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const NavItems = ({ isMobile = false }: { isMobile?: boolean }) => {
    const items = [
      {
        id: 'about',
        element: (
          <button
            onClick={() => setIsAboutOpen(true)}
            className={cn(
              "tracking-[0.2em] uppercase transition-colors whitespace-nowrap",
              isMobile ? "text-xs text-foreground/90 hover:text-foreground py-2 min-h-[44px] px-2" : "text-[9px] text-muted-foreground hover:text-foreground py-1 px-2"
            )}
          >
            {t('nav.about')}
          </button>
        ),
      },
      {
        id: 'cv',
        element: isMobile ? (
          <a
            href={`/CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
            download={`CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
            className="text-xs tracking-[0.2em] uppercase transition-colors whitespace-nowrap text-foreground/90 hover:text-foreground py-2 min-h-[44px] px-2 flex items-center"
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
              isMobile ? "text-xs text-foreground/90 hover:text-foreground py-2 min-h-[44px] px-2" : "text-[9px] text-muted-foreground hover:text-foreground py-1 px-2"
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
              isMobile ? "text-xs text-foreground/90 hover:text-foreground py-2 min-h-[44px] px-2" : "text-[9px] text-muted-foreground hover:text-foreground py-1 px-2"
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
              isMobile ? "text-xs text-foreground/90 hover:text-foreground py-2 min-h-[44px] px-2" : "text-[9px] text-muted-foreground hover:text-foreground py-1 px-2",
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
          {items.map((item, index) => (
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
      <ul className={cn("flex flex-row gap-6")}>
        {listContent}
      </ul>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-nav/80 backdrop-blur-sm z-[100]">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4 lg:gap-6 px-4 lg:px-12">
          <div className="col-span-6 flex items-center h-[48px] lg:h-[40px]">
            <a href="/" className="text-xs md:text-[9px] tracking-[0.2em] uppercase flex items-center text-foreground/90 hover:text-foreground py-2 md:py-0">Ivan Nevares</a>
          </div>
          <nav className="col-span-6 col-start-7 lg:col-span-3 lg:col-start-10 flex items-center justify-end lg:justify-start h-[48px] lg:h-[40px]">
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
                  className="w-full h-[100vh] sm:max-w-none border-none bg-nav/95 backdrop-blur-md mt-[48px] p-0"
                  side="top"
                >
                  <div className="max-w-[1600px] mx-auto w-full h-full">
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
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
} 