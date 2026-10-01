'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Globe, Bot, Database, MessageCircle, Mail, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ease } from '@/components/motion/reveal'

const nodes = [
  { id: 'website', label: 'Website', icon: Globe, x: 8, y: 50, event: 'New visitor asks about pricing' },
  { id: 'agent', label: 'AI Agent', icon: Bot, x: 32, y: 50, event: 'Qualifies lead, answers instantly' },
  { id: 'crm', label: 'CRM', icon: Database, x: 56, y: 22, event: 'Contact created & scored' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, x: 56, y: 50, event: 'Booking confirmation sent' },
  { id: 'email', label: 'Email', icon: Mail, x: 56, y: 78, event: 'Follow-up sequence started' },
  { id: 'customer', label: 'Customer', icon: User, x: 86, y: 50, event: 'Appointment booked. 12 seconds.' },
]

const edges: [string, string][] = [
  ['website', 'agent'],
  ['agent', 'crm'],
  ['agent', 'whatsapp'],
  ['agent', 'email'],
  ['crm', 'customer'],
  ['whatsapp', 'customer'],
  ['email', 'customer'],
]

const order = ['website', 'agent', 'crm', 'whatsapp', 'email', 'customer']

export function AutomationFlow({ className }: { className?: string }) {
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<string | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || hover) return
    const t = setInterval(() => setActive((a) => (a + 1) % order.length), 1600)
    return () => clearInterval(t)
  }, [reduced, hover])

  const current = hover ?? order[active]
  const currentNode = nodes.find((n) => n.id === current)!
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))

  return (
    <div className={cn('relative aspect-[16/10] w-full select-none', className)} role="img" aria-label="Automation flow: Website to AI Agent to CRM, WhatsApp, and Email, then to Customer">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="edge" x1="0" x2="1">
            <stop offset="0" stopColor="oklch(0.72 0.18 240)" />
            <stop offset="1" stopColor="oklch(0.72 0.19 300)" />
          </linearGradient>
        </defs>
        {edges.map(([a, b]) => {
          const from = byId[a]
          const to = byId[b]
          const mx = (from.x + to.x) / 2
          const d = `M ${from.x} ${from.y} C ${mx} ${from.y}, ${mx} ${to.y}, ${to.x} ${to.y}`
          const lit = current === a || current === b
          return (
            <g key={`${a}-${b}`}>
              <path d={d} fill="none" stroke="currentColor" strokeWidth="0.35" className="text-border" vectorEffect="non-scaling-stroke" />
              <motion.path
                d={d}
                fill="none"
                stroke="url(#edge)"
                strokeWidth="0.5"
                strokeDasharray="3 5"
                vectorEffect="non-scaling-stroke"
                className={cn(!reduced && 'animate-flow')}
                animate={{ opacity: lit ? 1 : 0.15 }}
                transition={{ duration: 0.4 }}
              />
            </g>
          )
        })}
      </svg>

      {nodes.map((n) => {
        const Icon = n.icon
        const lit = current === n.id
        return (
          <button
            key={n.id}
            type="button"
            onPointerEnter={() => setHover(n.id)}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(n.id)}
            onBlur={() => setHover(null)}
            aria-label={`${n.label}: ${n.event}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <motion.div
              className={cn(
                'relative flex flex-col items-center gap-2 rounded-2xl border bg-surface/80 px-3 py-3 backdrop-blur-md transition-colors md:px-4',
                lit ? 'border-primary/70' : 'border-border',
              )}
              animate={{ scale: lit ? 1.08 : 1, boxShadow: lit ? '0 0 40px -6px var(--glow)' : '0 0 0px 0px transparent' }}
              transition={{ duration: 0.5, ease }}
            >
              {lit && !reduced && (
                <span aria-hidden className="absolute inset-0 rounded-2xl border border-primary/60 animate-pulse-ring" />
              )}
              <Icon className={cn('size-5 md:size-6', lit ? 'text-primary' : 'text-muted-foreground')} />
              <span className="text-[10px] font-semibold uppercase tracking-wider md:text-xs">{n.label}</span>
            </motion.div>
          </button>
        )
      })}

      <div className="absolute inset-x-0 -bottom-2 flex justify-center md:bottom-0">
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="font-mono rounded-full border border-border bg-surface/80 px-4 py-1.5 text-[11px] text-muted-foreground backdrop-blur md:text-xs"
          >
            <span className="text-primary">▶</span> {currentNode.event}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
