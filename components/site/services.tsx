'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { services } from '@/lib/data'
import { SectionHeader } from './section-header'
import { StaggerGroup, StaggerItem, ease } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

export function Services() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const current = services[active]

  return (
    <section id="services" className="relative mx-auto max-w-7xl px-6 py-28 md:py-40">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeader
            eyebrow="What we build"
            title="AI systems that work the front desk, the inbox, and the follow-up."
            description="Six core systems. Every one designed around your real workflow, trained on your business, and connected to the tools you already use."
          />

          <div className="sticky top-32 mt-12 hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.index}
                initial={reduced ? false : { opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease }}
                className="rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur"
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{current.index} / {current.title}</p>
                <p className="font-display mt-4 text-2xl font-bold tracking-tight">{current.tagline}</p>
                <p className="mt-4 leading-relaxed text-muted-foreground">{current.description}</p>
                <ul className="mt-6 space-y-2">
                  {current.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check className="size-3" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <StaggerGroup className="divide-y divide-border border-y border-border" delay={0.07}>
          {services.map((s, i) => {
            const isActive = active === i
            return (
              <StaggerItem key={s.index}>
                <article
                  className="group relative"
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={isActive}
                    aria-controls={`service-${s.index}`}
                    className="relative flex w-full items-center justify-between gap-6 py-7 text-left"
                  >
                    <motion.span
                      aria-hidden
                      className="absolute inset-y-0 -left-4 -right-4 -z-10 rounded-2xl bg-surface"
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="flex items-baseline gap-5">
                      <span className="font-mono text-xs text-muted-foreground">{s.index}</span>
                      <span
                        className={cn(
                          'font-display text-2xl font-bold tracking-tight transition-colors md:text-4xl',
                          isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground',
                        )}
                      >
                        {s.title}
                      </span>
                    </span>
                    <motion.span
                      animate={{ rotate: isActive ? 45 : 0, scale: isActive ? 1.1 : 1 }}
                      transition={{ duration: 0.35, ease }}
                      className={cn(
                        'flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors',
                        isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                      )}
                    >
                      <ArrowUpRight className="size-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        id={`service-${s.index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease }}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="pb-7 pl-10">
                          <p className="font-semibold">{s.tagline}</p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {s.bullets.map((b) => (
                              <li key={b} className="rounded-full border border-border px-3 py-1 text-xs">
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
