"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const TOGGLE_EASE = [0.22, 1, 0.36, 1] as const;
const TOGGLE_DURATION = 0.55;

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

const maskRevealVariants = {
  initial: (opening: boolean) => ({
    y: opening ? "100%" : "-100%",
  }),
  animate: {
    y: "0%",
    transition: { duration: TOGGLE_DURATION, ease: TOGGLE_EASE },
  },
  exit: (opening: boolean) => ({
    y: opening ? "-100%" : "100%",
    transition: { duration: TOGGLE_DURATION, ease: TOGGLE_EASE },
  }),
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
    <div className="relative flex size-7 items-center justify-center" aria-hidden>
      <div className="relative size-6 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={isOpen ? "x" : "menu"}
            custom={isOpen}
            variants={maskRevealVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              "absolute inset-0",
              isOpen ? "text-foreground" : "text-foreground/90",
            )}
          >
            {isOpen ? <XLines /> : <MenuLines />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
