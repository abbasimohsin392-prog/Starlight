"use client"

import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Globe, Bot } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const springConfig = { stiffness: 80, damping: 25, restDelta: 0.001 }

const niches = [
  "Real Estate", "Dental Clinics", "E-commerce", "Law Firms",
  "Restaurants", "Healthcare", "Finance", "Retail",
  "SaaS", "Logistics", "Education", "Hospitality",
]

const rotatingWords = ["Automates", "Scales", "Transforms", "Elevates", "Powers"]

const floatingOrbs = [
  { size: 300, x: "10%", y: "20%", color: "from-purple-500/20 to-transparent", delay: 0 },
  { size: 250, x: "75%", y: "10%", color: "from-cyan-500/15 to-transparent", delay: 1.5 },
  { size: 200, x: "60%", y: "65%", color: "from-purple-400/10 to-transparent", delay: 3 },
  { size: 180, x: "20%", y: "70%", color: "from-cyan-400/10 to-transparent", delay: 2 },
]

function useMouseParallax() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener("mousemove", handler)
    return () => window.removeEventListener("mousemove", handler)
  }, [])
  return mouse
}

export function HeroSection() {
  const { scrollY } = useScroll()
  const rawY = useTransform(scrollY, [0, 600], [0, -100])
  const smoothY = useSpring(rawY, springConfig)
  const rawOpacity = useTransform(scrollY, [0, 350], [1, 0])
  const smoothOpacity = useSpring(rawOpacity, springConfig)
  const rawScale = useTransform(scrollY, [0, 400], [1, 0.96])
  const smoothScale = useSpring(rawScale, springConfig)

  const [wordIndex, setWordIndex] = useState(0)
  const mouse = useMouseParallax()

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
      {floatingOrbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-radial ${orb.color} blur-3xl pointer-events-none`}
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{ x: [0, 30, -20, 0], y: [0, -25, 20, 0], scale: [1, 1.08, 0.95, 1] }}
          transition={{ duration: 10 + i * 2, delay: orb.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: mouse.x * -15, y: mouse.y * -15 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-cyan-400/40 blur-sm" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-purple-400/40 blur-sm" />
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 rounded-full bg-cyan-300/30 blur-sm" />
      </motion.div>

      <motion.div
        style={{ y: smoothY, opacity: smoothOpacity, scale: smoothScale }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full mb-8 border border-white/10"
          >
            <motion.div
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </motion.div>
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
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 text-balance max-w-5xl"
          >
            The AI Agency That{" "}
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="gradient-text inline-block"
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            Your Business
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-muted-foreground mb-4 max-w-2xl leading-relaxed"
          >
            From AI chatbots to full workflow automation & custom websites —
            we build intelligent systems for businesses of every niche.
            <span className="text-foreground font-medium"> Up and running in weeks, not months.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {[
              { icon: Bot, label: "AI Chatbots" },
              { icon: Globe, label: "Custom Websites" },
              { icon: Zap, label: "Workflow Automation" },
            ].map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-1.5 glass-card px-4 py-2 rounded-full border border-white/10 text-sm text-muted-foreground cursor-default"
              >
                <Icon className="h-3.5 w-3.5 text-cyan-400" />
                {label}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-2 mb-10 max-w-3xl"
          >
            {niches.map((niche, i) => (
              <motion.span
                key={niche}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(139, 92, 246, 0.15)",
                  borderColor: "rgba(139, 92, 246, 0.4)",
                  transition: { duration: 0.18 },
                }}
                className="glass-card px-3 py-1 rounded-full text-xs text-muted-foreground border border-white/10 cursor-default transition-colors"
              >
                {niche}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <a href="mailto:hello@starlightai.site">
                <Button
                  size="lg"
                  className="btn-glow btn-pulse bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-foreground font-semibold px-8 py-6 text-lg shadow-lg shadow-purple-500/25"
                >
                  Book a Free Strategy Call
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </a>
            </motion.div>

            <Link href="/services">
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-outline-glow border-border hover:bg-secondary/50 px-8 py-6 text-lg w-full"
                >
                  See What We Build
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.82, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-8 sm:gap-16 border-t border-white/5 pt-10 w-full max-w-3xl"
          >
            {[
              { value: "80%", label: "Faster response times" },
              { value: "24/7", label: "Always-on AI systems" },
              { value: "2 weeks", label: "Average setup time" },
              { value: "$799", label: "One-time, no monthly fees" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.88 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="text-center cursor-default"
              >
                <motion.div
                  className="text-2xl sm:text-3xl font-bold gradient-text"
                  animate={{ opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </section>
  )
}
