"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string
  isVisible: boolean
}

export function Toast({ message, isVisible }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="fixed bottom-4 right-4 z-50 pointer-events-none"
        >
          <div className={cn(
            "px-4 py-3 shadow-lg",
            "bg-background border border-border",
            "text-sm font-helveticaNowTextRegular text-foreground"
          )}>
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

