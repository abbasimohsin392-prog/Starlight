'use client'

import { motion, type Variants } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const PLANS = [
  {
    name: 'Sprint',
    price: '$8k',
    cadence: 'one-off engagement',
    description: 'A focused two-week burst for a single page or moment that needs to land.',
    features: ['One signature section', 'Motion & interaction pass', 'Production-ready handoff'],
    featured: false,
  },
  {
    name: 'Studio',
    price: '$24k',
    cadence: 'per project',
    description: 'Full design and build of a complete site, choreographed end to end.',
    features: [
      'Full site design & build',
      'Custom motion system',
      '3D or WebGL moment',
      'Performance budget guarantee',
    ],
    featured: true,
  },
  {
    name: 'Partner',
    price: 'Custom',
    cadence: 'quarterly retainer',
    description: 'An embedded team for brands that ship motion-first work continuously.',
    features: ['Dedicated design & dev pod', 'Unlimited iterations', 'Priority turnaround'],
    featured: false,
  },
]

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
}

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="relative">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mb-12 flex max-w-2xl flex-col gap-3"
        >
          <motion.p
            variants={item}
            className="font-mono text-xs uppercase tracking-[0.3em] text-accent"
          >
            Pricing
          </motion.p>
          <motion.h2
            id="pricing-heading"
            variants={item}
            className="text-balance font-sans text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Simple ways to <span className="text-primary">work together</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {PLANS.map((plan) => (
            <motion.article
              key={plan.name}
              variants={item}
              data-cursor-hover
              className={`relative flex flex-col gap-6 rounded-2xl border p-6 backdrop-blur-xl transition-all duration-500 ${
                plan.featured
                  ? 'border-primary/50 bg-gradient-to-b from-primary/[0.08] to-white/[0.02] shadow-[0_0_60px_-15px_rgba(139,92,246,0.5)]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {plan.name}
                  </h3>
                  {plan.featured && (
                    <span className="rounded-full border border-primary/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                      Most booked
                    </span>
                  )}
                </div>
                <p className="font-sans text-3xl font-semibold tracking-tight">
                  {plan.price}
                  <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                    {plan.cadence}
                  </span>
                </p>
              </div>

              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {plan.description}
              </p>

              <ul className="flex flex-1 flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        plan.featured ? 'bg-primary' : 'bg-accent'
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                data-cursor-hover
                className={`inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                  plan.featured
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-border text-foreground hover:border-primary/40 hover:text-primary'
                }`}
              >
                {plan.price === 'Custom' ? 'Start a conversation' : 'Book this'}
              </a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
