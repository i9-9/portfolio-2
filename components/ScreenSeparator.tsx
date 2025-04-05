"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ScreenSeparator = () => {
  const [isVisible, setIsVisible] = useState(true);
  const image = "/anim/logo1.png";  // Path to the single image

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Duration of the separator (3 seconds)

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black z-[9999] flex items-center justify-center"
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}  // Move up when exiting
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Wrapping div to handle opacity transitions */}
          <motion.div
            key="imageWrapper"  // Use a constant key to prevent re-rendering on image change
            initial={{ opacity: 0 }}  // Start with opacity 0 (hidden)
            animate={{ opacity: 1 }}  // Animate to full opacity
            exit={{ opacity: 0 }}  // Fade out to opacity 0
            transition={{ opacity: { duration: 0.3, ease: "easeInOut" } }}  // Fade transition with smoother ease
          >
            {/* Spinning Image */}
            <motion.img
              src={image}  // Single image path
              alt="Ivan Nevares Portfolio - Loading Logo Animation"
              className="w-32 h-32"  // Adjust the size as necessary
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: 3 , // Adjust the speed of the spin
                ease: [0.2, 0.8, 0.2, 1],  // Custom cubic bezier curve for smooth acceleration
                repeatType: "loop", // Ensures continuous loop
                repeatDelay: 0, // No delay between repeat cycles
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScreenSeparator;
