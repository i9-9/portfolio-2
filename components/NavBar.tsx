"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { AboutModal } from './AboutModal';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/custom-sheet';
import { HamburgerMenu } from './ui/hamburger-menu';
import { cn } from '@/lib/utils';

export function NavBar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const NavItems = ({ isMobile = false }: { isMobile?: boolean }) => (
    <ul className={cn(
      "flex flex-col lg:flex-row",
      isMobile ? "gap-4" : "gap-6"
    )}>
      <li>
        <Link 
          href="/#work" 
          className={cn(
            "text-[9px] tracking-[0.2em] uppercase transition-colors",
            isMobile ? "text-foreground/90 hover:text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          scroll={true}
        >
          {t('nav.work')}
        </Link>
      </li>
      <li>
        <button
          onClick={() => setIsAboutOpen(true)}
          className={cn(
            "text-[9px] tracking-[0.2em] uppercase transition-colors",
            isMobile ? "text-foreground/90 hover:text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t('nav.about')}
        </button>
      </li>
      <li>
        {isMobile ? (
          // Mobile: Simple link
          <a 
            href={`/CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
            download={`CV_Ivan_Nevares_${language.toUpperCase()}.pdf`}
            className={cn(
              "text-[9px] tracking-[0.2em] uppercase transition-colors",
              "text-foreground/90 hover:text-foreground"
            )}
          >
            {t('nav.cv')}
          </a>
        ) : (
          // Desktop: Dropdown menu
          <div className="relative group">
            <button
              className={cn(
                "text-[9px] tracking-[0.2em] uppercase transition-colors",
                "text-muted-foreground hover:text-foreground"
              )}
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
        )}
      </li>
      <li>
        <button 
          onClick={toggleTheme}
          className={cn(
            "text-[9px] tracking-[0.2em] uppercase transition-colors",
            isMobile ? "text-foreground/90 hover:text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t(`nav.theme.${theme}`)}
        </button>
      </li>
      <li>
        <button 
          onClick={toggleLanguage}
          className={cn(
            "text-[9px] tracking-[0.2em] uppercase transition-colors",
            isMobile ? "text-foreground/90 hover:text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t('nav.language')}
        </button>
      </li>
    </ul>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-nav/80 backdrop-blur-sm z-[100]">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 px-4 lg:px-12">
          <div className="col-span-6 flex items-center h-[48px] lg:h-[24px]">
            <a href="/" className={cn(
              "text-[9px] tracking-[0.2em] uppercase flex items-center",
              isMobileMenuOpen ? "text-foreground" : "text-foreground/90 hover:text-foreground"
            )}>Ivan Nevares</a>
          </div>
          <nav className="col-span-3 col-start-10 flex items-center justify-end h-[48px] lg:h-[24px]">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <NavItems />
            </div>
            
            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 flex items-center">
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