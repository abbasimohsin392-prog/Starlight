"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { ArrowRight, MessageCircle } from "lucide-react"

const CALENDLY_LINK = "https://calendly.com/starlightai306/30min"

export function FloatingCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={CALENDLY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow duration-300"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">Book Free Call</span>
          <ArrowRight className="h-4 w-4" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
