"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

const GeometricFlowCard = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [patternType, setPatternType] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const particlesRef = useRef<THREE.Points>();
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const materialRef = useRef<THREE.ShaderMaterial>();

  useEffect(() => {
    setIsMounted(true);
    setIsVisible(true);
  }, []);

  // Configuración para halftone grid (basado en tu original)
  const config = useMemo(() => {
    const GRID_SIZE = 32;
    const CELL_SIZE = 10;
    const CONTAINER_SIZE = GRID_SIZE * CELL_SIZE;
    const PARTICLE_COUNT = GRID_SIZE * GRID_SIZE;
    
    return {
      GRID_SIZE,
      CELL_SIZE,
      CONTAINER_SIZE,
      PARTICLE_COUNT,
      MIN_SIZE: 0.006,
      MAX_SIZE: 0.016,
    };
  }, []);

  // Inicializar Three.js para halftone dots
  const initThreeJS = () => {
    if (!containerRef.current || sceneRef.current) return;

    try {
      const { CONTAINER_SIZE, GRID_SIZE, PARTICLE_COUNT } = config;

      // Scene
      const scene = new THREE.Scene();
      scene.background = null;

      // Camera ortográfica para vista 2D perfecta como tu original
      const camera = new THREE.OrthographicCamera(
        -10, 10, 10, -10, 0.1, 1000
      );
      camera.position.set(0, 0, 10);

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(CONTAINER_SIZE, CONTAINER_SIZE);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      containerRef.current.appendChild(renderer.domElement);

      // Crear grid de puntos halftone
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const sizes = new Float32Array(PARTICLE_COUNT);
      const originalPositions = new Float32Array(PARTICLE_COUNT * 2);

      // Configurar grid exactamente como tu original
      let index = 0;
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const x = (col / (GRID_SIZE - 1) - 0.5) * 18;
          const y = (row / (GRID_SIZE - 1) - 0.5) * 18;

          positions[index * 3] = x;
          positions[index * 3 + 1] = y;
          positions[index * 3 + 2] = 0;

          originalPositions[index * 2] = col / (GRID_SIZE - 1);
          originalPositions[index * 2 + 1] = row / (GRID_SIZE - 1);

          sizes[index] = config.MIN_SIZE;
          index++;
        }
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Material shader para puntos halftone perfectos
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          attribute float size;
          
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * 2500.0;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          precision highp float;
          
          void main() {
            vec2 coord = gl_PointCoord - vec2(0.5);
            float dist = length(coord);
            
            if (dist > 0.5) discard;
            
            float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
            gl_FragColor = vec4(0.2, 0.2, 0.2, alpha);
          }
        `,
        transparent: true
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Referencias
      sceneRef.current = scene;
      rendererRef.current = renderer;
      cameraRef.current = camera;
      particlesRef.current = particles;
      materialRef.current = material;
      particles.userData = { originalPositions };

      console.log('🎨 Three.js halftone system initialized');
    } catch (error) {
      console.error('Three.js initialization failed:', error);
    }
  };

  // Tus patrones originales exactos
  const getCurrentPattern = (x: number, y: number, type: number, time: number, timeOffset = 0) => {
    const adjustedTime = time + timeOffset;
    const centerX = 0.5;
    const centerY = 0.5;

    switch (type) {
      case 0: {
        const angle = Math.atan2(y - centerY, x - centerX);
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const spiral = Math.sin(angle * 4 + distance * 20 - adjustedTime * 2);
        const radialWave = Math.sin(distance * 15 - adjustedTime * 1.5);
        return (spiral + radialWave) * 0.5;
      }
      case 1: {
        const wave1 = Math.sin(y * 12 + adjustedTime * 1.5);
        const wave2 = Math.sin(y * 8 + x * 4 + adjustedTime * 1.2);
        const wave3 = Math.sin(y * 15 + x * 2 - adjustedTime * 2);
        return (wave1 + wave2 * 0.7 + wave3 * 0.5) / 2.2;
      }
      case 2: {
        const curve = Math.sin(x * 10 + adjustedTime * 1.5);
        const flow = Math.sin((y + curve * 0.2) * 12 - adjustedTime * 1.8);
        const secondary = Math.cos(x * 6 + y * 3 + adjustedTime);
        return (flow + secondary * 0.6) / 1.6;
      }
      case 3: {
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const circles = Math.sin(distance * 25 - adjustedTime * 2);
        const wobble = Math.sin(distance * 10 + adjustedTime * 1.2) * 0.3;
        return circles + wobble;
      }
      case 4: {
        const diag1 = Math.sin((x + y) * 12 - adjustedTime * 1.5);
        const diag2 = Math.sin((x - y) * 10 + adjustedTime * 1.3);
        const grid = Math.sin(x * 15) * Math.sin(y * 15) * 0.3;
        return (diag1 + diag2) * 0.5 + grid;
      }
      case 5: {
        const wave1 = Math.sin(x * 8 + adjustedTime * 1.2);
        const wave2 = Math.sin(y * 10 - adjustedTime * 1.5);
        const wave3 = Math.sin((x + y) * 6 + adjustedTime);
        const wave4 = Math.sin((x - y) * 7 - adjustedTime * 1.3);
        return (wave1 + wave2 + wave3 * 0.7 + wave4 * 0.7) / 3.4;
      }
      default:
        return 0;
    }
  };

  // Actualizar patrones halftone
  const updateHalftonePattern = (time: number, patternType: number, transitionProgress: number) => {
    if (!particlesRef.current) return;

    const geometry = particlesRef.current.geometry;
    const sizes = geometry.attributes.size.array as Float32Array;
    const originalPositions = particlesRef.current.userData.originalPositions as Float32Array;
    const { MIN_SIZE, MAX_SIZE } = config;

    let index = 0;
    for (let row = 0; row < config.GRID_SIZE; row++) {
      for (let col = 0; col < config.GRID_SIZE; col++) {
        const x = originalPositions[index * 2];
        const y = originalPositions[index * 2 + 1];

        let influence;
        
        if (transitionProgress > 0) {
          const nextPattern = (patternType + 1) % 6;
          const currentInfluence = getCurrentPattern(x, y, patternType, time, -transitionProgress * 0.2);
          const nextInfluence = getCurrentPattern(x, y, nextPattern, time, (1 - transitionProgress) * 0.2);
          influence = currentInfluence * (1 - transitionProgress) + nextInfluence * transitionProgress;
        } else {
          influence = getCurrentPattern(x, y, patternType, time);
        }

        // Convertir a tamaño como tu original
        let size = MIN_SIZE + (influence * 0.5 + 0.5) * (MAX_SIZE - MIN_SIZE);
        size = Math.max(MIN_SIZE, Math.min(MAX_SIZE, size));
        
        sizes[index] = size;
        index++;
      }
    }

    geometry.attributes.size.needsUpdate = true;
  };

  // Estados para debug (opcional, puedes remover después)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`Pattern: ${patternType + 1}/6, Transition: ${Math.round(transitionProgress * 100)}%`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [patternType, transitionProgress]);

  // Intersection Observer para performance
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Inicializar y manejar la animación
  useEffect(() => {
    if (!isMounted || !isVisible) return;

    initThreeJS();
    
    const startAnimation = () => {
      const animateLoop = (currentTime: number) => {
        if (!sceneRef.current || !rendererRef.current || !cameraRef.current || !isVisible) return;

        if (!startTimeRef.current) startTimeRef.current = currentTime;
        const deltaTime = (currentTime - startTimeRef.current) / 1000;

        // Sistema de cambio automático de patrones (cada 8 segundos)
        const PATTERN_DURATION = 6; // 6 segundos por patrón
        const TRANSITION_DURATION = 2; // 2 segundos de transición
        const TOTAL_CYCLE = PATTERN_DURATION + TRANSITION_DURATION; // 8 segundos total

        const cyclePosition = deltaTime % TOTAL_CYCLE;
        const currentPatternIndex = Math.floor(deltaTime / TOTAL_CYCLE) % 6;
        
        // Calcular progreso de transición
        let currentTransitionProgress = 0;
        if (cyclePosition > PATTERN_DURATION) {
          const transitionTime = cyclePosition - PATTERN_DURATION;
          currentTransitionProgress = transitionTime / TRANSITION_DURATION;
          // Suavizar la transición con easing
          currentTransitionProgress = (1 - Math.cos(currentTransitionProgress * Math.PI)) / 2;
        }

        // Actualizar uniforms
        if (materialRef.current) {
          materialRef.current.uniforms.time.value = deltaTime;
        }

        // Actualizar patrones con valores actuales
        updateHalftonePattern(deltaTime, currentPatternIndex, currentTransitionProgress);

        // Render
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        animationFrameRef.current = requestAnimationFrame(animateLoop);
      };

      animationFrameRef.current = requestAnimationFrame(animateLoop);
    };
    
    const timeoutId = setTimeout(startAnimation, 100);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Cleanup Three.js
      if (rendererRef.current) {
        try {
          const currentContainer = containerRef.current;
          if (sceneRef.current) sceneRef.current.clear();
          if (particlesRef.current) {
            particlesRef.current.geometry.dispose();
            if (particlesRef.current.material instanceof THREE.Material) {
              particlesRef.current.material.dispose();
            } else if (Array.isArray(particlesRef.current.material)) {
              particlesRef.current.material.forEach(mat => mat.dispose());
            }
          }
          
          const canvas = rendererRef.current.domElement;
          if (canvas && currentContainer && currentContainer.contains(canvas)) {
            currentContainer.removeChild(canvas);
          }
          
          rendererRef.current.dispose();
        } catch (error) {
          console.warn('Three.js cleanup warning:', error);
        }
        
        rendererRef.current = undefined;
        sceneRef.current = undefined;
        particlesRef.current = undefined;
        materialRef.current = undefined;
      }
    };
  }, [isMounted, isVisible, initThreeJS, updateHalftonePattern]);

  if (!isMounted) return null;

  return (
    <div className="w-full aspect-square bg-background border border-border rounded-lg overflow-hidden p-2">
      <div className="relative w-full h-full flex items-center justify-center">
        <div 
          ref={containerRef}
          className="relative"
          style={{
            width: `${config.CONTAINER_SIZE}px`,
            height: `${config.CONTAINER_SIZE}px`,
          }}
        />
      </div>
    </div>
  );
};

export default GeometricFlowCard;