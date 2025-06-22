"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <motion.div 
        className="flex items-center space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span 
          className="text-4xl font-helveticaNowDisplayBold text-lima"
          animate={{ 
            opacity: [1, 0.3, 1],
            y: [0, -8, 0] 
          }}
          transition={{ 
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          i
        </motion.span>
        <motion.span 
          className="text-4xl font-helveticaNowDisplayBold text-lima"
          animate={{ 
            opacity: [1, 0.3, 1],
            y: [0, -8, 0] 
          }}
          transition={{ 
            duration: 1.2,
            delay: 0.1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          9
        </motion.span>
      </motion.div>
    </div>
  );
}