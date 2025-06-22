"use client";

import { Analytics } from '@vercel/analytics/react';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { NavBar } from '@/components/NavBar';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavBar />
        <main className="relative">
          {children}
        </main>
        <Analytics />
      </LanguageProvider>
    </ThemeProvider>
  );
} 