"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * AI Guide — Starlight's signature floating orb.
 * A low-poly wireframe core with an orbiting energy ring, pinned to the
 * viewport and choreographed with GSAP ScrollTrigger so it drifts, tilts,
 * and re-colors as the visitor scrolls through the page. This is the one
 * "hero" motion element on the site — everything else stays quiet.
 */
export function AIGuideOrb() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const width = 220
    const height = 220

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Core: low-poly icosahedron, wireframe, cyan
    const coreGeometry = new THREE.IcosahedronGeometry(1.4, 1)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    scene.add(core)

    // Inner glow sphere, solid, faint purple
    const glowGeometry = new THREE.IcosahedronGeometry(0.9, 1)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.35,
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(glow)

    // Orbiting ring made of small points
    const ringPoints = 60
    const ringGeometry = new THREE.BufferGeometry()
    const ringPositions = new Float32Array(ringPoints * 3)
    for (let i = 0; i < ringPoints; i++) {
      const angle = (i / ringPoints) * Math.PI * 2
      ringPositions[i * 3] = Math.cos(angle) * 2.3
      ringPositions[i * 3 + 1] = Math.sin(angle) * 2.3 * 0.35
      ringPositions[i * 3 + 2] = Math.sin(angle) * 0.4
    }
    ringGeometry.setAttribute("position", new THREE.BufferAttribute(ringPositions, 3))
    const ringMaterial = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.06,
      transparent: true,
      opacity: 0.9,
    })
    const ring = new THREE.Points(ringGeometry, ringMaterial)
    ring.rotation.x = 0.5
    scene.add(ring)

    let frameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsed = clock.getElapsedTime()
      core.rotation.y = elapsed * 0.25
      core.rotation.x = elapsed * 0.12
      glow.rotation.y = -elapsed * 0.18
      ring.rotation.z = elapsed * 0.35
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    // Scroll choreography: the orb drifts vertically with scroll progress
    // and swaps its dominant hue between cyan (default) and warm gold near
    // the page footer, echoing the site's two accent colors.
    let scrollTween: gsap.core.Tween | null = null
    if (!prefersReducedMotion) {
      scrollTween = gsap.to(mount, {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const progress = self.progress
            mount.style.transform = `translateY(${progress * 65}vh)`
            const hue = progress > 0.85 ? 0xf5b942 : 0x22d3ee
            coreMaterial.color.setHex(hue)
            ringMaterial.color.setHex(progress > 0.85 ? 0xfcd34d : 0x67e8f9)
          },
        },
      })
    }

    const handleResize = () => {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", handleResize)
      scrollTween?.scrollTrigger?.kill()
      scrollTween?.kill()
      renderer.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
      ringGeometry.dispose()
      ringMaterial.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed pointer-events-none z-30 hidden md:block"
      style={{
        top: "12vh",
        right: "4vw",
        width: 220,
        height: 220,
      }}
    />
  )
}
