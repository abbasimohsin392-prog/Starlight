'use client'

import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion'

const HEADLINE_LINES = [
  ['Design', 'in', 'motion.'],
  ['Built', 'to', 'be', 'felt.'],
]

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const word: Variants = {
  hidden: { y: '110%', rotate: 3 },
  visible: {
    y: '0%',
    rotate: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.9 },
  },
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const panelY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Mouse-driven 3D tilt
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  })

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden"
      aria-label="Intro"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:gap-16">
        {/* Copy */}
        <motion.div
          style={{ y: textY, opacity: fade }}
          className="flex flex-1 flex-col items-start gap-6"
        >
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-mono text-xs uppercase tracking-[0.3em] text-accent"
          >
            Creative studio
          </motion.p>

          <motion.h1
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-balance font-sans text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
          >
            {HEADLINE_LINES.map((line, i) => (
              <span key={i} className="block">
                {line.map((w, j) => (
                  <span
                    key={j}
                    className="inline-block overflow-hidden pb-1 align-bottom"
                  >
                    <motion.span
                      variants={word}
                      className={
                        'inline-block will-change-transform' +
                        (w === 'motion.' ? ' text-primary' : '') +
                        (w === 'felt.' ? ' text-accent' : '')
                      }
                    >
                      {w}
                    </motion.span>
                    {j < line.length - 1 && <span>&nbsp;</span>}
                  </span>
                ))}
              </span>
            ))}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="max-w-md text-pretty leading-relaxed text-muted-foreground"
          >
            We craft immersive digital experiences where every scroll, hover,
            and transition is deliberate.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4"
          >
            <a
              href="#work"
              data-cursor-hover
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              See the work
            </a>
            <a
              href="#contact"
              data-cursor-hover
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Get in touch
            </a>
          </motion.div>
        </motion.div>

        {/* Parallax 3D panel */}
        <motion.div
          style={{ y: panelY, opacity: fade }}
          className="flex flex-1 items-center justify-center"
          aria-hidden="true"
        >
          <div style={{ perspective: 1200 }}>
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative h-72 w-72 md:h-96 md:w-96"
            >
              {/* Ambient glow field behind everything */}
              <div className="absolute -inset-16 -z-10 rounded-full bg-primary/25 blur-[100px]" />
              <div className="absolute -inset-10 -z-10 rounded-full bg-accent/15 blur-[80px]" />

              {/* Outer glass ring */}
              <motion.div
                style={{ transform: 'translateZ(0px)' }}
                className="absolute inset-0 rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_60px_-10px_rgba(139,92,246,0.4)]"
              />
              {/* Mid glass panel */}
              <motion.div
                style={{ transform: 'translateZ(50px)' }}
                className="absolute inset-8 rounded-2xl border border-white/10 bg-gradient-to-br from-primary/15 via-white/[0.02] to-accent/10 backdrop-blur-xl"
              />
              {/* Inner glowing core */}
              <motion.div
                style={{ transform: 'translateZ(100px)' }}
                className="absolute inset-20 rounded-full bg-gradient-to-br from-primary via-primary/70 to-accent shadow-[0_0_60px_10px_rgba(139,92,246,0.5)]"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Orbiting accent dot */}
              <motion.div
                style={{ transform: 'translateZ(150px)' }}
                className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_20px_4px_rgba(79,157,224,0.8)]"
                animate={{
                  x: [0, 60, 0, -60, 0],
                  y: [-60, 0, 60, 0, -60],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
