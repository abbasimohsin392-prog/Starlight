'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ease } from './reveal'

const KEY = 'starlight:intro-seen'

export function Preloader() {
  const [show, setShow] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (sessionStorage.getItem(KEY)) return
    setShow(true)
    document.documentElement.classList.add('lenis-stopped')
    const t = setTimeout(() => {
      setShow(false)
      sessionStorage.setItem(KEY, '1')
      document.documentElement.classList.remove('lenis-stopped')
    }, 1200)
    return () => {
      clearTimeout(t)
      document.documentElement.classList.remove('lenis-stopped')
    }
  }, [reduced])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          role="status"
          aria-live="polite"
          aria-label="Loading Starlight AI"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.9, ease } }}
        >
          <motion.img
            src="/images/starlight-logo.png"
            alt="Starlight AI"
            className="h-auto w-56 max-w-[72vw] object-contain md:w-72"
            initial={{ opacity: 0, scale: 0.72, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.85, ease }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
