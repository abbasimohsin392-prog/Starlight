"use client"

import { motion, useReducedMotion } from "framer-motion"

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const metrics = [
  { value: "4–8", unit: "days", label: "Discovery to launch" },
  { value: "24", unit: "/7", label: "AI uptime, every channel" },
  { value: "<60", unit: "sec", label: "Average first response" },
  { value: "12+", unit: "", label: "Industries live" },
]

/**
 * Cinematic, restrained proof section. One signature moment — a signal
 * line that draws itself once, left to right — everything else is the
 * same quiet blur+rise reveal used across the rest of the page, just
 * slowed down and staggered for a heavier, more deliberate feel.
 */
export function WorkPerformanceSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden" aria-label="Our work, in numbers">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-500/[0.04] blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-center mb-20 sm:mb-28"
        >
          <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">The Work</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-balance">
            Built to Perform, <span className="gradient-text">Not Just Impress</span>
          </h2>
        </motion.div>

        <div className="relative">
          <svg
            viewBox="0 0 1000 2"
            preserveAspectRatio="none"
            className="w-full h-[2px] hidden sm:block overflow-visible"
            aria-hidden="true"
          >
            <line x1="0" y1="1" x2="1000" y2="1" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
            <motion.line
              x1="0"
              y1="1"
              x2="1000"
              y2="1"
              stroke="url(#signalGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={
                reduceMotion ? { duration: 0.01 } : { duration: 1.6, ease: EASE, delay: 0.15 }
              }
            />
            <defs>
              <linearGradient id="signalGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="55%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-6 mt-10 sm:mt-14">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={
                  reduceMotion
                    ? { duration: 0.2 }
                    : { duration: 0.8, ease: EASE, delay: 0.4 + i * 0.18 }
                }
                className="text-center sm:text-left"
              >
                <div className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                  {m.value}
                  <span className="text-base text-muted-foreground ml-0.5">{m.unit}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-2">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
