"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"

export function JarvisWelcome() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const audio = new Audio("/jarvis-welcome.mp3")
    audioRef.current = audio
    audio.volume = 0.7

    const timer = setTimeout(() => {
      audio.play().catch(() => {})
    }, 1500)

    const hideTimer = setTimeout(() => {
      setVisible(false)
    }, 8000)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
      audio.pause()
    }
  }, [])

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted
      setMuted(!muted)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 left-6 z-50 flex items-center gap-3 glass-card px-4 py-3 rounded-2xl border border-white/10 shadow-lg shadow-purple-500/10"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <p className="text-sm text-muted-foreground font-medium">
            <span className="text-cyan-400">JARVIS</span> — Starlight AI Online
          </p>
          <button
            onClick={toggleMute}
            className="text-muted-foreground hover:text-foreground transition-colors ml-1"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
