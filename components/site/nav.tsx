'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navLinks } from '@/lib/data'
import { Wordmark } from './logo'
import { ThemeToggle } from './theme-toggle'
import { Magnetic } from '@/components/motion/magnetic'
import { ease } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  const pathname = usePathname()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const linkClass = (href: string) => cn(
    'relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors',
    pathname === href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
  )

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-4"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease, delay: 0.2 }}
      >
        <motion.nav
          aria-label="Primary"
          className={cn(
            'flex w-full max-w-6xl items-center justify-between rounded-full border px-3 transition-[background-color,border-color,box-shadow] duration-500',
            scrolled
              ? 'border-border bg-background/70 shadow-[0_8px_40px_-12px_oklch(0_0_0/0.5)] backdrop-blur-xl'
              : 'border-transparent bg-transparent',
          )}
          animate={{ height: scrolled ? 56 : 72 }}
          transition={{ duration: 0.5, ease }}
        >
          <a href="/" aria-label="Starlight AI home" className="pl-2">
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-1 xl:flex">
            {navLinks.map((link) => (
              <li key={link.id} className="relative">
                <a href={link.href} aria-current={pathname === link.href ? 'page' : undefined} className={linkClass(link.href)}>
                  {link.label}
                </a>
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-muted"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            ))}
            <li className="relative">
              <a href="/pricing" aria-current={pathname === '/pricing' ? 'page' : undefined} className={linkClass('/pricing')}>Pricing</a>
            </li>
            <li className="relative">
              <a href="/demo/ai-receptionist" className={linkClass('/demo/ai-receptionist')}>Demo</a>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Magnetic strength={0.25} className="hidden sm:inline-block">
              <a
                href="/contact"
                className="glow-primary inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Book a call
              </a>
            </Magnetic>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((o) => !o)}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-surface/60 xl:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false)
            }}
            className="fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-background/95 px-6 pb-10 pt-28 backdrop-blur-xl sm:px-8 xl:hidden"
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease }}
          >
            <nav aria-label="Mobile" className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center">
              <ul className="flex flex-col gap-1">
                <motion.li initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4, ease }}>
                  <a href="/" onClick={() => setOpen(false)} className="font-display block py-2 text-3xl font-bold tracking-tight sm:text-4xl">Home</a>
                </motion.li>
                {navLinks.map((link, i) => (
                  <motion.li key={link.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.04, duration: 0.4, ease }}>
                    <a href={link.href} onClick={() => setOpen(false)} className="font-display block py-2 text-3xl font-bold tracking-tight sm:text-4xl">
                      {link.label}
                    </a>
                  </motion.li>
                ))}
                <motion.li initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + navLinks.length * 0.04, duration: 0.4, ease }}>
                  <a href="/pricing" onClick={() => setOpen(false)} className="font-display block py-2 text-3xl font-bold tracking-tight sm:text-4xl">Pricing</a>
                </motion.li>
                <motion.li initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + navLinks.length * 0.04, duration: 0.4, ease }}>
                  <a href="/demo/ai-receptionist" onClick={() => setOpen(false)} className="font-display block py-2 text-3xl font-bold tracking-tight sm:text-4xl">AI Receptionist Demo</a>
                </motion.li>
              </ul>
              <a href="/contact" onClick={() => setOpen(false)} className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground">
                Book a call
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
