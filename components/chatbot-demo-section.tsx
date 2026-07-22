"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Bot, Send, Sparkles } from "lucide-react"

type Message = { role: "bot" | "user"; text: string }

const INITIAL: Message = {
  role: "bot",
  text: "Hi! I can help book a call or answer a quick question about what we build. What are you trying to solve?",
}

type KnowledgeEntry = { keywords: string[]; answer: string; sets?: FollowUpId }
type FollowUpId = "servicesDetail" | "pricingPlan" | "bookingLink"

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
    sets: "servicesDetail",
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
      "Three tiers: Growth is $297/mo — one custom AI chatbot, basic automation, up to 10k interactions/mo. Professional is $997/mo — 3 AI solutions, 24/7 priority support, custom integrations, up to 100k interactions/mo. Enterprise is custom-quoted for unlimited scale. Which sounds closest to your business?",
    sets: "pricingPlan",
  },
  {
    keywords: ["growth plan", "growth tier", "297"],
    answer:
      "Growth ($297/mo) gets you 1 custom AI chatbot, basic workflow automation, email support, monthly reporting, and up to 10k interactions a month — it's the starting point for small businesses.",
  },
  {
    keywords: ["professional plan", "professional tier", "997"],
    answer:
      "Professional ($997/mo) is our most popular — 3 custom AI solutions, advanced automation, 24/7 priority support, real-time analytics, custom integrations, a dedicated account manager, and up to 100k interactions/mo.",
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
    keywords: ["book", "call", "demo", "get started", "talk to someone", "human", "speak to", "sales"],
    answer:
      "The fastest next step is a free 15-minute strategy call — no pressure, just a quick chat about your setup. Want the direct link?",
    sets: "bookingLink",
  },
  {
    keywords: ["contract", "commit", "lock in", "cancel", "cancellation", "minimum term", "how long do i have to"],
    answer:
      "Every plan is a straightforward monthly subscription — no long lock-in contracts. You can cancel anytime; we just ask for notice so we can hand things off cleanly.",
  },
  {
    keywords: ["trial", "free trial", "test it first", "try before"],
    answer:
      "We don't run open free trials, but the strategy call itself is free and we'll show you exactly what your bot would look like before you commit to anything.",
  },
  {
    keywords: ["roi", "worth it", "results", "how many leads", "does it actually work", "proof", "case stud", "example client"],
    answer:
      "Most home service clients see it pay for itself by catching the after-hours and during-a-job calls they were previously missing entirely. Happy to walk through exactly how that plays out for your business on a call.",
  },
  {
    keywords: ["competitor", "vs zapier", "vs other", "why you", "why starlight", "different from"],
    answer:
      "The difference is we don't hand you a generic tool and walk away — we build, train, and manage the whole system around your business, and you get a real person (not a ticket queue) if something needs adjusting.",
  },
  {
    keywords: ["multilingual", "language", "spanish", "other languages"],
    answer:
      "Yes, the AI can handle multiple languages including Spanish — just let us know which ones your customers use and we'll set it up.",
  },
  {
    keywords: ["setup fee", "onboarding fee", "hidden fee", "extra cost", "additional cost"],
    answer:
      "No hidden fees — the plan price covers setup and the ongoing system. Anything beyond your plan's scope (like extra interaction volume) would be discussed upfront, never billed as a surprise.",
  },
  {
    keywords: ["maintenance", "who manages", "updates", "who maintains", "ongoing work"],
    answer:
      "We handle all the ongoing maintenance and updates on our end — you're not left to manage settings or fix things yourself.",
  },
  {
    keywords: ["website", "build a website", "landing page", "do you build sites"],
    answer:
      "We're focused on AI chatbots, receptionists, and automation rather than website design — but if you already have a site, we plug straight into it.",
  },
  {
    keywords: ["seo", "marketing", "social media", "ads", "digital marketing"],
    answer:
      "Our core focus is AI automation, but we also offer digital marketing support — happy to cover that on a strategy call if it's something you need.",
  },
  {
    keywords: ["own my data", "who owns", "data ownership", "export my data"],
    answer:
      "Your data is yours. It's never sold or shared, and you can request an export at any time.",
  },
  {
    keywords: ["uptime", "downtime", "reliab", "always on", "24/7"],
    answer:
      "The system runs 24/7 with high uptime, so calls and messages get handled whether it's 2pm or 2am.",
  },
  {
    keywords: ["doesn't know", "handoff", "escalate", "what if it can't answer", "urgent"],
    answer:
      "If something's outside the bot's scope or sounds urgent, it hands off to a real person on your team instead of guessing.",
  },
  {
    keywords: ["personality", "customize", "sound like", "brand voice", "tone"],
    answer:
      "We tune the tone and personality to match your brand — friendly and casual, or more formal, whatever fits how your business talks to customers.",
  },
  {
    keywords: ["who built", "who made", "who is starlight", "founder", "company"],
    answer:
      "Starlight AI is a small, hands-on AI automation studio — you work directly with the team building your system, not a big impersonal agency.",
  },
  {
    keywords: ["hi", "hello", "hey", "yo", "sup"],
    answer:
      "Hey! Happy to help — ask me about pricing, timelines, what we build, or how payment works. What's on your mind?",
  },
  {
    keywords: ["thanks", "thank you", "appreciate"],
    answer:
      "Anytime! If you're ready, the next step is a free 15-minute strategy call — just scroll down to book one.",
  },
  {
    keywords: ["bye", "goodbye", "see you"],
    answer:
      "Take care! When you're ready, the booking section below has a free strategy call slot waiting.",
  },
]

