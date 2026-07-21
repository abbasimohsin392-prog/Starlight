"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Bot, Send, Sparkles } from "lucide-react"

type Message = { role: "bot" | "user"; text: string }

const INITIAL: Message = {
  role: "bot",
  text: "Hi! I can help book a call or answer a quick question about what we build. What are you trying to solve?",
}

function getReply(input: string): string {
  const t = input.toLowerCase()
  if (t.includes("price") || t.includes("cost") || t.includes("how much")) {
    return "Plans start at $297/mo — the Growth tier covers one custom AI chatbot and basic automation. Want me to pull up the pricing section, or book a call to scope it out?"
  }
  if (t.includes("chatbot") || t.includes("bot")) {
    return "We build custom AI chatbots that answer calls and site chats 24/7, then book straight into your calendar — like the one you're talking to right now. Want a demo on your own site?"
  }
  if (t.includes("time") || t.includes("long") || t.includes("weeks")) {
    return "Most builds go live in 1-3 weeks depending on scope. A quick call is the fastest way to get a real timeline for your case."
  }
  return "Got it — the fastest next step is a free strategy call, we'll map this to a real plan in about 15 minutes. Want the link?"
}

export function ChatbotDemoSection() {
  const [messages, setMessages] = useState<Message[]>([INITIAL])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, typing])

  function send() {
    const val = input.trim()
    if (!val) return
    setMessages((m) => [...m, { role: "user", text: val }])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { role: "bot", text: getReply(val) }])
    }, 850)
  }

  return (
    <section id="chat-demo" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">See It Work</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6 text-balance">
              This is the assistant that <span className="gradient-text">answers your calls.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Type a question like a real visitor would. This demo runs on canned logic — your live version
              connects to your calendar and CRM to actually book the job.
            </p>
            <ul className="space-y-3">
              {["Answers instantly, day or night", "Books directly into your calendar", "Hands off to a human for anything urgent"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-card rounded-2xl overflow-hidden max-w-md w-full mx-auto"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">Starlight Assistant</p>
                <p className="text-xs text-muted-foreground mt-1">Demo mode</p>
              </div>
              <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            <div ref={scrollRef} className="px-5 py-4 space-y-3 h-80 overflow-y-auto">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`max-w-[85%] px-4 py-2.5 rounded-xl text-sm leading-snug ${
                    m.role === "bot"
                      ? "bg-white/[0.04] border border-white/10 self-start"
                      : "bg-gradient-to-r from-purple-500 to-cyan-500 text-white ml-auto"
                  }`}
                  style={{ marginLeft: m.role === "user" ? "auto" : 0 }}
                >
                  {m.text}
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-1 px-4 py-2.5 w-fit">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about pricing, timelines..."
                className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button
                onClick={send}
                aria-label="Send message"
                className="w-9 h-9 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
