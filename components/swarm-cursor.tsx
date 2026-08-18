"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface SwarmCursorProps {
  color?: string
  accentColor?: string
  count?: number
  size?: number
  speed?: number
  spread?: number
  wander?: number
  trail?: number
  scatterOnClick?: boolean
  children?: ReactNode
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  angle: number
}

/**
 * Bounded particle-swarm cursor effect. A cluster of glowing dots orbits
 * and chases the pointer within its parent's box. Meant to be dropped into
 * a section as a decorative, interactive backdrop (not a full-page cursor
 * replacement) -- wrap it in a positioned container with your content as
 * children.
 */
export default function SwarmCursor({
  color = "#ffffff",
  accentColor = "#ffffff",
  count = 6,
  size = 1,
  speed = 2.5,
  spread = 100,
  wander = 0.25,
  trail = 0.75,
  scatterOnClick = false,
  children,
}: SwarmCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const isCoarse = window.matchMedia("(hover: none), (pointer: coarse)").matches

    let raf = 0
    let width = 0
    let height = 0
    let mouseX = 0
    let mouseY = 0

    const particles: Particle[] = Array.from({ length: Math.max(1, count) }, (_, i) => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      angle: (i / count) * Math.PI * 2,
    }))

    const resize = () => {
      const rect = wrapper.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      mouseX = width / 2
      mouseY = height / 2
      particles.forEach((p) => {
        p.x = mouseX
        p.y = mouseY
      })
    }
    resize()
    window.addEventListener("resize", resize)

    const onMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    wrapper.addEventListener("mousemove", onMove)

    const onClick = () => {
      particles.forEach((p) => {
        const a = Math.random() * Math.PI * 2
        p.vx += Math.cos(a) * speed * 4
        p.vy += Math.sin(a) * speed * 4
      })
    }
    if (scatterOnClick) wrapper.addEventListener("click", onClick)

    const loop = (t: number) => {
      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = `rgba(0,0,0,${1 - trail})`
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = "source-over"

      particles.forEach((p, i) => {
        const wanderAngle = p.angle + t * 0.0006 * (wander + 0.1)
        const targetX = mouseX + Math.cos(wanderAngle) * spread * 0.35
        const targetY = mouseY + Math.sin(wanderAngle) * spread * 0.35
        const dx = targetX - p.x
        const dy = targetY - p.y
        const pull = 0.0025 * speed
        p.vx += dx * pull
        p.vy += dy * pull
        p.vx *= 0.92
        p.vy *= 0.92
        p.x += p.vx
        p.y += p.vy

        const dotSize = size * 3 + (i % 3)
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, dotSize * 2.2)
        grad.addColorStop(0, i % 2 === 0 ? color : accentColor)
        grad.addColorStop(1, "transparent")
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2)
        ctx.fill()
      })

      raf = requestAnimationFrame(loop)
    }
    if (!isCoarse) raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      wrapper.removeEventListener("mousemove", onMove)
      if (scatterOnClick) wrapper.removeEventListener("click", onClick)
    }
  }, [color, accentColor, count, size, speed, spread, wander, trail, scatterOnClick])

  return (
    <div ref={wrapperRef} className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="relative z-10 w-full h-full flex items-center justify-center">{children}</div>
    </div>
  )
}
