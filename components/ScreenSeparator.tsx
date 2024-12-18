// components/ScreenSeparator.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ScreenSeparator = () => {
  const [isVisible, setIsVisible] = useState(true);

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
          {/* Spinning Image */}
          <motion.img
            src="/anim/circulo.png"  // Path to your spinning image
            alt="Spinning Image"
            className="w-32 h-32"  // Adjust the size as necessary
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 3, // Adjust the speed of the spin
              ease: "linear",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScreenSeparator;
