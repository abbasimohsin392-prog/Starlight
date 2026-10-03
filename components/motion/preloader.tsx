'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Logo } from '@/components/site/logo'
import { ease } from './reveal'

const KEY = 'starlight:intro-seen'
const letters = 'Starlight AI'.split('')

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
    }, 1000)
    return () => clearTimeout(t)
  }, [reduced])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          role="status"
          aria-live="polite"
          aria-label="Loading Starlight AI"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[oklch(0.08_0.01_270)]"
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.9, ease } }}
        >
          <div className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease }}
            >
              <Logo className="size-16 md:size-20" />
            </motion.div>
            <h1 className="font-display flex text-4xl font-bold tracking-tight text-white md:text-6xl">
              {letters.map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.35 + i * 0.04 }}
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div
              className="h-px w-48 origin-left bg-gradient-to-r from-[oklch(0.72_0.18_240)] via-primary to-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.15 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
