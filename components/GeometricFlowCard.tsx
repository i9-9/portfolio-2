"use client";

import { useState, useEffect } from 'react';

const GeometricFlowCard = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [time, setTime] = useState(0);
  const [patternType, setPatternType] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      setTime(prev => prev + 0.02);
      
      const cycleTime = (time * 10) % 120;
      if (cycleTime > 100) {
        setTransitionProgress((cycleTime - 100) / 20);
      } else {
        setTransitionProgress(0);
      }
      
      if (Math.floor(time * 10) % 120 === 0 && time > 0) {
        setPatternType(prev => (prev + 1) % 6);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [time, isMounted]);

  const getDotProperties = (row: number, col: number, totalRows: number, totalCols: number) => {
    const x = col / (totalCols - 1);
    const y = row / (totalRows - 1);
    const centerX = 0.5;
    const centerY = 0.5;

    const getCurrentPattern = (type: number) => {
      switch (type) {
        case 0:
          {
            const angle = Math.atan2(y - centerY, x - centerX);
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const spiral = Math.sin(angle * 4 + distance * 20 - time * 3);
            const radialWave = Math.sin(distance * 15 - time * 2);
            return (spiral + radialWave) * 0.5;
          }
        case 1:
          {
            const wave1 = Math.sin(y * 12 + time * 2);
            const wave2 = Math.sin(y * 8 + x * 4 + time * 1.5);
            const wave3 = Math.sin(y * 15 + x * 2 - time * 2.5);
            return (wave1 + wave2 * 0.7 + wave3 * 0.5) / 2.2;
          }
        case 2:
          {
            const curve = Math.sin(x * 10 + time * 1.8);
            const flow = Math.sin((y + curve * 0.2) * 12 - time * 2);
            const secondary = Math.cos(x * 6 + y * 3 + time * 1.2);
            return (flow + secondary * 0.6) / 1.6;
          }
        case 3:
          {
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const circles = Math.sin(distance * 25 - time * 3);
            const wobble = Math.sin(distance * 10 + time * 1.5) * 0.3;
            return circles + wobble;
          }
        case 4:
          {
            const diag1 = Math.sin((x + y) * 12 - time * 2);
            const diag2 = Math.sin((x - y) * 10 + time * 1.8);
            const grid = Math.sin(x * 15) * Math.sin(y * 15) * 0.3;
            return (diag1 + diag2) * 0.5 + grid;
          }
        case 5:
          {
            const wave1 = Math.sin(x * 8 + time * 1.5);
            const wave2 = Math.sin(y * 10 - time * 2);
            const wave3 = Math.sin((x + y) * 6 + time * 1.2);
            const wave4 = Math.sin((x - y) * 7 - time * 1.8);
            return (wave1 + wave2 + wave3 * 0.7 + wave4 * 0.7) / 3.4;
          }
        default:
          return 0;
      }
    };

    let influence = getCurrentPattern(patternType);
    
    if (transitionProgress > 0) {
      const nextPattern = (patternType + 1) % 6;
      const nextInfluence = getCurrentPattern(nextPattern);
      const easedProgress = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
      influence = influence * (1 - easedProgress) + nextInfluence * easedProgress;
    }

    let size = 1 + (influence * 0.5 + 0.5) * 3;
    size = Math.max(0.5, size);
    const opacity = Math.min(1, (size / 4) * 0.8 + 0.2);
    
    return { size, opacity };
  };

  if (!isMounted) {
    return null;
  }

  const GRID_SIZE = 32; // Número de filas y columnas
  const CELL_SIZE = 8; // Tamaño de cada celda en píxeles
  const CONTAINER_SIZE = GRID_SIZE * CELL_SIZE; // Tamaño total del contenedor

  return (
    <div className="w-full aspect-square bg-background border border-border rounded-lg overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        <div 
          className="relative"
          style={{
            width: `${CONTAINER_SIZE}px`,
            height: `${CONTAINER_SIZE}px`,
          }}
        >
          {/* Dots */}
          {[...Array(GRID_SIZE)].map((_, row) => (
            [...Array(GRID_SIZE)].map((_, col) => {
              const { size, opacity } = getDotProperties(row, col, GRID_SIZE, GRID_SIZE);
              return (
                <div
                  key={`${row}-${col}`}
                  className="absolute bg-foreground rounded-full transition-all duration-200 ease-out"
                  style={{
                    left: `${col * CELL_SIZE}px`,
                    top: `${row * CELL_SIZE}px`,
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity: opacity,
                    transform: `translate(-50%, -50%)`,
                  }}
                />
              );
            })
          )).flat()}

          {/* Grid */}
          <div 
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 0.5px, transparent 0.5px),
                linear-gradient(to bottom, currentColor 0.5px, transparent 0.5px)
              `,
              backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GeometricFlowCard;