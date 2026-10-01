'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

type CursorMode = 'default' | 'link' | 'text' | 'view'

export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<CursorMode>('default')
  const [label, setLabel] = useState('')
  const [pressed, setPressed] = useState(false)
  const reduced = useReducedMotion()

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const update = () => setEnabled(fine.matches && !reduced)
    update()
    fine.addEventListener('change', update)
    return () => fine.removeEventListener('change', update)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target as HTMLElement | null
      const hit = target?.closest<HTMLElement>('[data-cursor], a, button, [role="button"], input, textarea')
      if (!hit) {
        setMode('default')
        setLabel('')
        return
      }
      const explicit = hit.dataset.cursor as CursorMode | undefined
      if (explicit) {
        setMode(explicit)
        setLabel(hit.dataset.cursorLabel ?? '')
      } else if (hit.matches('input, textarea')) {
        setMode('text')
        setLabel('')
      } else {
        setMode('link')
        setLabel('')
      }
    }
    const down = () => setPressed(true)
    const up = () => setPressed(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const size = mode === 'view' ? 88 : mode === 'link' ? 56 : mode === 'text' ? 8 : 14
  const scale = pressed ? 0.8 : 1

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[11px] font-semibold uppercase tracking-wider text-black"
        animate={{ width: size, height: size, scale }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {mode === 'view' && label}
      </motion.div>
    </motion.div>
  )
}
