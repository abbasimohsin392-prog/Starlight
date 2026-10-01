'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { Menu, X } from 'lucide-react'
import { navLinks } from '@/lib/data'
import { Wordmark } from './logo'
import { ThemeToggle } from './theme-toggle'
import { Magnetic } from '@/components/motion/magnetic'
import { ease } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  const lenis = useLenis()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.5] },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

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
          <a href="#" onClick={goTo('hero')} aria-label="Starlight AI home" className="pl-2">
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.id} className="relative">
                  <a
                    href={`#${link.id}`}
                    onClick={goTo(link.id)}
                    className={cn(
                      'relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {link.label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-muted"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Magnetic strength={0.25} className="hidden sm:inline-block">
              <a
                href="#contact"
                onClick={goTo('contact')}
                className="glow-primary inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Book a call
              </a>
            </Magnetic>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-surface/60 lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col justify-center bg-background/95 px-8 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease }}
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={goTo(link.id)}
                    className="font-display block py-2 text-4xl font-bold tracking-tight"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={goTo('contact')}
              className="mt-10 inline-flex h-14 w-full items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground"
            >
              Book a call
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
