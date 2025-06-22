"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AnimatedButtonProps {
  href: string;
}

export const AnimatedButton = ({ href }: AnimatedButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="font-helveticaNowTextRegular"
      asChild
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center">
        <div className="relative overflow-hidden w-[105px] h-[24px]">
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div
                key="hover"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center whitespace-nowrap"
              >
                Visit website
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center whitespace-nowrap"
              >
                Visit website
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ArrowRightIcon className="w-4 h-4 ml-2" />
      </a>
    </Button>
  );
}; 