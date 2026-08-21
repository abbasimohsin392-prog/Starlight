"use client"

import Image from "next/image"
import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ScrollExpandProps {
  src?: string
  alt?: string
  title?: string
  scrollHint?: string
  useWindowScroll?: boolean
  mediaZoom?: number
  content?: ReactNode
  children?: ReactNode
}

export default function ScrollExpand({
  src,
  alt,
  title,
  scrollHint,
  useWindowScroll = false,
  mediaZoom = 1,
  content,
  children,
}: ScrollExpandProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Both modes track scroll progress against THIS section only, never the whole page.
  // useWindowScroll: progress goes 0 -> 1 as the section scrolls from entering the
  // viewport to fully passing it (matches the sticky pin below).
  // local mode: progress goes 0 -> 1 as the section scrolls from entering the
  // viewport to reaching its center.
  const { scrollYProgress: pinnedProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })
  const { scrollYProgress: elementProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  })
  const progress = useWindowScroll ? pinnedProgress : elementProgress

  const frameWidth = useTransform(progress, [0, 1], ["76%", "100%"])
  const frameHeight = useTransform(
    progress,
    [0, 1],
    [useWindowScroll ? "58vh" : "72%", useWindowScroll ? "100vh" : "100%"],
  )
  const frameRadius = useTransform(progress, [0, 1], [28, 0])
  const mediaScale = useTransform(progress, [0, 1], [1, mediaZoom])
  const overlayOpacity = useTransform(progress, [0, 0.6], [0.5, 0.1])
  const hintOpacity = useTransform(progress, [0, 0.15], [1, 0])
  const badgeOpacity = useTransform(progress, [0, 0.25], [1, 0])
  const contentOpacity = useTransform(progress, [0.3, 0.65], [0, 1])
  const contentY = useTransform(progress, [0.3, 0.65], [24, 0])

  return (
    <section
      ref={containerRef}
      className={useWindowScroll ? "relative w-full min-h-[160vh] py-16 sm:py-24" : "relative w-full h-full"}
    >
      <motion.div
        style={{ width: frameWidth, height: frameHeight, borderRadius: frameRadius }}
        className={`${useWindowScroll ? "sticky top-24" : "relative"} mx-auto overflow-hidden border border-white/10 glass-card`}
      >
        <motion.div style={{ scale: mediaScale }} className="absolute inset-0 overflow-auto">
          {content ? content : src ? <Image src={src} alt={alt ?? ""} fill priority className="object-cover" sizes="100vw" /> : null}
        </motion.div>

        {!content && (
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none"
          />
        )}

        {title && (
          <motion.span
            style={{ opacity: badgeOpacity }}
            className="absolute top-6 left-6 glass-card px-4 py-1.5 rounded-full border border-white/10 text-sm text-muted-foreground z-10"
          >
            {title}
          </motion.span>
        )}

        {scrollHint && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute bottom-6 right-6 flex items-center gap-1.5 text-xs text-muted-foreground glass-card px-3 py-1.5 rounded-full border border-white/10 z-10"
          >
            {scrollHint}
            <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
              ↓
            </motion.span>
          </motion.div>
        )}
      </motion.div>

      {children && (
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative z-10 max-w-2xl mx-auto text-center px-4 mt-10"
        >
          {children}
        </motion.div>
      )}
    </section>
  )
}
