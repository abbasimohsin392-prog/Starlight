'use client'

import { motion, type Variants } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const SERVICES = [
  {
    title: 'Interaction design',
    description:
      'Interfaces choreographed around intent — every hover, drag, and transition earns its place.',
  },
  {
    title: 'Creative development',
    description:
      'Production-grade builds where the motion layer is engineered, not bolted on afterwards.',
  },
  {
    title: 'Brand systems',
    description:
      'Identities that move — type, color, and rhythm designed to hold up in motion as well as print.',
  },
  {
    title: 'Immersive 3D',
    description:
      'Real-time scenes and spatial moments that pull people into the story without pulling frame rates down.',
  },
]

const listContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const listItem: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
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

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="relative">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
        {/* Section header */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mb-16 flex max-w-2xl flex-col gap-4"
        >
          <motion.p
            variants={headingReveal}
            className="font-mono text-xs uppercase tracking-[0.3em] text-accent"
          >
            Services
          </motion.p>
          <motion.h2
            id="services-heading"
            variants={headingReveal}
            className="text-balance font-sans text-3xl font-semibold tracking-tight md:text-5xl"
          >
            What we <span className="text-primary">do</span>
          </motion.h2>
          <motion.p
            variants={headingReveal}
            className="text-pretty leading-relaxed text-muted-foreground"
          >
            Four disciplines, one obsession: work that feels as good as it looks.
          </motion.p>
        </motion.div>

        {/* Service rows */}
        <motion.ul
          variants={listContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col"
        >
          {SERVICES.map((service, i) => (
            <motion.li
              key={service.title}
              variants={listItem}
              data-cursor-hover
              className="group flex flex-col gap-3 border-t border-border py-8 transition-colors last:border-b hover:bg-card md:flex-row md:items-baseline md:gap-12 md:px-4"
            >
              <span className="font-mono text-sm text-muted-foreground md:w-16">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-sans text-xl font-medium tracking-tight transition-colors group-hover:text-primary md:w-64 md:text-2xl">
                {service.title}
              </h3>
              <p className="max-w-md text-pretty leading-relaxed text-muted-foreground md:flex-1">
                {service.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
