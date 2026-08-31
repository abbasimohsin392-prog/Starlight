"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, X } from "lucide-react"

export function LiveDemoPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("demo-popup-seen")) return
    const t = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem("demo-popup-seen", "1")
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="glass-card"
          style={{
            position: "fixed",
            right: 20,
            bottom: 100,
            width: 280,
            padding: "18px 18px 16px",
            zIndex: 80,
          }}
        >
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            style={{ position: "absolute", top: 10, right: 10, background: "none", border: 0, color: "var(--muted)", cursor: "pointer", display: "flex" }}
          >
            <X size={15} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div className="chat-avatar" style={{ width: 32, height: 32 }}><Phone size={14} color="#fff" /></div>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Hear it in action</p>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5, margin: "0 0 14px" }}>
            Press play and listen to a real AI receptionist book an appointment — takes 30 seconds.
          </p>
          <a
            href="/demo"
            onClick={dismiss}
            className="inline-flex primary"
            style={{ display: "block", textAlign: "center", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontWeight: 500 }}
          >
            See Live Demo →
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
