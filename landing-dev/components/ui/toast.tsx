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
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 z-50 pointer-events-none"
        >
          <div className={cn(
            "px-4 py-3 rounded-lg shadow-lg",
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

