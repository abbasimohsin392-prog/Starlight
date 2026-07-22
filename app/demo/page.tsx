"use client"

import { useState, useRef, useEffect, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { PhoneOff, PhoneIncoming, CalendarCheck, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"

const CALENDLY_LINK = "https://calendly.com/starlightai306/30min"

type Msg = { role: "system" | "in" | "out"; text: string }

const SCRIPT: Msg[] = [
  { role: "system", text: "2:47 PM — incoming call, rang out" },
  { role: "out", text: "Hey, sorry we missed your call! What can we help with?" },
  { role: "in", text: "Hi, my water heater's leaking, need someone today if possible" },
  { role: "out", text: "Got it — a leaking water heater. We have a slot at 5:30 PM today or 8:00 AM tomorrow. Which works better?" },
  { role: "in", text: "5:30 works" },
  { role: "out", text: "Booked for 5:30 PM. You'll get a text 30 min before arrival. Anything else before then?" },
  { role: "system", text: "✓ job booked — added to calendar" },
]

/** Card that tilts in 3D toward the cursor, matching a "premium hardware" feel */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rotateY = (px - 0.5) * 10
    const rotateX = (0.5 - py) * 10
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01,1.01,1.01)`,
    })
  }

  function reset() {
    setStyle({ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)" })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </div>
  )
}

export default function DemoPage() {
  return (
    <Suspense fallback={null}>
      <DemoContent />
    </Suspense>
  )
}

function DemoContent() {
  const params = useSearchParams()

  const [biz, setBiz] = useState("Your Company")
  const [calls, setCalls] = useState(8)
  const [jobVal, setJobVal] = useState(350)
  const [closeRate, setCloseRate] = useState(35)
  const [messages, setMessages] = useState<Msg[]>([])
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const p = (k: string) => params.get(k)
    if (p("biz")) setBiz(p("biz") as string)
    if (p("calls")) setCalls(Number(p("calls")))
    if (p("jobval")) setJobVal(Number(p("jobval")))
    if (p("close")) setCloseRate(Number(p("close")))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const monthlyLost = useMemo(() => {
    const weekly = calls * jobVal * (closeRate / 100)
    return Math.round(weekly * 4.33)
  }, [calls, jobVal, closeRate])

  function playThread() {
    setMessages([])
    SCRIPT.forEach((m, i) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, m])
      }, i * 650)
    })
  }

  useEffect(() => {
    playThread()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <CinematicBackground />
      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Missed Call Report</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-3 text-balance">
                See what this looks like for{" "}
                <span className="relative inline-block">
                  <input
                    value={biz}
                    onChange={(e) => setBiz(e.target.value || "Your Company")}
                    spellCheck={false}
                    className="gradient-text bg-transparent border-b-2 border-dashed border-cyan-500/50 focus:border-cyan-400 outline-none text-center px-1 font-bold"
                    style={{ width: `${Math.max(biz.length, 8)}ch` }}
                  />
                </span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Drop in your numbers below to see roughly what missed calls are costing, and what it looks like when Starlight AI answers instead.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator + Stamp */}
        <section className="relative py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-8 items-stretch">
            {/* Inputs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 glass-card rounded-2xl p-8 space-y-7"
            >
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium uppercase tracking-wider">
                <PhoneOff className="w-4 h-4" /> Your numbers
              </div>

              <SliderRow
                label="Calls you miss per week"
                sub="after-hours, on-the-job, overflow"
                value={calls}
                min={0}
                max={40}
                onChange={setCalls}
                display={`${calls}`}
              />
              <SliderRow
                label="Average job value"
                sub="what a booked job is worth"
                value={jobVal}
                min={50}
                max={3000}
                step={50}
                onChange={setJobVal}
                display={`$${jobVal.toLocaleString()}`}
              />
              <SliderRow
                label="Close rate if someone answers"
                sub="% of answered calls that book"
                value={closeRate}
                min={0}
                max={100}
                onChange={setCloseRate}
                display={`${closeRate}%`}
              />
            </motion.div>

            {/* 3D Stamp */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <TiltCard className="glass-card glow-purple rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div
                  className="absolute w-56 h-56 rounded-full opacity-40 blur-2xl"
                  style={{
                    background: "conic-gradient(from 180deg, #a855f7, #06b6d4, #3b82f6, #a855f7)",
                    transform: "translateZ(-40px)",
                  }}
                />
                <div className="relative z-10">
                  <PhoneIncoming className="w-6 h-6 text-cyan-400 mx-auto mb-3" />
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Estimated lost revenue / month
                  </p>
                  <div
                    className="text-5xl sm:text-6xl font-extrabold gradient-text leading-none mb-2"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    ${monthlyLost.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    from ~{Math.round(calls * 4.33)} missed calls a month
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1.5 border border-purple-400/40 text-purple-300 text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded-full">
                    <Sparkles className="w-3 h-3" /> Recoverable
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </section>

        {/* Demo thread */}
        <section className="relative py-10">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{biz}'s AI Receptionist</p>
                    <p className="text-xs text-muted-foreground mt-1">What happens instead</p>
                  </div>
                </div>
                <button
                  onClick={playThread}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium uppercase tracking-wider"
                >
                  Replay
                </button>
              </div>

              <div ref={threadRef} className="px-5 py-4 space-y-3 h-80 overflow-y-auto">
                {messages.map((m, i) =>
                  m.role === "system" ? (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-[11px] uppercase tracking-wider text-muted-foreground py-1"
                    >
                      {m.text}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`max-w-[85%] px-4 py-2.5 rounded-xl text-sm leading-snug ${
                        m.role === "out"
                          ? "bg-white/[0.04] border border-white/10"
                          : "bg-gradient-to-r from-purple-500 to-cyan-500 text-white ml-auto"
                      }`}
                    >
                      {m.text}
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-muted-foreground text-lg mb-6">
                This is what's on the table for <span className="text-foreground font-medium">{biz}</span> — trained on your services and pricing, live in about a week.
              </p>
              <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 btn-glow bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-foreground font-medium px-8 py-4 rounded-xl"
                >
                  <CalendarCheck className="w-5 h-5" />
                  Book the free 15-min call
                </motion.span>
              </a>
              <p className="text-xs text-muted-foreground mt-4">No contract to look at this. Just a conversation.</p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}

function SliderRow({
  label,
  sub,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
}: {
  label: string
  sub: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  display: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
        <div className="font-mono text-cyan-400 font-semibold text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 min-w-[70px] text-right">
          {display}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-500"
      />
    </div>
  )
}
