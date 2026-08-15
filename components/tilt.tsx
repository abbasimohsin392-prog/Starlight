'use client'

import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useFinePointer } from '@/hooks/use-fine-pointer'

type TiltProps = {
  children: React.ReactNode
  /** Maximum tilt angle in degrees. */
  maxAngle?: number
  className?: string
}

/**
 * Tilt-on-mouse-move wrapper — the child rotates in 3D toward the
 * cursor position and springs flat on leave. No-ops on touch devices
 * and for users who prefer reduced motion.
 */
export function Tilt({ children, maxAngle = 6, className }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isFinePointer = useFinePointer()
  const prefersReducedMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [maxAngle, -maxAngle]), {
    stiffness: 200,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-maxAngle, maxAngle]), {
    stiffness: 200,
    damping: 20,
  })

  const enabled = isFinePointer && !prefersReducedMotion

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mx.set(0)
    my.set(0)
  }

  if (!enabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <div style={{ perspective: 800 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  )
}
