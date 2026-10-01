'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { systems } from '@/lib/data'
import { SectionHeader } from './section-header'
import { StaggerGroup, StaggerItem, ease } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

export function Systems() {
  const reduced = useReducedMotion()

  return (
    <section id="systems" className="mx-auto max-w-7xl px-6 py-28 md:py-40">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="AI systems"
          title="Built for real businesses, not demos."
          description="Sample automation systems modeled on the industries we serve. Each one is a blueprint we tailor to your operations."
        />
        <a
          href="#contact"
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary"
        >
          Request a system like this
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      <StaggerGroup className="mt-16 grid gap-6 md:grid-cols-2" delay={0.12}>
        {systems.map((sys, i) => (
          <StaggerItem key={sys.title} className={cn(i % 2 === 1 && 'md:translate-y-16')}>
            <motion.article
              data-cursor="view"
              data-cursor-label="View"
              whileHover={reduced ? undefined : 'hover'}
              initial="rest"
              animate="rest"
              className="group relative overflow-hidden rounded-3xl border border-border bg-surface"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <motion.div
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
                  transition={{ duration: 0.9, ease }}
                  className="absolute inset-0"
                >
                  <Image
                    src={sys.image}
                    alt={`${sys.title}: ${sys.description}`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </motion.div>
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />

                <motion.div
                  aria-hidden
                  variants={{ rest: { y: '100%' }, hover: { y: 0 } }}
                  transition={{ duration: 0.6, ease }}
                  className="absolute inset-x-0 bottom-0 bg-primary p-6 text-primary-foreground"
                >
                  <p className="text-sm leading-relaxed">{sys.description}</p>
                </motion.div>

                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white backdrop-blur">
                  {sys.category}
                </span>
              </div>

              <div className="flex items-start justify-between gap-6 p-6 md:p-7">
                <div className="overflow-hidden">
                  <motion.h3
                    variants={{ rest: { y: 0 }, hover: { y: -4 } }}
                    transition={{ duration: 0.5, ease }}
                    className="font-display text-2xl font-bold tracking-tight md:text-3xl"
                  >
                    {sys.title}
                  </motion.h3>
                  <p className="mt-2 text-sm text-muted-foreground md:hidden">{sys.description}</p>
                </div>
                <p className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary">
                  {sys.result}
                </p>
              </div>
            </motion.article>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}
