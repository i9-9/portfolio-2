"use client";

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';

export function NavBar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-nav/80 backdrop-blur-sm z-50">
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 px-12">
        <div className="col-span-6 h-[24px] flex items-center">
          <a href="/" className="text-[9px] tracking-[0.2em] uppercase">Ivan Nevares</a>
        </div>
        <nav className="col-span-3 col-start-10 h-[24px] flex items-center justify-end">
          <ul className="flex gap-6">
            <li>
              <Link 
                href="/#work" 
                className="text-[9px] text-muted-foreground hover:text-foreground transition-colors tracking-[0.2em] uppercase"
                scroll={true}
              >
                {t('nav.work')}
              </Link>
            </li>
            <li>
              <a 
                href="/CV_Ivan_Nevares.pdf"
                download="CV_Ivan_Nevares.pdf"
                className="text-[9px] text-muted-foreground hover:text-foreground transition-colors tracking-[0.2em] uppercase"
              >
                {t('nav.cv')}
              </a>
            </li>
            <li>
              <button 
                onClick={toggleTheme}
                className="text-[9px] text-muted-foreground hover:text-foreground transition-colors tracking-[0.2em] uppercase"
              >
                {t(`nav.theme.${theme}`)}
              </button>
            </li>
            <li>
              <button 
                onClick={toggleLanguage}
                className="text-[9px] text-muted-foreground hover:text-foreground transition-colors tracking-[0.2em] uppercase"
              >
                {t('nav.language')}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 