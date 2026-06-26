"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface GridContextType {
  isGridVisible: boolean;
  toggleGrid: () => void;
}

const GridContext = createContext<GridContextType | undefined>(undefined);

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
}

export function GridProvider({ children }: { children: ReactNode }) {
  const [isGridVisible, setIsGridVisible] = useState(false);

  const toggleGrid = useCallback(() => {
    setIsGridVisible(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey || (event.key !== "G" && event.key !== "g")) return;
      if (isEditableTarget(event.target)) return;

      event.preventDefault();
      toggleGrid();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleGrid]);

  return (
    <GridContext.Provider value={{ isGridVisible, toggleGrid }}>
      {children}
    </GridContext.Provider>
  );
}

export function useGrid() {
  const context = useContext(GridContext);
  if (context === undefined) {
    throw new Error('useGrid must be used within a GridProvider');
  }
  return context;
}
