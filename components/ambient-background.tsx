export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* Base gradient mesh — very dark, tinted with palette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% 0%, oklch(0.18 0.06 280 / 0.35), transparent 60%), ' +
            'radial-gradient(ellipse 60% 50% at 100% 20%, oklch(0.18 0.05 220 / 0.25), transparent 60%), ' +
            'radial-gradient(ellipse 70% 60% at 50% 100%, oklch(0.15 0.05 280 / 0.3), transparent 65%)',
        }}
      />

      {/* Floating glow orbs, slow drift */}
      <div className="absolute left-[10%] top-[10%] h-[420px] w-[420px] animate-[drift_22s_ease-in-out_infinite] rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute right-[5%] top-[45%] h-[480px] w-[480px] animate-[drift_28s_ease-in-out_infinite_reverse] rounded-full bg-accent/10 blur-[140px]" />
      <div className="absolute bottom-[5%] left-[35%] h-[360px] w-[360px] animate-[drift_25s_ease-in-out_infinite] rounded-full bg-primary/10 blur-[130px]" />

      {/* Fine grain texture for depth */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 25px) scale(0.97); }
        }
      `}</style>
    </div>
  )
}
