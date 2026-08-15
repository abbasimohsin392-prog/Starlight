"use client"

import { useEffect, useRef } from "react"

/**
 * Site-wide custom cursor: a small dot that snaps to the pointer and a
 * lerped outer ring that trails behind it. Elements tagged `data-magnetic`
 * get a light pull toward the pointer, and every ring expands on hover.
 * Clicking spawns a ripple at the ring's current (lerped) position, so the
 * ripple always appears wherever the cursor visually is, not the raw mouse
 * coordinate. Desktop-only — bails out entirely on touch/coarse pointers.
 */
export function CustomCursor() {
  const innerRef = useRef<HTMLDivElement | null>(null)
  const outerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const isCoarse = window.matchMedia("(hover: none), (pointer: coarse)").matches
    if (isCoarse) return

    const inner = innerRef.current
    const outer = outerRef.current
    if (!inner || !outer) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let ox = mx
    let oy = my
    let frame = 0

    const handleMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      inner.style.left = `${mx}px`
      inner.style.top = `${my}px`
    }
    window.addEventListener("mousemove", handleMove)

    const loop = () => {
      ox += (mx - ox) * 0.2
      oy += (my - oy) * 0.2
      outer.style.left = `${ox}px`
      outer.style.top = `${oy}px`
      frame = requestAnimationFrame(loop)
    }
    if (!reduceMotion) frame = requestAnimationFrame(loop)

    const onEnter = () => outer.classList.add("cursor-hovering")
    const onLeave = () => outer.classList.remove("cursor-hovering")

    const cleanups: Array<() => void> = []
    const bindHoverTargets = () => {
      document.querySelectorAll<HTMLElement>("a, button, [data-magnetic]").forEach((el) => {
        el.addEventListener("mouseenter", onEnter)
        el.addEventListener("mouseleave", onLeave)
        cleanups.push(() => {
          el.removeEventListener("mouseenter", onEnter)
          el.removeEventListener("mouseleave", onLeave)
        })
      })
    }
    bindHoverTargets()

    const magneticMoveHandlers = new Map<HTMLElement, (e: MouseEvent) => void>()
    const magneticLeaveHandlers = new Map<HTMLElement, () => void>()
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const relX = e.clientX - (r.left + r.width / 2)
        const relY = e.clientY - (r.top + r.height / 2)
        el.style.transform = `translate(${relX * 0.18}px, ${relY * 0.3}px)`
      }
      const onMagLeave = () => {
        el.style.transform = "translate(0,0)"
      }
      magneticMoveHandlers.set(el, onMove)
      magneticLeaveHandlers.set(el, onMagLeave)
      el.addEventListener("mousemove", onMove)
      el.addEventListener("mouseleave", onMagLeave)
    })

    const onDown = () => {
      const ripple = document.createElement("div")
      ripple.className = "cursor-click-ripple"
      ripple.style.left = `${ox}px`
      ripple.style.top = `${oy}px`
      document.body.appendChild(ripple)
      requestAnimationFrame(() => {
        ripple.style.transform = "translate(-50%, -50%) scale(5.5)"
        ripple.style.opacity = "0"
      })
      setTimeout(() => ripple.remove(), 600)
      inner.style.transform = "translate(-50%, -50%) scale(0.6)"
      outer.style.transform = "translate(-50%, -50%) scale(0.88)"
    }
    const onUp = () => {
      inner.style.transform = "translate(-50%, -50%) scale(1)"
      outer.style.transform = "translate(-50%, -50%) scale(1)"
    }
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      cleanups.forEach((fn) => fn())
      magneticMoveHandlers.forEach((fn, el) => el.removeEventListener("mousemove", fn))
      magneticLeaveHandlers.forEach((fn, el) => el.removeEventListener("mouseleave", fn))
    }
  }, [])

  return (
    <>
      <div ref={innerRef} className="cursor-inner" aria-hidden="true" />
      <div ref={outerRef} className="cursor-outer" aria-hidden="true" />
    </>
  )
}
