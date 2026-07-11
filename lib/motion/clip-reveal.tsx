"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";

export const CLIP_REVEAL_DURATION = 0.72;
export const CLIP_REVEAL_STAGGER = 0.06;
export const CLIP_REVEAL_BASE_DELAY = 0.12;

/** LIVEUP mobile nav links — stagger after panel reveal. */
export const MOBILE_MENU_ITEM_STAGGER = 0.1;
export const MOBILE_MENU_ITEM_DURATION = 1.5;
export const MOBILE_MENU_ITEM_BASE_DELAY = 0.1;

/** Logo + 5 links on v2 home (desktop bar). */
export const SPLASH_NAV_ITEMS_LG = 6;
/** Logo + Menu label + hamburger (mobile bar). */
export const SPLASH_NAV_ITEMS_SM = 3;

export function clipRevealDelay(index: number) {
  return CLIP_REVEAL_BASE_DELAY + index * CLIP_REVEAL_STAGGER;
}

export function heroRevealIndex(navItemCount: number, part: 0 | 1) {
  return navItemCount + part;
}

export const clipRevealShellVariants: Variants = {
  hidden: {},
  visible: {},
};

export function clipRevealItemVariants(reduced: boolean): Variants {
  return {
    hidden: {
      clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
    },
    visible: {
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: reduced ? 0 : CLIP_REVEAL_DURATION,
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

/** Bottom clip — LIVEUP mobile menu link reveal direction. */
export function mobileMenuItemVariants(reduced: boolean): Variants {
  return {
    hidden: {
      clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
    },
    visible: {
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: reduced ? 0 : MOBILE_MENU_ITEM_DURATION,
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

export function mobileMenuContainerVariants(
  delayChildren = MOBILE_MENU_ITEM_BASE_DELAY,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        delayChildren,
        staggerChildren: MOBILE_MENU_ITEM_STAGGER,
      },
    },
  };
}

/** Staggered clip reveal for menu overlays (mobile nav sheet). */
export function ClipRevealItem({
  children,
  shellVariants,
  revealVariants,
  className,
  role,
}: {
  children: React.ReactNode;
  shellVariants: Variants;
  revealVariants: Variants;
  className?: string;
  role?: React.AriaRole;
}) {
  return (
    <motion.div role={role} className={className} variants={shellVariants}>
      <motion.div className="block w-full" variants={revealVariants}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Indexed clip reveal synced to splash handoff (nav bar + hero). */
export function SplashClipReveal({
  live,
  index,
  reduced,
  active = true,
  className,
  children,
}: {
  live: boolean;
  index: number;
  reduced: boolean | null;
  /** When false, content is shown without animation (e.g. inner routes). */
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (!active) {
    return <div className={cn("min-w-0", className)}>{children}</div>;
  }

  const skip = reduced === true;
  const hiddenClip = skip ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)";

  return (
    <div className={cn("min-w-0", className)}>
      <motion.div
        className="block w-full"
        initial={{ clipPath: hiddenClip }}
        animate={live ? { clipPath: "inset(0% 0% 0% 0%)" } : { clipPath: hiddenClip }}
        transition={{
          duration: skip ? 0 : CLIP_REVEAL_DURATION,
          delay: live && !skip ? clipRevealDelay(index) : 0,
          ease: EASE_OUT_EXPO,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
