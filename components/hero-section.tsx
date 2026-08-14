"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Bot, PhoneCall, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { InteractiveCore, type CoreMode } from "@/components/interactive-core"

const niches = [
  "Real Estate", "Dental Clinics", "E-commerce", "Law Firms",
  "Restaurants", "Healthcare", "Finance", "Retail",
  "SaaS", "Logistics", "Education", "Hospitality",
]

const rotatingWords = ["Missed Call", "Slow Reply", "Unanswered Message", "Lost Lead"]

const serviceModes: { id: CoreMode; label: string; icon: typeof Bot; glow: string }[] = [
  { id: "chatbots", label: "AI Chatbots", icon: Bot, glow: "34,211,238" },
  { id: "automation", label: "Workflow Automation", icon: Zap, glow: "168,85,247" },
  { id: "marketing", label: "Digital Marketing", icon: TrendingUp, glow: "245,185,66" },
]

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0)
  const [mode, setMode] = useState<CoreMode>("chatbots")

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  const activeGlow = serviceModes.find((m) => m.id === mode)?.glow ?? "34,211,238"

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Ambient glow — recolors with the active service mode */}
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        animate={{ backgroundColor: `rgba(${activeGlow}, 0.16)` }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      />
      <div className="absolute w-[250px] h-[250px] rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" style={{ left: "75%", top: "10%" }} />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-purple-400/6 blur-3xl pointer-events-none" style={{ left: "60%", top: "65%" }} />

      {/* Interactive core — cursor-tilt centerpiece, tucked behind the copy */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-70">
        <InteractiveCore mode={mode} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full mb-8 border border-white/10"
          >
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-muted-foreground tracking-wide">
              AI Automation for Businesses Worldwide
            </span>
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 text-balance max-w-5xl"
          >
            Every{" "}
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="gradient-text inline-block"
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            Is a Client Walking to Your Competitor
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-muted-foreground mb-4 max-w-2xl leading-relaxed"
          >
            AI chatbots that book appointments while you sleep, workflows that fix the bottlenecks costing you customers.
            <span className="text-foreground font-medium"> Built for businesses worldwide, live in weeks.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-3 mb-3"
          >
            {serviceModes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`flex items-center gap-1.5 glass-card px-4 py-2 rounded-full border text-sm transition-colors duration-300 ${
                  mode === id
                    ? "border-white/40 text-foreground bg-white/10"
                    : "border-white/10 text-muted-foreground hover:border-white/25"
                }`}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: mode === id ? "currentColor" : undefined }} />
                {label}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.52 }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8"
          >
            <PhoneCall className="h-3 w-3" />
            AI Receptionist and Custom Websites included with every build
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="flex flex-wrap justify-center gap-2 mb-10 max-w-3xl"
          >
            {niches.map((niche, i) => (
              <motion.span
                key={niche}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.04 }}
                className="glass-card px-3 py-1 rounded-full text-xs text-muted-foreground border border-white/10 cursor-default hover:border-purple-500/40 hover:bg-purple-500/10 transition-colors duration-200"
              >
                {niche}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
          <a href="https://calendly.com/starlightai306/30min" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="btn-glow btn-pulse bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-foreground font-semibold px-8 py-6 text-lg shadow-lg shadow-purple-500/25 transition-transform duration-200 hover:scale-105 hover:-translate-y-0.5"
              >
                Get Your Proposal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="btn-outline-glow border-border hover:bg-secondary/50 px-8 py-6 text-lg w-full transition-transform duration-200 hover:scale-105 hover:-translate-y-0.5"
              >
                See What We Build
              </Button>
            </Link>
          </motion.div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </section>
  )
}
