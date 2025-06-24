"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HamburgerMenuProps {
  isOpen: boolean;
}

export function HamburgerMenu({ isOpen }: HamburgerMenuProps) {
  const topLineVariants = {
    closed: { rotate: 0, y: 0, width: "28px" },
    open: { rotate: 45, y: 4, width: "22px" }
  };

  const bottomLineVariants = {
    closed: { rotate: 0, y: 0, width: "28px" },
    open: { rotate: -45, y: -4, width: "22px" }
  };

  const transition = { duration: 0.15, ease: [0.4, 0.0, 0.2, 1] };

  return (
    <div className="relative w-7 h-[10px] flex flex-col justify-between cursor-pointer">
      <motion.span
        className={cn(
          "absolute h-[1px] origin-center",
          isOpen ? "bg-foreground" : "bg-foreground/90"
        )}
        style={{ top: "1px" }}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={topLineVariants}
        transition={transition}
      />
      <motion.span
        className={cn(
          "absolute h-[1px] origin-center",
          isOpen ? "bg-foreground" : "bg-foreground/90"
        )}
        style={{ top: "8.75px" }}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={bottomLineVariants}
        transition={transition}
      />
    </div>
  );
} 