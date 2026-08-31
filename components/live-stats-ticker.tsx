"use client"

import { useEffect, useState } from "react"

/**
 * Small always-on activity ticker for the hero, three counters that
 * increment continuously on their own random cadence, purely decorative.
 * Labeled "(live simulation)" so it never reads as a real, verified metric.
 */
type Metric = { key: string; label: string; value: number; min: number; max: number }

const initialMetrics: Metric[] = [
  { key: "leads", label: "leads routed", value: 12840, min: 1, max: 4 },
  { key: "chats", label: "chats answered", value: 8021, min: 1, max: 3 },
  { key: "calls", label: "calls booked", value: 963, min: 1, max: 2 },
]

export function LiveStatsTicker() {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [flashKey, setFlashKey] = useState<string | null>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>

    const tick = () => {
      if (cancelled) return
      setMetrics((prev) =>
        prev.map((m) => {
          if (Math.random() < 0.7) {
            setFlashKey(m.key)
            setTimeout(() => setFlashKey((k) => (k === m.key ? null : k)), 280)
            return { ...m, value: m.value + Math.floor(Math.random() * (m.max - m.min + 1)) + m.min }
          }
          return m
        }),
      )
      timeoutId = setTimeout(tick, 900 + Math.random() * 1400)
    }
    timeoutId = setTimeout(tick, 1200)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground mb-6">
      {metrics.map((m) => (
        <span key={m.key} className="flex items-baseline gap-1.5">
          <b
            className="font-semibold transition-colors duration-300"
            style={{ color: flashKey === m.key ? "#22d3ee" : "#a855f7" }}
          >
            {m.value.toLocaleString()}
          </b>
          {m.label}
        </span>
      ))}
      <span className="opacity-50">(live simulation)</span>
    </div>
  )
}
