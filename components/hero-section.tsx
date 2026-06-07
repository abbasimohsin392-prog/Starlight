"use client"

import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Globe, Bot } from "lucide-react"
import { useEffect, useState } from "react"

const niches = [
  "Real Estate", "Dental Clinics", "E-commerce", "Law Firms",
  "Restaurants", "Healthcare", "Finance", "Retail",
  "SaaS", "Logistics", "Education", "Hospitality",
]

const rotatingWords = ["Automates", "Scales", "Transforms", "Elevates", "Powers"]

export function HeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, -80])
  const opacity = useTransform(scrollY, [0, 350], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.97])

  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      <div className="absolute w-[300px] h-[300px] rounded-full bg-purple-500/15 blur-3xl pointer-events-none" style={{ left: "10%", top: "20%" }} />
      <div className="absolute w-[250px] h-[250px] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" style={{ left: "75%", top: "10%" }} />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-purple-400/8 blur-3xl pointer-events-none" style={{ left: "60%", top: "65%" }} />

      <motion.div
        style={{ y, opacity, scale }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full mb-8 border border-white/10"
          >
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-muted-foreground tracking-wide">
              AI Systems for Every Business & Industry
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
            The AI Agency That{" "}
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
            Your Business
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-muted-foreground mb-4 max-w-2xl leading-relaxed"
          >
            From AI chatbots to full workflow automation & custom websites —
            we build intelligent systems for businesses of every niche.
            <span className="text-foreground font-medium"> Up and running in weeks, not months.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {[
              { icon: Bot, label: "AI Chatbots" },
              { icon: Globe, label: "Custom Websites" },
              { icon: Zap, label: "Workflow Automation" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 glass-card px-4 py-2 rounded-full border border-white/10 text-sm text-muted-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-cyan-400" />
                {label}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ dur
