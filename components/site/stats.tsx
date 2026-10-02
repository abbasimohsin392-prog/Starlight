'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion, animate } from 'framer-motion'
import { stats } from '@/lib/data'
import { StaggerGroup, StaggerItem } from '@/components/motion/reveal'

function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!inView || reduced) return
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, reduced])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section aria-label="Key results" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <StaggerGroup className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4" delay={0.1}>
        {stats.map((s) => (
          <StaggerItem key={s.label} className="bg-background p-8 md:p-10">
            <p className="font-display text-gradient text-5xl font-bold tracking-tight md:text-6xl">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.label}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}
