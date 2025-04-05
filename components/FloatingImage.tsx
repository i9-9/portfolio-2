"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

interface FloatingImageProps {
  hovered: boolean;
  position: { x: number; y: number };
  imageSrc: string;
}

const FloatingImage: React.FC<FloatingImageProps> = ({ hovered, position, imageSrc }) => {
  const [shouldFlip, setShouldFlip] = useState(false);
  
  // Reset flip state when hover ends
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (hovered) {
      // Set a timer to flip the image after 4 seconds
      timer = setTimeout(() => {
        setShouldFlip(true);
      }, 3000);
    } else {
      // Reset the flip state when no longer hovering
      setShouldFlip(false);
    }
    
    // Clean up the timer when component unmounts or hover state changes
    return () => {
      clearTimeout(timer);
    };
  }, [hovered]);
  
  // Only render the component when hovered is true
  if (!hovered) return null;
  
  return (
    <motion.div
      className="fixed w-48 h-48 overflow-hidden rounded-md drop-shadow-2xl pointer-events-none"
      style={{
        top: position.y - 24,
        left: position.x - 24,
        perspective: "1000px", // Add perspective for 3D effect
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{
          transformStyle: "preserve-3d", // Enable 3D transformations
        }}
        animate={{
          rotateY: shouldFlip ? 180 : 0, // Flip the image 180 degrees only after timer
          scale: hovered ? 1.2 : 1, // Slightly scale up on hover
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 10,
        }}
      >
        {/* Front Side of the Image */}
        <motion.div
          className="w-full h-full absolute"
          style={{
            backfaceVisibility: "hidden", // Hide the back of the image during flip
          }}
        >
          <Image
            src={imageSrc}
            alt="Ivan Nevares - UX/UI Designer & Front-End Developer Profile Photo"
            width={200}
            height={200}
            className="w-full h-auto max-w-xs object-cover shadow-lg rounded-md"
          />
        </motion.div>

        {/* Back Side of the Image (Optional) */}
        <motion.div
          className="w-full h-full absolute bg-gray-800 flex flex-col items-center justify-center text-white text-sm rounded-md p-3"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)", // Start flipped to act as the back side
          }}
        >
          <h3 className="font-bold text-lima mb-2 text-center">Services</h3>
          <ul className="text-center space-y-1 text-xs">
            <li>Graphic Design</li>
            <li>Web Design</li>
            <li>Web Development</li>
            <li>Brand Design</li>
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FloatingImage;