'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { SectionHeader } from './section-header'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/reveal'

const principles = [
  { title: 'Built around your workflow', body: 'We don’t sell a chatbot in a box. Every system starts with how your team actually takes calls, leads, and bookings.' },
  { title: 'Guardrails first', body: 'Clear escalation paths, approved answers only, and full logs. Your AI represents your brand, it behaves like it.' },
  { title: 'Measured in outcomes', body: 'Missed calls recovered, response time, booked appointments. If a metric doesn’t move, we keep iterating.' },
]

export function About({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' } = {}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <section id="about" ref={ref} className="relative mx-auto max-w-7xl px-6 py-28 md:py-40">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="relative">
          <div className="sticky top-32 overflow-hidden rounded-[2rem] border border-border">
            <motion.div style={reduced ? undefined : { y: imgY }} className="relative aspect-[4/5] scale-110">
              <Image
                src="/images/starlight-logo.png"
                alt="Starlight AI brand mark"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
            </motion.div>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <motion.div
              aria-hidden
              style={reduced ? undefined : { rotate }}
              className="absolute bottom-6 right-6 flex size-28 items-center justify-center rounded-full border border-border bg-background/70 backdrop-blur"
            >
              <svg viewBox="0 0 100 100" className="size-full p-1 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                <defs>
                  <path id="circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text fill="currentColor">
                  <textPath href="#circle">Starlight AI · Automation Studio · </textPath>
                </text>
              </svg>
            </motion.div>
          </div>
        </div>

        <div>
          <SectionHeader headingLevel={headingLevel}
            eyebrow="About Starlight AI"
            title="A small studio obsessed with the unglamorous work."
            description="Starlight AI started with a simple observation: most businesses don’t lose customers because of bad products. They lose them in the gaps, the unanswered call, the lead that waited a day, the follow-up nobody sent. We build AI systems that close those gaps for good."
          />

          <StaggerGroup className="mt-14 space-y-10" delay={0.12}>
            {principles.map((p, i) => (
              <StaggerItem key={p.title} className="grid gap-4 border-t border-border pt-8 sm:grid-cols-[auto_1fr] sm:gap-8">
                <span className="font-mono text-sm text-primary">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-14 rounded-3xl bg-surface p-8" delay={0.1}>
            <p className="font-display text-xl font-semibold leading-snug tracking-tight md:text-2xl">
              “Our mission is simple: give every business a front desk, a sales assistant, and a support team that never
              sleeps, and never forgets to follow up.”
            </p>
            <p className="mt-4 text-sm text-muted-foreground">The Starlight AI team</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
