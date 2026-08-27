"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Flame, X } from "lucide-react"

const messages = [
  "🔥 Limited spots: only 3 onboarding slots left this month",
  "⚡ Last client went live in 11 days, yours could too",
  "🚀 Free strategy call, no commitment, no pressure",
  "💬 Real businesses. Real results. Book your call today.",
]

export function UrgencyBanner() {
  const [visible, setVisible] = useState(true)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-purple-600/90 to-cyan-600/90 backdrop-blur-sm border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2">
          <Flame className="h-4 w-4 text-yellow-300 flex-shrink-0" />
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="text-sm text-white font-medium text-center"
            >
              {messages[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-white/60 hover:text-white transition-colors flex-shrink-0"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}
