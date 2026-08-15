'use client'

import { useEffect, useState } from 'react'

/**
 * True when the device has a fine pointer (mouse/trackpad).
 * Used to gate magnetic/tilt interactions and reduce animation
 * intensity on touch devices for performance.
 */
export function useFinePointer() {
  const [isFinePointer, setIsFinePointer] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setIsFinePointer(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsFinePointer(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isFinePointer
}
