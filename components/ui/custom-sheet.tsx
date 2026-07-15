"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> & {
    motion?: "default" | "clip" | null;
  }
>(({ className, motion = "default", ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      motion === "clip"
        ? "mobile-menu-panel fixed inset-0 z-50"
        : "fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva("fixed z-50 gap-4 p-6 shadow-lg", {
  variants: {
    side: {
      top: "inset-x-0 top-0 border-b",
      bottom: "inset-x-0 bottom-0 border-t",
      left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
      right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    },
    motion: {
      default:
        "transition-all ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:duration-[350ms] data-[state=open]:duration-[400ms] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
      clip: "mobile-menu-panel border-0 shadow-none",
    },
  },
  compoundVariants: [
    {
      motion: "default",
      side: "bottom",
      className:
        "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
    },
    {
      motion: "default",
      side: "left",
      className:
        "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
    },
    {
      motion: "default",
      side: "right",
      className:
        "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
    },
  ],
  defaultVariants: {
    side: "right",
    motion: "default",
  },
});

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  overlayClassName?: string;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", motion = "default", className, overlayClassName, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay motion={motion} className={overlayClassName} />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side, motion }), className)}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetContent,
  SheetTitle,
};
