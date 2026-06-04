"use client"

export function CinematicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top left purple glow */}
      <div 
        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-float-glow"
      />
      
      {/* Top right cyan glow */}
      <div 
        className="absolute -top-20 -right-40 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[100px] animate-float-glow-reverse"
        style={{ animationDelay: '2s' }}
      />
      
      {/* Middle left glow */}
      <div 
        className="absolute top-[30%] -left-20 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[80px] animate-subtle-pulse"
        style={{ animationDelay: '1s' }}
      />
      
      {/* Middle right cyan glow */}
      <div 
        className="absolute top-[40%] -right-32 w-[450px] h-[450px] bg-cyan-400/10 rounded-full blur-[90px] animate-float-glow"
        style={{ animationDelay: '4s' }}
      />
      
      {/* Center large gradient */}
      <div 
        className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 rounded-full blur-[100px] animate-subtle-pulse"
        style={{ animationDelay: '3s' }}
      />
      
      {/* Bottom left purple glow */}
      <div 
        className="absolute top-[60%] -left-40 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[100px] animate-float-glow-reverse"
        style={{ animationDelay: '5s' }}
      />
      
      {/* Bottom center blue glow */}
      <div 
        className="absolute top-[70%] left-1/3 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] animate-subtle-pulse"
        style={{ animationDelay: '2s' }}
      />
      
      {/* Bottom right cyan glow */}
      <div 
        className="absolute top-[75%] -right-20 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[110px] animate-float-glow"
        style={{ animationDelay: '6s' }}
      />
      
      {/* Deep bottom purple glow */}
      <div 
        className="absolute top-[90%] left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-float-glow-reverse"
        style={{ animationDelay: '4s' }}
      />
      
      {/* Footer area glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-t from-purple-500/15 via-cyan-500/10 to-transparent rounded-full blur-[80px]"
      />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" />
    </div>
  )
}
