"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Bot, Send, Sparkles } from "lucide-react"

type Message = { role: "bot" | "user"; text: string }

const INITIAL: Message = {
  role: "bot",
  text: "Hi! I can help book a call or answer a quick question about what we build. What are you trying to solve?",
}

type KnowledgeEntry = { keywords: string[]; answer: string }

// Sourced directly from the real site content (services-section, pricing-section, faq-section)
// so the demo never contradicts what's actually on the page.
const KNOWLEDGE: KnowledgeEntry[] = [
  {
    keywords: ["what is starlight", "who are you", "what do you do", "about starlight", "what is this"],
    answer:
      "Starlight AI builds custom AI chatbots, AI receptionists, and workflow automation for businesses that don't want to keep losing customers to slow response times. Think 24/7 AI that answers, qualifies, and books — not just a script.",
  },
  {
    keywords: ["service", "what can you build", "what do you offer", "what do you make"],
    answer:
      "Six core things: AI Chatbots & Assistants, an AI Receptionist that answers calls 24/7, Workflow Automation, AI Integration into your existing tools, Custom AI Models trained on your data, and AI-powered Data Analytics dashboards. Want detail on any of those?",
  },
  {
    keywords: ["receptionist", "phone", "answer calls", "answer my calls", "missed call"],
    answer:
      "The AI Receptionist is a 24/7 phone agent — it answers calls, books appointments, and qualifies leads so nothing falls through after hours or during a busy shift.",
  },
  {
    keywords: ["custom model", "machine learning", "ml model", "train"],
    answer:
      "For businesses with specific data or workflows, we build tailored machine learning models around your actual use case rather than a generic off-the-shelf bot. That's part of the Professional and Enterprise tiers.",
  },
  {
    keywords: ["analytics", "dashboard", "data insight", "report"],
    answer:
      "We also build AI-powered analytics dashboards that turn your raw business data into something you can actually act on — included from the Professional tier up, with monthly reporting even on Growth.",
  },
  {
    keywords: ["price", "cost", "how much", "pricing", "plan"],
    answer:
      "Three tiers: Growth is $297/mo — one custom AI chatbot, basic automation, up to 10k interactions/mo. Professional is $2,599 one-time — 3 AI solutions, 24/7 priority support, custom integrations, up to 100k interactions/mo. Enterprise is custom-quoted for unlimited scale. Which sounds closest to your business?",
  },
  {
    keywords: ["growth plan", "growth tier", "297"],
    answer:
      "Growth ($297/mo) gets you 1 custom AI chatbot, basic workflow automation, email support, monthly reporting, and up to 10k interactions a month — it's the starting point for small businesses.",
  },
  {
    keywords: ["professional plan", "professional tier", "2599", "2,599"],
    answer:
      "Professional ($2,599 one-time) is our most popular — 3 custom AI solutions, advanced automation, 24/7 priority support, real-time analytics, custom integrations, a dedicated account manager, and up to 100k interactions/mo.",
  },
  {
    keywords: ["enterprise"],
    answer:
      "Enterprise is custom-quoted — unlimited AI solutions, enterprise-grade security, 24/7 phone & Slack support, custom ML development, unlimited interactions, and on-premise deployment if you need it. Best discussed on a call so we can scope it right.",
  },
  {
    keywords: ["payment", "pay", "invoice", "wire", "bank transfer", "how do i pay"],
    answer:
      "Simple 3 steps: we book a call and agree on a plan, we send you a USD invoice by email, then you pay via international bank wire transfer. Payment details go out right after your strategy call.",
  },
  {
    keywords: ["how long", "timeline", "how fast", "how quickly", "when can", "turnaround"],
    answer:
      "Most clients are live within 2 weeks. A basic AI chatbot can go live in 5-7 days. Bigger custom automations or full builds usually take 2-4 weeks depending on scope.",
  },
  {
    keywords: ["technical", "do i need to know", "coding", "setup myself"],
    answer:
      "Zero technical knowledge needed on your end. We handle setup and deployment end to end — once it's live it runs on autopilot, with a simple dashboard so you can check performance anytime.",
  },
  {
    keywords: ["integrat", "whatsapp", "instagram", "crm", "connect to"],
    answer:
      "We integrate with WhatsApp, Instagram, your website, CRMs, booking systems, email platforms, and most tools you're already using. If there's something specific, just tell us and we'll make it work.",
  },
  {
    keywords: ["secure", "security", "data safe", "privacy", "gdpr"],
    answer:
      "Everything's encrypted end-to-end and we never share your data with third parties. Your business data stays private and under your control.",
  },
  {
    keywords: ["industr", "what businesses", "who do you work with", "what kind of business"],
    answer:
      "All kinds — salons, dental clinics, real estate agencies, law firms, e-commerce, restaurants, SaaS companies, and home service businesses too. If you have customers, we can automate how you serve them.",
  },
  {
    keywords: ["not satisfied", "guarantee", "refund", "revision"],
    answer:
      "We offer revisions until you're happy with the system — the goal is a result that actually works for your business, not just a checkbox delivery.",
  },
  {
    keywords: ["support", "help after"],
    answer:
      "Growth includes email support. Professional steps up to 24/7 priority support with a dedicated account manager. Enterprise adds 24/7 phone & Slack support with an SLA.",
  },
  {
    keywords: ["book", "call", "demo", "get started", "talk to someone", "human"],
    answer:
      "The fastest next step is a free 15-minute strategy call — scroll down to the booking section on this page, or I can tell you what we'll cover on it. Want that?",
  },
]

const FALLBACK =
  "Good question — the fastest way to get a precise answer for your business is a free 15-minute strategy call. Want the booking link?"

function getReply(input: string): string {
  const t = input.toLowerCase()
  for (const entry of KNOWLEDGE) {
    if (entry.keywords.some((k) => t.includes(k))) return entry.answer
  }
  return FALLBACK
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
