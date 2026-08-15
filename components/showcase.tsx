'use client'

import { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type Variants,
} from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const CHAPTERS = [
  {
    index: '01',
    title: 'Concept',
    description:
      'Every build starts as a narrative. We map the scroll like a storyboard — what the visitor sees, when, and why — before a single pixel moves.',
    accent: 'primary' as const,
    stat: 'Story first',
  },
  {
    index: '02',
    title: 'Choreography',
    description:
      'Motion is scored to the scroll. Entrances, parallax layers, and handoffs are timed against Lenis velocity so the page feels conducted, not animated.',
    accent: 'accent' as const,
    stat: 'Scroll-scored',
  },
  {
    index: '03',
    title: 'Craft',
    description:
      'Transforms and opacity only. GPU-composited layers, reduced-motion fallbacks, and zero layout thrash — the polish survives on real devices.',
    accent: 'primary' as const,
    stat: '60fps budget',
  },
  {
    index: '04',
    title: 'Launch',
    description:
      'Production Next.js with real SEO, real performance budgets, and a design-token system that lets the whole site restyle from one file.',
    accent: 'accent' as const,
    stat: 'Ship-ready',
  },
]

const chapterReveal: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, staggerChildren: 0.1 },
  },
}

const chapterChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export function Showcase() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  // Map overall progress to the active chapter for the pinned panel
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(
      CHAPTERS.length - 1,
      Math.floor(v * CHAPTERS.length),
    )
    setActive(next)
  })

  // Pinned visual: ring rotates and inner core scales with scroll
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 270])
  const coreScale = useTransform(scrollYProgress, [0, 1], [0.75, 1.1])
  const progressScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  const chapter = CHAPTERS[active]

  return (
    <section id="showcase" aria-labelledby="showcase-heading" className="relative">
      {/* Tall scroll track — its height creates the pin duration */}
      <div ref={trackRef} className="relative mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          {/* Pinned side */}
          <div className="lg:w-1/2">
            <div className="lg:sticky lg:top-16 flex flex-col justify-center gap-10 py-24 md:py-32 lg:h-[calc(100vh-4rem)] lg:py-0">
              <div className="flex flex-col gap-4">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                  The process
                </p>
                <h2
                  id="showcase-heading"
                  className="text-balance font-sans text-3xl font-semibold tracking-tight md:text-5xl"
                >
                  One idea,{' '}
                  <span className="text-primary">held in place</span>
                </h2>
                <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
                  This panel stays pinned while the chapters scroll past.
                  Watch it react to where you are in the story.
                </p>
              </div>

              {/* Reactive pinned visual */}
              <div
                aria-hidden="true"
                className="relative flex h-56 items-center justify-center md:h-64"
              >
                {/* Rotating ring */}
                <motion.div
                  style={prefersReducedMotion ? undefined : { rotate: ringRotate }}
                  className="absolute h-48 w-48 rounded-full border border-border md:h-56 md:w-56"
                >
                  <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary" />
                  <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent" />
                </motion.div>

                {/* Scaling core that recolors per chapter */}
                <motion.div
                  style={prefersReducedMotion ? undefined : { scale: coreScale }}
                  className={
                    'flex h-28 w-28 items-center justify-center rounded-full border transition-colors duration-700 md:h-32 md:w-32 ' +
                    (chapter.accent === 'primary'
                      ? 'border-primary/40 bg-primary/10'
                      : 'border-accent/40 bg-accent/10')
                  }
                >
                  <motion.span
                    key={chapter.index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className={
                      'font-mono text-2xl font-semibold tracking-tight ' +
                      (chapter.accent === 'primary' ? 'text-primary' : 'text-accent')
                    }
                  >
                    {chapter.index}
                  </motion.span>
                </motion.div>

                {/* Ambient glow follows the accent */}
                <div
                  className={
                    'pointer-events-none absolute h-40 w-40 rounded-full blur-3xl transition-colors duration-700 ' +
                    (chapter.accent === 'primary' ? 'bg-primary/15' : 'bg-accent/15')
                  }
                />
              </div>

              {/* Chapter meta + progress rail */}
              <div className="flex items-center gap-6">
                <div
                  aria-hidden="true"
                  className="relative h-16 w-px overflow-hidden bg-border"
                >
                  <motion.div
                    style={{ scaleY: progressScaleY }}
                    className="absolute inset-0 origin-top bg-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <motion.p
                    key={chapter.title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="font-sans text-lg font-medium tracking-tight"
                  >
                    {chapter.title}
                  </motion.p>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {chapter.stat}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling side — chapters pass the pinned panel */}
          <div className="flex flex-col lg:w-1/2">
            {CHAPTERS.map((item) => (
              <motion.article
                key={item.index}
                variants={chapterReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="flex min-h-[70vh] flex-col justify-center gap-5 border-b border-border py-16 last:border-b-0 lg:min-h-screen"
              >
                <motion.p
                  variants={chapterChild}
                  className={
                    'font-mono text-sm tracking-[0.3em] ' +
                    (item.accent === 'primary' ? 'text-primary' : 'text-accent')
                  }
                >
                  {item.index}
                </motion.p>
                <motion.h3
                  variants={chapterChild}
                  className="text-balance font-sans text-2xl font-semibold tracking-tight md:text-4xl"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  variants={chapterChild}
                  className="max-w-md text-pretty leading-relaxed text-muted-foreground"
                >
                  {item.description}
                </motion.p>
                <motion.div
                  variants={chapterChild}
                  data-cursor-hover
                  className={
                    'inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors ' +
                    (item.accent === 'primary'
                      ? 'border-primary/40 text-primary'
                      : 'border-accent/40 text-accent')
                  }
                >
                  <span
                    className={
                      'h-1.5 w-1.5 rounded-full ' +
                      (item.accent === 'primary' ? 'bg-primary' : 'bg-accent')
                    }
                  />
                  {item.stat}
                </motion.div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