const FALLBACKS = [
  "Good question — I don't have that pinned down exactly, but a free 15-minute strategy call is the fastest way to get a precise answer for your business. Want the booking link?",
  "That's a bit outside what I can nail down here, but the team can answer it directly on a quick call — want me to point you to the booking section?",
  "I want to give you a real answer, not a guess — that's best covered on a free strategy call. Should I point you there?",
]

const FOLLOWUPS: Record<FollowUpId, string> = {
  servicesDetail:
    "Sure — which one: AI Chatbots & Assistants, AI Receptionist, Workflow Automation, AI Integrations, Custom AI Models, or Analytics Dashboards? Just name one.",
  pricingPlan:
    "Growth ($297/mo) fits a single chatbot and basic automation. Professional ($997/mo) is our most popular — 3 AI solutions and a dedicated account manager. Enterprise is custom. Which sounds like your size?",
  bookingLink:
    "Here's the direct link: calendly.com/starlightai306/30min — or scroll down to the booking section on this page. Takes 15 minutes, no pressure.",
}

const AFFIRMATIVE = /^(yes|yeah|yep|yup|sure|ok|okay|please|pls|definitely|absolutely|of course|go ahead)[.!]?$/i
const NEGATIVE = /^(no|nah|nope|not really|not now|maybe later)[.!]?$/i

const NUDGE =
  "Happy to help — what would you like more on: pricing, services, timelines, or booking a call?"

function getReply(input: string, pending: FollowUpId | null): { text: string; nextPending: FollowUpId | null } {
  const t = input.toLowerCase().trim()

  if (pending && AFFIRMATIVE.test(t)) {
    return { text: FOLLOWUPS[pending], nextPending: null }
  }
  if (pending && NEGATIVE.test(t)) {
    return { text: NUDGE, nextPending: null }
  }

  for (const entry of KNOWLEDGE) {
    if (entry.keywords.some((k) => t.includes(k))) {
      return { text: entry.answer, nextPending: entry.sets ?? null }
    }
  }

  if (AFFIRMATIVE.test(t)) {
    return { text: NUDGE, nextPending: null }
  }

  return { text: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)], nextPending: null }
}

export function ChatbotDemoSection() {
  const [messages, setMessages] = useState<Message[]>([INITIAL])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [pending, setPending] = useState<FollowUpId | null>(null)
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
    const { text, nextPending } = getReply(val, pending)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { role: "bot", text }])
      setPending(nextPending)
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
