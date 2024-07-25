"use client";

import Work from "../components/Work";
import NavbarHome from "../components/NavbarHome";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react"; // Import useState and useEffect
import MyMarquee from "../components/MarqueeLanding";



const Home = () => {
  const text = "IVAN NEVARES";
  const [animatedText, setAnimatedText] = useState("");


  
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly choose a letter or keep the correct letter if animation is done
      setAnimatedText(
        text
          .split("")
          .map((char) =>
            Math.random() > 0.7 ? String.fromCharCode(Math.random() * 26 + (Math.random() > 0.5 ? 65 : 97)) : char
          )
          .join("")
      );
    }, 50); // Adjust the speed as needed

    setTimeout(() => {
      clearInterval(interval);
      setAnimatedText(text); // Set the final correct text after animation completes
    }, 3000); // Adjust the total animation time as needed

    return () => clearInterval(interval);
  }, []);

  return (
    
    <div className="mx-auto">
      <div className="">
        <MyMarquee />
      </div>
      <div className="items-center justify-between flex border-verde border-b pb-2 md:border-none md:pb-0 px-4">
        <div>
          <Link href="/">
            <motion.h1
              className="title pt-4 md:py-1 text-verde text-lg flex items-baseline font-supplySans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {animatedText.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 * index }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
              <motion.span
                className="cursor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.5,
                  delay: 0.3 * text.length,
                }}
              >
                {/* Empty span to create the block cursor */}
                ▌
              </motion.span>
            </motion.h1>
          </Link>
        </div>
        <div className="hidden md:flex">
          <Link href="/info">
            <h2 className="text-gris_oscuro font-supplySans">DIGITAL DESIGNER</h2>
          </Link>
        </div>
      </div>
      <NavbarHome />
      <Work />
    </div>
  
  );
};

export default Home;
