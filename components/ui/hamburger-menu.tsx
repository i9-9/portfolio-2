"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO, MOBILE_MENU_TOGGLE_DURATION } from "@/lib/motion/easing";

interface HamburgerMenuProps {
  isOpen: boolean;
}

function MenuLines({ className }: { className?: string }) {
  return (
    <>
      <span
        className={cn(
          "absolute left-0 top-[6px] h-[2px] w-full bg-current",
          className,
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-[15px] h-[2px] w-full bg-current",
          className,
        )}
      />
    </>
  );
}

function XLines({ className }: { className?: string }) {
  return (
    <>
      <span
        className={cn(
          "absolute left-1/2 top-1/2 h-[2px] w-[22px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current",
          className,
        )}
      />
      <span
        className={cn(
          "absolute left-1/2 top-1/2 h-[2px] w-[22px] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current",
          className,
        )}
      />
    </>
  );
}

const toggleTransition = {
  duration: MOBILE_MENU_TOGGLE_DURATION,
  ease: EASE_OUT_EXPO,
};

export function HamburgerMenu({ isOpen }: HamburgerMenuProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="relative flex size-7 items-center justify-center" aria-hidden>
        <div className="relative size-6 text-foreground">
          {isOpen ? <XLines /> : <MenuLines className="text-foreground/90" />}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex size-7 items-center justify-center [perspective:600px]"
      aria-hidden
    >
      <div className="relative size-6 [transform-style:preserve-3d]">
        <motion.div
          className={cn(
            "absolute inset-0 [backface-visibility:hidden] [transform-origin:center_center]",
            !isOpen ? "text-foreground/90" : "text-foreground",
          )}
          animate={{
            rotateX: isOpen ? 90 : 0,
            opacity: isOpen ? 0 : 1,
            z: 0.01,
          }}
          transition={toggleTransition}
        >
          <MenuLines />
        </motion.div>
        <motion.div
          className="absolute inset-0 text-foreground [backface-visibility:hidden] [transform-origin:center_center]"
          initial={false}
          animate={{
            rotateX: isOpen ? 0 : -90,
            opacity: isOpen ? 1 : 0,
            z: 0.01,
          }}
          transition={toggleTransition}
        >
          <XLines />
        </motion.div>
      </div>
    </div>
  );
}
