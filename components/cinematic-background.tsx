"use client"

export function CinematicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-float-glow" />
      <div className="absolute -top-20 -right-40 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px] animate-float-glow-reverse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] -right-32 w-[350px] h-[350px] bg-cyan-400/10 rounded-full blur-[90px] animate-float-glow" style={{ animationDelay: '4s' }} />
      <div className="absolute top-[60%] -left-40 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] animate-float-glow-reverse" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-t from-purple-500/15 via-cyan-500/10 to-transparent rounded-full blur-[80px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" />
    </div>
  )
}
