"use client"

import NavbarHome from "./NavbarHome";
import { motion } from 'framer-motion';

const Hero = () => {


  const text = "IVAN NEVA\nRES DIG\nITAL DESI\nGNER IVAN\n NEVA\nRES DIG\nITAL DESI\nGNER"

  return (
    <div>
        <div className="h-screen min-h-screen px-4 pt-4 bg-black">
          <div className="flex items-center justify-center">
            <motion.h1
              className="text-white text-[8rem] leading-[6.8rem] font-bold uppercase title"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {text.split("").map((letter, index) => {
                if (letter === '\n') {
                  return <br key={index} />;
                } else {
                  return (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      {letter}
                    </motion.span>
                  );
                }
              })}
            </motion.h1>
          </div>
        </div>

    </div>

  )
}

export default Hero;