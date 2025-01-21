"use client";

import React, { useEffect, useRef, useState } from "react";

const CURSOR_COLORS = {
  h1: "green-400",
  button: "orange-500",
  default: "sky-500",
};

const CustomCursor = () => {
  const smallCursorRef = useRef<HTMLDivElement | null>(null);
  const largeCursorRef = useRef<HTMLDivElement | null>(null);
  const position = useRef({ x: 0, y: 0 });
  const [cursorColor, setCursorColor] = useState("sky-500");
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      position.current = {
        x: e.clientX,
        y: e.clientY,
      };

      // Request the next frame to ensure smooth transitions
      requestAnimationFrame(() => {
        if (smallCursorRef.current && largeCursorRef.current) {
          // Use transform for smooth animation
          smallCursorRef.current.style.transform = `translate(-50%, -50%) translate(${position.current.x}px, ${position.current.y}px)`;
          largeCursorRef.current.style.transform = `translate(-50%, -50%) translate(${position.current.x}px, ${position.current.y}px)`;
        }
      });
    };

    const handleMouseDown = () => {
      setClicked(true);
      setTimeout(() => {
        setClicked(false);
      }, 800);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const tagName = e.target instanceof HTMLElement ? e.target.tagName.toLowerCase() : '';
      setCursorColor(CURSOR_COLORS[tagName] || CURSOR_COLORS.default);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        ref={smallCursorRef}
        className={`fixed pointer-events-none z-50 rounded-full w-3 h-3 bg-${cursorColor} transition-all ease-out duration-100`}
      />
      <div
        ref={largeCursorRef}
        className={`fixed pointer-events-none z-50 rounded-full w-8 h-8 border-2 border-${cursorColor} transition-all ease-out duration-200`}
      >
        <div
          className={`w-8 h-8 ${
            clicked ? "scale-100 opacity-30" : "scale-0 opacity-0"
          } -translate-x-[1px] -translate-y-[1px] rounded-full bg-${cursorColor} ease-in transition-all duration-300 -z-10`}
        />
      </div>
    </>
  );
};

export default CustomCursor;
