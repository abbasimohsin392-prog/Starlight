'use client'

import { useEffect, useRef } from 'react'

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return

    let raf = 0
    let destroyed = false

    import('three').then((THREE) => {
      if (destroyed || !canvas) return

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
      renderer.setSize(window.innerWidth, window.innerHeight)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000)
      camera.position.z = 400

      const isMobile = window.innerWidth < 700
      const starCount = isMobile ? 1200 : 2800
      const positions = new Float32Array(starCount * 3)
      const colors = new Float32Array(starCount * 3)
      const palette = [
        [0.024, 0.71, 0.831], // cyan #06b6d4
        [0.659, 0.333, 0.969], // purple #a855f7
        [0.231, 0.51, 0.965], // blue #3b82f6
      ]
      for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1800
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1800
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1800
        const c = palette[Math.floor(Math.random() * palette.length)]
        const flick = 0.5 + Math.random() * 0.5
        colors[i * 3] = c[0] * flick
        colors[i * 3 + 1] = c[1] * flick
        colors[i * 3 + 2] = c[2] * flick
      }
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      const material = new THREE.PointsMaterial({
        size: 2.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const stars = new THREE.Points(geometry, material)
      scene.add(stars)

      const glowGeo = new THREE.SphereGeometry(60, 24, 24)
      ;[
        { c: 0x06b6d4, x: -260, y: 120, z: -500 },
        { c: 0xa855f7, x: 280, y: -140, z: -700 },
      ].forEach((g) => {
        const m = new THREE.MeshBasicMaterial({ color: g.c, transparent: true, opacity: 0.1 })
        const mesh = new THREE.Mesh(glowGeo, m)
        mesh.position.set(g.x, g.y, g.z)
        mesh.scale.set(3, 3, 3)
        scene.add(mesh)
      })

      let mouseX = 0
      let mouseY = 0
      let targetX = 0
      let targetY = 0
      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX / window.innerWidth - 0.5
        mouseY = e.clientY / window.innerHeight - 0.5
      }
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('resize', onResize)

      const animate = () => {
        raf = requestAnimationFrame(animate)
        stars.rotation.y += 0.00035
        stars.rotation.x += 0.00012
        targetX += (mouseX * 0.35 - targetX) * 0.03
        targetY += (mouseY * 0.25 - targetY) * 0.03
        camera.position.x = targetX * 40
        camera.position.y = -targetY * 30
        camera.lookAt(scene.position)
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(raf)
        geometry.dispose()
        material.dispose()
        glowGeo.dispose()
        renderer.dispose()
      }
    })

    return () => {
      destroyed = true
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', display: 'block' }}
    />
  )
}
