"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0C1014] text-light-gray">
      <motion.div
        className="relative w-24 h-24 mb-6"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: [0.2, 0.8, 0.2, 1],
          repeatType: "loop",
          repeatDelay: 0,
        }}
      >
        {/* Outer circle */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full rounded-full border-t-2 border-r-2 border-lima"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
        />
        
        {/* Inner circle */}
        <motion.div 
          className="absolute top-2 left-2 w-20 h-20 rounded-full border-b-2 border-l-2 border-mid-gray"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.5
          }}
        />
        
        {/* Center dot */}
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-lima rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
        />
      </motion.div>
      
      <motion.p 
        className="text-xl font-helveticaNowDisplayBold text-lima"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="inline-block ml-1"
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="inline-block"
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          className="inline-block"
        >
          .
        </motion.span>
      </motion.p>
    </div>
  );
}