"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollRevealProps {
  children: ReactNode
  /** Vertical offset the content travels in from, in pixels. */
  distance?: number
  /** Stagger delay in seconds, useful when placing several in a row. */
  delay?: number
  className?: string
}

/**
 * Quiet, disciplined scroll-in reveal used across section content.
 * The AI Guide orb is the one bold motion element on the page — this
 * wrapper stays subtle by design: a short rise + fade, nothing more.
 */
export function ScrollReveal({ children, distance = 32, delay = 0, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: distance },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [distance, delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
