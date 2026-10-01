'use client'

import { motion, type Variants, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const ease = [0.16, 1, 0.3, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

export const stagger = (delay = 0.08, start = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: start } },
})

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
  amount?: number
  as?: 'div' | 'section' | 'li' | 'p' | 'span' | 'h2' | 'h3'
}

export function Reveal({ children, className, delay = 0, once = true, amount = 0.3, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion()
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: { opacity: 0, y: 32 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay } },
      }}
    >
      {children}
    </Comp>
  )
}

export function StaggerGroup({
  children,
  className,
  delay = 0.08,
  start = 0,
  amount = 0.2,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  start?: number
  amount?: number
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={stagger(delay, start)}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  )
}

/** Splits text into words and animates each one rising from a clipped line. */
export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  step = 0.05,
  as: Tag = 'span',
  inView = false,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  step?: number
  as?: 'span' | 'h1' | 'h2' | 'p'
  inView?: boolean
}) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  const MotionTag = motion[Tag]
  return (
    <MotionTag
      className={cn('inline', className)}
      aria-label={text}
      initial={reduced ? false : 'hidden'}
      {...(inView ? { whileInView: 'show', viewport: { once: true, amount: 0.5 } } : { animate: 'show' })}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
          <motion.span
            aria-hidden
            className={cn('inline-block will-change-transform', wordClassName)}
            variants={{
              hidden: { y: '110%', rotate: 4 },
              show: { y: 0, rotate: 0, transition: { duration: 0.9, ease } },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span aria-hidden>&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  )
}
