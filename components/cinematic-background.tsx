"use client"

import { GradientWaves } from "./gradient-waves"

export function CinematicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <GradientWaves
        horizonColor="#140a28"
        waveColor="#9333ea"
        crestColor="#67e8f9"
        speed={0.35}
        amplitude={2.2}
        waveScale={0.5}
        waveRatio={0.9}
        swell={30}
        turbulence={18}
        opacity={0.65}
        brightness={1.15}
        detail="low"
        mouseInteraction={false}
        grain={true}
        grainIntensity={0.035}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" />
    </div>
  )
}
