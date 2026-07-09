"use client";

import { NavBar } from '@/components/NavBar';
import { GridProvider } from '@/lib/grid/GridContext';
import { GridOverlay } from '@/components/GridOverlay';
import { useGrid } from '@/lib/grid/GridContext';
import { SplashHandoffProvider } from '@/lib/splash/SplashHandoffContext';
import { ProjectTransitionProvider, useProjectTransition } from '@/lib/transitions/ProjectTransitionContext';
import { ProjectTransitionOverlay } from '@/components/transitions/ProjectTransitionOverlay';

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { isGridVisible } = useGrid();
  const { phase, slug, previewImage, origin } = useProjectTransition();

  return (
    <>
      <NavBar />
      <main className="relative">
        {children}
      </main>
      <ProjectTransitionOverlay
        phase={phase}
        slug={slug}
        previewImage={previewImage}
        origin={origin}
      />
      <GridOverlay isVisible={isGridVisible} />
    </>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SplashHandoffProvider>
      <ProjectTransitionProvider>
        <GridProvider>
          <ClientLayoutContent>{children}</ClientLayoutContent>
        </GridProvider>
      </ProjectTransitionProvider>
    </SplashHandoffProvider>
  );
} 