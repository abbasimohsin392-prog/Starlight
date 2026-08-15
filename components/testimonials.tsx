'use client'

import { motion, type Variants } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const TESTIMONIALS = [
  {
    quote:
      'The site does in eight seconds what our old deck took twenty slides to say. People remember it.',
    name: 'Mara Ellison',
    role: 'Founder, Halide Labs',
  },
  {
    quote:
      'Every agency promises craft. This is the first time the shipped build was better than the concept reel.',
    name: 'Deniz Okafor',
    role: 'VP Brand, Northray',
  },
  {
    quote:
      'They treated performance like a design constraint, not an afterthought. Sixty frames, every scroll.',
    name: 'June Park',
    role: 'Head of Product, Wavelength',
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

export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="relative">
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
            Testimonials
          </motion.p>
          <motion.h2
            id="testimonials-heading"
            variants={item}
            className="text-balance font-sans text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Words from <span className="text-primary">the other side</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.figure
              key={testimonial.name}
              variants={item}
              className="flex flex-col justify-between gap-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_0_40px_-15px_rgba(139,92,246,0.35)]"
            >
              <blockquote className="text-pretty leading-relaxed text-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{testimonial.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{testimonial.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
