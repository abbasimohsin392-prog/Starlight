'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { SplitWords, ease } from '@/components/motion/reveal'
import { Magnetic } from '@/components/motion/magnetic'
import { AutomationFlow } from './automation-flow'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const introDelay = 0.4

  return (
    <section
      id="hero"
      ref={ref}
      className="noise relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-32 pb-24"
    >
      <motion.div aria-hidden style={reduced ? undefined : { y: bgY }} className="grid-fade absolute inset-0" />
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: glowY }}
        className="absolute left-1/2 top-[-10%] h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-3xl"
      />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: fade }}
        className="relative mx-auto grid w-full max-w-7xl gap-16 px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-8"
      >
        <div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: introDelay }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-border bg-surface/60 py-1.5 pl-2 pr-4 text-sm backdrop-blur"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-muted-foreground">
              Accepting <span className="font-semibold text-foreground">3 new clients</span> this month
            </span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.75rem,7.5vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            <SplitWords text="Answer every lead," delay={introDelay + 0.1} />
            <br />
            <SplitWords text="in under a" delay={introDelay + 0.25} />{' '}
            <SplitWords text="minute." className="text-gradient" delay={introDelay + 0.4} />
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: introDelay + 0.7 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Starlight AI builds AI receptionists, chatbots, and WhatsApp agents that answer, qualify, book, and follow up
            for your business 24/7, so no enquiry waits and no lead goes cold.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: introDelay + 0.85 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href="#contact"
                className="glow-primary group inline-flex h-14 items-center gap-3 rounded-full bg-primary pl-7 pr-2 text-base font-semibold text-primary-foreground"
              >
                Book a strategy call
                <span className="flex size-10 items-center justify-center rounded-full bg-background/20 transition-transform group-hover:translate-x-1">
                  <ArrowRight className="size-4" />
                </span>
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href="#systems"
                className="inline-flex h-14 items-center rounded-full border border-border bg-surface/40 px-7 text-base font-semibold backdrop-blur transition-colors hover:border-foreground/40"
              >
                See the systems
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: introDelay + 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-60 blur-2xl" aria-hidden />
          <div className="relative rounded-[2rem] border border-border bg-surface/40 p-6 backdrop-blur-sm md:p-8">
            <div className="mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span>Live automation</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400" /> Running
              </span>
            </div>
            <AutomationFlow />
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#services"
        aria-label="Scroll to services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: introDelay + 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground md:flex"
      >
        Scroll
        <motion.span animate={reduced ? undefined : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <ArrowDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  )
}
