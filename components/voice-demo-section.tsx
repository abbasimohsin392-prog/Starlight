"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, PhoneOff } from "lucide-react"

type Line = { speaker: "ai" | "caller"; text: string }

const SCRIPT: Line[] = [
  { speaker: "ai", text: "Thank you for calling Sunset Realty, this is your AI assistant. How can I help you today?" },
  { speaker: "caller", text: "Hi, I saw the 3-bedroom listing on Palm Street. Is it still available?" },
  { speaker: "ai", text: "Yes, it's still available. I can schedule a viewing — are you free this Thursday at 4 PM?" },
  { speaker: "caller", text: "Yes, that works for me." },
  { speaker: "ai", text: "Perfect, you're booked for Thursday at 4 PM. I've sent a confirmation text with the address. Anything else?" },
  { speaker: "caller", text: "No, that's it. Thanks!" },
  { speaker: "ai", text: "You're welcome, have a great day!" },
]

export function VoiceDemoSection() {
  const [status, setStatus] = useState<"idle" | "calling" | "done">("idle")
  const [visible, setVisible] = useState<Line[]>([])
  const [speaking, setSpeaking] = useState(false)
  const stopRef = useRef(false)

  const startCall = async () => {
    stopRef.current = false
    setStatus("calling")
    setVisible([])
    for (const line of SCRIPT) {
      if (stopRef.current) return
      await new Promise((r) => setTimeout(r, 700))
      if (stopRef.current) return
      setVisible((v) => [...v, line])
      if (line.speaker === "ai" && "speechSynthesis" in window) {
        setSpeaking(true)
        await new Promise<void>((resolve) => {
          const utter = new SpeechSynthesisUtterance(line.text)
          utter.rate = 1.02
          utter.pitch = 1.0
          const voices = window.speechSynthesis.getVoices()
          const preferred = voices.find((v) => /Samantha|Google US English|Female/i.test(v.name))
          if (preferred) utter.voice = preferred
          utter.onend = () => resolve()
          utter.onerror = () => resolve()
          window.speechSynthesis.speak(utter)
        })
        setSpeaking(false)
      } else {
        await new Promise((r) => setTimeout(r, Math.min(2600, line.text.length * 45)))
      }
    }
    if (!stopRef.current) setStatus("done")
  }

  const endCall = () => {
    stopRef.current = true
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    setStatus("idle")
    setVisible([])
  }

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="section-head" style={{ justifyContent: "center", textAlign: "center" }}>
        <span className="eyebrow">HEAR IT WORK</span>
        <h2>Press play. Listen to a real call.</h2>
        <p className="section-intro" style={{ maxWidth: 480, margin: "16px auto 0" }}>
          This is a simulated call script with real synthesized voice — a preview of how your AI receptionist sounds and thinks. Your live version listens and responds to real callers in real time.
        </p>
      </div>

      <div className="glass-card chat-demo" style={{ maxWidth: 480, margin: "0 auto" }}>
        <div className="chat-head">
          <div className="chat-avatar"><Phone size={16} color="#fff" /></div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>Sunset Realty — AI Receptionist</p>
            <p style={{ fontSize: 11, color: "var(--muted)", margin: "2px 0 0" }}>
              {status === "idle" && "Ready to call"}
              {status === "calling" && (speaking ? "Speaking..." : "Listening...")}
              {status === "done" && "Call ended"}
            </p>
          </div>
          {status === "calling" && <span className="chat-dot" style={{ marginLeft: "auto", animation: "pulse 1.2s infinite" }} />}
        </div>

        <div className="chat-body" style={{ minHeight: 260 }}>
          <AnimatePresence>
            {visible.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`bubble ${line.speaker === "ai" ? "bot" : "user"}`}
              >
                {line.text}
              </motion.div>
            ))}
          </AnimatePresence>
          {status === "idle" && (
            <p style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", marginTop: 60 }}>
              Click below to start the simulated call.
            </p>
          )}
        </div>

        <div style={{ padding: "14px 18px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "center" }}>
          {status !== "calling" ? (
            <button onClick={startCall} className="inline-flex primary" style={{ borderRadius: 999, padding: "12px 26px", fontSize: 14, border: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Phone size={15} /> {status === "done" ? "Play Again" : "Start Call"}
            </button>
          ) : (
            <button onClick={endCall} className="inline-flex" style={{ borderRadius: 999, padding: "12px 26px", fontSize: 14, border: "1px solid var(--line)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#f87171" }}>
              <PhoneOff size={15} /> End Call
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
