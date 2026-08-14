"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { gsap } from "gsap"

export type CoreMode = "chatbots" | "automation" | "marketing"

const MODE_COLORS: Record<CoreMode, { core: number; glow: number; particle: number }> = {
  chatbots: { core: 0x22d3ee, glow: 0x0e7490, particle: 0x67e8f9 },
  automation: { core: 0xa855f7, glow: 0x6b21a8, particle: 0xd8b4fe },
  marketing: { core: 0xf5b942, glow: 0x92620a, particle: 0xfcd34d },
}

const PARTICLE_COUNT = 46
const REPEL_RADIUS = 2.6
const REPEL_STRENGTH = 1.4

/**
 * Starlight's signature hero centerpiece: a wireframe "core" surrounded by a
 * shell of orbiting particles (leads being drawn in). The whole group tilts
 * toward the cursor, nearby particles are pushed away from the pointer, and
 * clicking a service pill (see HeroSection) recolors + "pulses" the core to
 * match that service — same choreography language as a product-flavor swap,
 * translated into color and form instead of a texture swap.
 */
export function InteractiveCore({ mode }: { mode: CoreMode }) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const coreMatRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const glowMatRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const particleMatRef = useRef<THREE.PointsMaterial | null>(null)
  const groupRef = useRef<THREE.Group | null>(null)
  const prevMode = useRef<CoreMode>(mode)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const isMobile = window.matchMedia("(max-width: 767px)").matches
    if (isMobile) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const size = 560
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.z = 7.2

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    mount.appendChild(renderer.domElement)

    const group = new THREE.Group()
    groupRef.current = group
    scene.add(group)

    const colors = MODE_COLORS[mode]

    // Core: layered wireframe icosahedron
    const coreGeometry = new THREE.IcosahedronGeometry(1.7, 1)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: colors.core,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    })
    coreMatRef.current = coreMaterial
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    group.add(core)

    // Inner glow sphere
    const glowGeometry = new THREE.IcosahedronGeometry(1.05, 2)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: colors.glow,
      transparent: true,
      opacity: 0.45,
    })
    glowMatRef.current = glowMaterial
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    group.add(glow)

    // Particle shell: "leads" orbiting the core, each on its own shell radius
    const particleGeometry = new THREE.BufferGeometry()
    const basePositions = new Float32Array(PARTICLE_COUNT * 3)
    const offsets = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 2.6 + Math.random() * 1.1
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      basePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      basePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      basePositions[i * 3 + 2] = radius * Math.cos(phi)
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(basePositions.slice(), 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: colors.particle,
      size: 0.075,
      transparent: true,
      opacity: 0.85,
    })
    particleMatRef.current = particleMaterial
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    group.add(particles)

    // Pointer tracking, in normalized device coords
    const pointer = { x: 0, y: 0 }
    const smoothedPointer = { x: 0, y: 0 }
    const handlePointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("pointermove", handlePointerMove)

    const raycastPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const raycaster = new THREE.Raycaster()
    const pointerWorld = new THREE.Vector3()

    let frameId: number
    const clock = new THREE.Clock()
    const posAttr = particleGeometry.getAttribute("position") as THREE.BufferAttribute

    const animate = () => {
      const elapsed = clock.getElapsedTime()

      if (!prefersReducedMotion) {
        smoothedPointer.x += (pointer.x - smoothedPointer.x) * 0.06
        smoothedPointer.y += (pointer.y - smoothedPointer.y) * 0.06

        // Tilt the whole group toward the cursor
        group.rotation.y = smoothedPointer.x * 0.5
        group.rotation.x = -smoothedPointer.y * 0.35

        // Slow ambient spin so it never looks static
        core.rotation.y = elapsed * 0.08
        glow.rotation.y = -elapsed * 0.05
        particles.rotation.y = elapsed * 0.04

        // Project pointer onto the z=0 plane in world space to repel nearby particles
        raycaster.setFromCamera(new THREE.Vector2(pointer.x, pointer.y), camera)
        raycaster.ray.intersectPlane(raycastPlane, pointerWorld)

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const bx = basePositions[i * 3]
          const by = basePositions[i * 3 + 1]
          const bz = basePositions[i * 3 + 2]

          const dx = bx - pointerWorld.x
          const dy = by - pointerWorld.y
          const dz = bz - pointerWorld.z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          let ox = 0, oy = 0, oz = 0
          if (dist < REPEL_RADIUS && dist > 0.001) {
            const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH
            ox = (dx / dist) * force
            oy = (dy / dist) * force
            oz = (dz / dist) * force
          }

          // Lerp toward target offset for a soft spring-back feel
          offsets[i * 3] += (ox - offsets[i * 3]) * 0.12
          offsets[i * 3 + 1] += (oy - offsets[i * 3 + 1]) * 0.12
          offsets[i * 3 + 2] += (oz - offsets[i * 3 + 2]) * 0.12

          const drift = Math.sin(elapsed * 0.6 + i) * 0.05
          posAttr.setXYZ(
            i,
            bx + offsets[i * 3],
            by + offsets[i * 3 + 1] + drift,
            bz + offsets[i * 3 + 2]
          )
        }
        posAttr.needsUpdate = true
      }

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("pointermove", handlePointerMove)
      renderer.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
    // Scene is rebuilt once; mode changes are handled by the color-morph effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mode switch: pulse-scale the group and tween all materials to the new
  // palette, rather than rebuilding the scene — mirrors a spin + recolor
  // rather than a full reload.
  useEffect(() => {
    if (mode === prevMode.current) return
    prevMode.current = mode
    const colors = MODE_COLORS[mode]
    const group = groupRef.current
    if (!group) return

    const tl = gsap.timeline()
    tl.to(group.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 0.3, ease: "power2.in" })
    tl.to(
      group.rotation,
      { y: `+=${Math.PI * 2}`, duration: 1.1, ease: "power2.out" },
      "<"
    )
    tl.to(group.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.7")

    if (coreMatRef.current) {
      gsap.to(coreMatRef.current.color, {
        r: ((colors.core >> 16) & 255) / 255,
        g: ((colors.core >> 8) & 255) / 255,
        b: (colors.core & 255) / 255,
        duration: 0.9,
        ease: "power2.inOut",
      })
    }
    if (glowMatRef.current) {
      gsap.to(glowMatRef.current.color, {
        r: ((colors.glow >> 16) & 255) / 255,
        g: ((colors.glow >> 8) & 255) / 255,
        b: (colors.glow & 255) / 255,
        duration: 0.9,
        ease: "power2.inOut",
      })
    }
    if (particleMatRef.current) {
      gsap.to(particleMatRef.current.color, {
        r: ((colors.particle >> 16) & 255) / 255,
        g: ((colors.particle >> 8) & 255) / 255,
        b: (colors.particle & 255) / 255,
        duration: 0.9,
        ease: "power2.inOut",
      })
    }
  }, [mode])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none hidden md:block"
      style={{ width: 560, height: 560 }}
    />
  )
}
