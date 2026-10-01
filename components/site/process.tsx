'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { process } from '@/lib/data'
import { SectionHeader } from './section-header'
import { Reveal } from '@/components/motion/reveal'

export function Process() {
  const ref = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      id="process"
      className="relative overflow-hidden bg-primary text-primary-foreground"
      style={{ clipPath: 'polygon(0 0, 100% 3vw, 100% 100%, 0 calc(100% - 3vw))' }}
    >
      <div aria-hidden className="absolute inset-0 opacity-[0.12] mix-blend-overlay grid-fade" />
      <div aria-hidden className="absolute -right-40 top-20 size-[36rem] rounded-full bg-accent/40 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-36 md:py-48">
        <SectionHeader
          light
          eyebrow="How it works"
          title="Discover. Design. Build. Launch."
          description="A four-step process that takes you from ‘we should automate this’ to a live AI system in about four weeks."
        />

        <ol ref={ref} className="relative mt-20 grid gap-10 md:grid-cols-4 md:gap-6">
          <div aria-hidden className="absolute left-0 top-6 hidden h-px w-full bg-primary-foreground/20 md:block">
            <motion.div style={reduced ? undefined : { scaleX: lineScale }} className="h-full w-full origin-left bg-primary-foreground" />
          </div>
          {process.map((step, i) => (
            <Reveal key={step.step} as="li" delay={i * 0.12} amount={0.4} className="relative">
              <div className="relative mb-8 flex size-12 items-center justify-center rounded-full border border-primary-foreground/40 bg-primary font-mono text-sm">
                {step.step}
                <span aria-hidden className="absolute -inset-2 rounded-full border border-primary-foreground/15" />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground/60">{step.duration}</p>
              <h3 className="font-display mt-3 text-3xl font-bold tracking-tight md:text-4xl">{step.title}</h3>
              <p className="mt-4 leading-relaxed text-primary-foreground/80">{step.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
