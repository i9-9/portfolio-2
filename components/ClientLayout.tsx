"use client";

import { NavBar } from '@/components/NavBar';
import { GridProvider } from '@/lib/grid/GridContext';
import { GridOverlay } from '@/components/GridOverlay';
import { useGrid } from '@/lib/grid/GridContext';
import { useSplash } from '@/lib/splash/SplashContext';

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { isGridVisible } = useGrid();
  const { showSplash } = useSplash();

  return (
    <>
      {!showSplash && <NavBar />}
      <main className="relative">
        {children}
      </main>
      <GridOverlay isVisible={isGridVisible} />
    </>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <GridProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </GridProvider>
  );
} 