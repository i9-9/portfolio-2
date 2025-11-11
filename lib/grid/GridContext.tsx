"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface GridContextType {
  isGridVisible: boolean;
  toggleGrid: () => void;
}

const GridContext = createContext<GridContextType | undefined>(undefined);

export function GridProvider({ children }: { children: ReactNode }) {
  const [isGridVisible, setIsGridVisible] = useState(false);

  const toggleGrid = () => {
    setIsGridVisible(prev => !prev);
  };

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
