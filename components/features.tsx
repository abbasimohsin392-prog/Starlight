'use client'

import { motion, type Variants } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const FEATURES = [
  {
    title: 'Motion with intent',
    description:
      'Every animation maps to a user action or narrative beat. Nothing moves just to move.',
    accent: 'primary' as const,
  },
  {
    title: '60fps or nothing',
    description:
      'Transforms and opacity only on the hot path, GPU-friendly layers, zero layout thrash.',
    accent: 'accent' as const,
  },
  {
    title: 'Accessible by default',
    description:
      'Reduced-motion fallbacks, semantic markup, and keyboard-first flows baked in from the start.',
    accent: 'primary' as const,
  },
  {
    title: 'Scroll as narrative',
    description:
      'Lenis-smoothed scroll drives the story — sections reveal, parallax, and hand off in sequence.',
    accent: 'accent' as const,
  },
  {
    title: 'Design-token driven',
    description:
      'One palette, one type scale, one radius system. Change a token, the whole site follows.',
    accent: 'primary' as const,
  },
  {
    title: 'Built to ship',
    description:
      'Not a prototype. Production Next.js with real routing, SEO, and performance budgets.',
    accent: 'accent' as const,
  },
]

const gridContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const card: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
}

const headingReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
}

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="relative">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
        {/* Section header */}
        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mb-16 flex max-w-2xl flex-col gap-4"
        >
          <motion.p
            variants={headingReveal}
            className="font-mono text-xs uppercase tracking-[0.3em] text-accent"
          >
            Features
          </motion.p>
          <motion.h2
            id="features-heading"
            variants={headingReveal}
            className="text-balance font-sans text-3xl font-semibold tracking-tight md:text-5xl"
          >
            How it <span className="text-accent">feels</span>
          </motion.h2>
          <motion.p
            variants={headingReveal}
            className="text-pretty leading-relaxed text-muted-foreground"
          >
            The principles under the hood of every build we ship.
          </motion.p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.article
              key={feature.title}
              variants={card}
              data-cursor-hover
              className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset] transition-all duration-500 hover:border-primary/40 hover:bg-white/[0.05] hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.35)]"
            >
              <span
                aria-hidden="true"
                className={
                  'h-2 w-2 rounded-full transition-transform duration-500 group-hover:scale-150 ' +
                  (feature.accent === 'primary' ? 'bg-primary' : 'bg-accent')
                }
              />
              <h3 className="font-sans text-lg font-medium tracking-tight">
                {feature.title}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              {/* Hover glow */}
              <div
                aria-hidden="true"
                className={
                  'pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ' +
                  (feature.accent === 'primary' ? 'bg-primary/20' : 'bg-accent/20')
                }
              />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
