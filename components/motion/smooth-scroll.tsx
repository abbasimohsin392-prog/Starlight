'use client'

import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from 'framer-motion'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()

  if (reduced) return <>{children}</>

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
      }}
    >
      {children}
    </ReactLenis>
  )
}
