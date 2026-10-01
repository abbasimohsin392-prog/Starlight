'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ease } from '@/components/motion/reveal'

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease }}
    >
      {children}
    </motion.div>
  )
}
