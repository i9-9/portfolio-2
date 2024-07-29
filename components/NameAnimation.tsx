"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface NameAnimationProps {
  text: string;
}

const NameAnimation: React.FC<NameAnimationProps> = ({ text }) => {
  const [animatedText, setAnimatedText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedText(
        text
          .split("")
          .map((char) =>
            Math.random() > 0.7
              ? String.fromCharCode(Math.random() * 26 + (Math.random() > 0.5 ? 65 : 97))
              : char
          )
          .join("")
      );
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setAnimatedText(text);
    }, 3000);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <Link href="/" passHref>
      <motion.h1
        className="title pt-4 md:py-1 text-verde text-lg flex items-baseline font-supplySans cursor-pointer"
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
          ▌
        </motion.span>
      </motion.h1>
    </Link>
  );
};

export default NameAnimation;
