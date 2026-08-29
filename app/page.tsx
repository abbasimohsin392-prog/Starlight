'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import ClickSpark from '@/components/click-spark'
import { FloatingCTA } from '@/components/floating-cta'
import { UrgencyBanner } from '@/components/urgency-banner'
import { JarvisWelcome } from '@/components/jarvis-welcome'
import { LiveStatsTicker } from '@/components/live-stats-ticker'

const nav = ['Services', 'Solutions', 'Pricing', 'FAQ', 'About']

const testimonials = [
  { quote: 'Starlight gave our team back 15 hours every week. The system feels like it was built inside our business.', name: 'Maya Al-Sabah', role: 'Founder, Kanso Studio' },
  { quote: 'We went from scattered tools to one calm, intelligent workflow. Our leads now get a response in under a minute.', name: 'Oliver Reed', role: 'Director, Northline Homes' },
  { quote: 'They understood the commercial problem first, then made the technology disappear behind a beautiful experience.', name: 'Sarah Mitchell', role: 'COO, Meridian & Co.' },
]

const services = [
  ['01', 'AI CHATBOTS & ASSISTANTS', 'Custom AI-powered chatbots that handle customer support, lead generation, and internal operations 24/7.'],
  ['02', 'AI RECEPTIONIST', 'A 24/7 AI phone agent that answers calls, books appointments, and qualifies leads so you never miss a customer.'],
  ['03', 'WORKFLOW AUTOMATION', 'End-to-end automation that eliminates manual tasks and streamlines your business processes.'],
  ['04', 'AI INTEGRATION', 'Seamlessly integrate AI capabilities into your existing systems and tech stack.'],
  ['05', 'CUSTOM AI MODELS', 'Tailored machine learning models trained on your data for specific business use cases.'],
  ['06', 'DATA ANALYTICS & BI', 'Transform raw data into actionable insights with AI-powered analytics dashboards.'],
]

const solutions = [
  ['Dental Clinics', 'Healthcare'], ['Real Estate Agencies', 'Real Estate'], ['Law Firms', 'Legal'],
  ['Med Spas', 'Beauty & Wellness'], ['Gyms & Fitness Studios', 'Fitness'], ['Restaurants', 'Hospitality'],
  ['Hair & Nail Salons', 'Beauty & Wellness'], ['Veterinary Clinics', 'Healthcare'], ['Property Management', 'Real Estate'],
  ['Auto Repair Shops', 'Automotive'],
]

const benefits = [
  'Custom AI solutions tailored to your industry',
  'Seamless integration with existing systems',
  'Enterprise-grade security and compliance',
  'Continuous learning and optimization',
  'Real-time analytics and reporting',
  'Dedicated account management',
]

const featureCards = [
  ['10x Faster Deployment', 'Launch AI solutions in weeks, not months.'],
  ['24/7 Availability', 'AI systems that never sleep, always ready to serve.'],
  ['Scalable Architecture', 'Built to grow with your business demands.'],
  ['Dedicated Support', 'Expert team available whenever you need help.'],
]

const plans = [
  { name: 'Growth', desc: 'Perfect for small businesses getting started with AI', features: ['1 Custom AI Chatbot', 'Basic workflow automation', 'Email support', 'Monthly reporting', 'Up to 10k interactions/mo'], popular: false },
  { name: 'Professional', desc: 'For growing companies ready to scale with AI', features: ['3 Custom AI Solutions', 'Advanced automation workflows', 'Priority support (24/7)', 'Real-time analytics dashboard', 'Up to 100k interactions/mo', 'Custom integrations', 'Dedicated account manager'], popular: true },
  { name: 'Enterprise', desc: 'Tailored solutions for large-scale operations', features: ['Unlimited AI Solutions', 'Enterprise-grade security', '24/7 phone & Slack support', 'Custom ML model development', 'Unlimited interactions', 'On-premise deployment option', 'SLA guarantee'], popular: false },
]

const faqs = [
  ['How long does it take to get my AI system up and running?', 'Most clients are live within 2 weeks. A basic AI chatbot can be deployed in as little as 5-7 days. More complex automations or custom builds typically take 2-4 weeks depending on requirements.'],
  ['Do I need any technical knowledge to use the system?', "Zero technical knowledge required. We handle everything from setup to deployment. Once it's live, your AI system runs on autopilot, with a simple dashboard so you can monitor performance anytime."],
  ['What exactly is included in the Growth plan?', 'A fully custom AI chatbot built for your business, integrated directly into your website or platform, plus basic workflow automation. It handles customer queries, lead capture, and appointment booking 24/7, with up to 10k interactions per month.'],
  ['What if I want ongoing support or updates?', 'Our Professional plan includes priority 24/7 support, real-time analytics, custom integrations, and a dedicated account manager to keep your AI systems improving over time.'],
  ['Can the AI integrate with my existing tools and software?', "Yes. We integrate with WhatsApp, Instagram, websites, CRMs, booking systems, email platforms and more. If you use a specific tool, just let us know and we'll make it work."],
  ['Is my business data safe and secure?', 'All data is encrypted end-to-end and we never share your data with third parties. Your business information stays private and under your control at all times.'],
  ['What kind of businesses do you work with?', 'Businesses across every industry: salons, dental clinics, real estate agencies, law firms, e-commerce stores, restaurants, SaaS companies and more.'],
  ["What if I'm not satisfied with the result?", 'We offer revisions until you’re happy with the system. Our goal is real results for your business, not just a finished product.'],
]

// Chatbot demo knowledge base, sourced from the site's own services/pricing/FAQ copy
type KEntry = { keywords: string[]; answer: string; sets?: FollowUp }
type FollowUp = 'services' | 'pricing' | 'booking'

const KNOWLEDGE: KEntry[] = [
  { keywords: ['what is starlight', 'who are you', 'what do you do', 'about starlight'], answer: "Starlight AI builds custom AI chatbots, AI receptionists, and workflow automation for businesses that don't want to keep losing customers to slow response times." },
  { keywords: ['service', 'what can you build', 'what do you offer'], answer: 'Six core things: AI Chatbots & Assistants, an AI Receptionist, Workflow Automation, AI Integration, Custom AI Models, and Data Analytics dashboards. Want detail on any of those?', sets: 'services' },
  { keywords: ['receptionist', 'phone', 'answer calls', 'missed call'], answer: 'The AI Receptionist is a 24/7 phone agent, it answers calls, books appointments, and qualifies leads so nothing falls through after hours.' },
  { keywords: ['price', 'cost', 'how much', 'pricing', 'plan'], answer: 'Three tiers: Growth (1 chatbot, up to 10k interactions/mo), Professional (3 AI solutions, dedicated account manager, up to 100k/mo), and Enterprise (unlimited, custom). Every plan is priced around your setup, want a proposal?', sets: 'pricing' },
  { keywords: ['payment', 'pay', 'invoice', 'wire', 'bank transfer'], answer: 'Three steps: we book a call and agree a plan, we send a USD invoice by email, then you pay via international bank wire transfer.' },
  { keywords: ['how long', 'timeline', 'how fast', 'turnaround'], answer: 'Most clients are live within 2 weeks. A basic chatbot can go live in 5-7 days.' },
  { keywords: ['technical', 'coding', 'setup myself'], answer: 'Zero technical knowledge needed on your end, we handle setup and deployment end to end.' },
  { keywords: ['integrat', 'whatsapp', 'instagram', 'crm'], answer: "We integrate with WhatsApp, Instagram, your website, CRMs, booking systems, and most tools you're already using." },
  { keywords: ['secure', 'security', 'privacy', 'gdpr'], answer: "Everything's encrypted end-to-end and we never share your data with third parties." },
  { keywords: ['industr', 'what businesses', 'what kind of business'], answer: 'All kinds, salons, dental clinics, real estate, law firms, e-commerce, restaurants, and home service businesses too.' },
  { keywords: ['book', 'call', 'demo', 'get started', 'talk to someone'], answer: 'The fastest next step is a free 15-minute strategy call. Want the direct link?', sets: 'booking' },
  { keywords: ['hi', 'hello', 'hey'], answer: "Hey! Ask me about pricing, timelines, what we build, or how payment works." },
  { keywords: ['thanks', 'thank you'], answer: "Anytime! If you're ready, scroll down to book a free strategy call." },
]
const FALLBACKS = [
  "Good question, I don't have that pinned down exactly, but a free 15-minute strategy call is the fastest way to get a precise answer. Want the booking link?",
  "That's best answered directly on a quick call, want me to point you to the booking section?",
]
const FOLLOWUPS: Record<FollowUp, string> = {
  services: 'Sure, which one: AI Chatbots, AI Receptionist, Workflow Automation, AI Integrations, Custom AI Models, or Analytics? Just name one.',
  pricing: 'Growth fits a single chatbot. Professional is most popular, 3 AI solutions and a dedicated manager. Enterprise is fully custom. Want a tailored proposal?',
  booking: 'Here’s the direct link: calendly.com/starlightai306/30min, or scroll down to the booking section below.',
}
const AFFIRM = /^(yes|yeah|yep|sure|ok|okay|please|definitely|go ahead)[.!]?$/i
function getReply(input: string, pending: FollowUp | null): { text: string; next: FollowUp | null } {
  const t = input.toLowerCase().trim()
  if (pending && AFFIRM.test(t)) return { text: FOLLOWUPS[pending], next: null }
  for (const e of KNOWLEDGE) if (e.keywords.some(k => t.includes(k))) return { text: e.answer, next: e.sets ?? null }
  return { text: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)], next: null }
}

const CALENDLY = 'https://calendly.com/starlightai306/30min'
const EMAIL = 'https://mail.google.com/mail/?view=cm&fs=1&to=hello@starlightai.site&su=Business%20Enquiry'
const WHATSAPP = 'https://wa.me/923007657038'
const INSTAGRAM = 'https://www.instagram.com/starlight_.ai/'

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .7, delay, ease: [0.22, 1, .36, 1] }}>{children}</motion.div>
}

function Magnetic({ children, href = '#contact', dark = false }: { children: React.ReactNode; href?: string; dark?: boolean }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18 }), sy = useSpring(y, { stiffness: 250, damping: 18 })
  return <motion.a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} style={{ x: sx, y: sy }} onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .13); y.set((e.clientY - r.top - r.height / 2) * .13) }} onMouseLeave={() => { x.set(0); y.set(0) }} className={`group inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium transition-colors ${dark ? 'bg-foreground text-background hover:bg-cyan' : 'bg-white/10 text-foreground hover:bg-cyan hover:text-background'}`}>{children}<span className="transition-transform group-hover:translate-x-1">↗</span></motion.a>
}

function ChatDemo() {
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([{ role: 'bot', text: 'Hi! I can help book a call or answer a quick question about what we build. What are you trying to solve?' }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [pending, setPending] = useState<FollowUp | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [messages, typing])
  function send() {
    const val = input.trim()
    if (!val) return
    setMessages(m => [...m, { role: 'user', text: val }])
    setInput('')
    setTyping(true)
    const { text, next } = getReply(val, pending)
    setTimeout(() => { setTyping(false); setMessages(m => [...m, { role: 'bot', text }]); setPending(next) }, 800)
  }
  return <div className="glass-card chat-demo">
    <div className="chat-head"><div className="chat-avatar">✦</div><div><strong>Starlight Assistant</strong><small>Demo mode</small></div><span className="chat-dot" /></div>
    <div ref={scrollRef} className="chat-body">
      {messages.map((m, i) => <div key={i} className={`bubble ${m.role}`}>{m.text}</div>)}
      {typing && <div className="typing-dots"><span /><span /><span /></div>}
    </div>
    <div className="chat-input">
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about pricing, timelines..." />
      <button onClick={send} aria-label="Send">↑</button>
    </div>
  </div>
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return <div className="glass-card faq-item">
    <button className="faq-q" onClick={() => setOpen(o => !o)}>{q}<span style={{ transform: open ? 'rotate(45deg)' : 'none' }}>+</span></button>
    <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }} style={{ overflow: 'hidden' }}><p className="faq-a">{a}</p></motion.div>}</AnimatePresence>
  </div>
}

export default function Page() {
  const [intro, setIntro] = useState(true)
  const [testimonial, setTestimonial] = useState(0)
  const [active, setActive] = useState('Services')
  const [scrolled, setScrolled] = useState(false)
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  useEffect(() => { if (sessionStorage.getItem('starlight-intro')) setIntro(false); else { sessionStorage.setItem('starlight-intro', '1'); const t = setTimeout(() => setIntro(false), 1500); return () => clearTimeout(t) } }, [])
  useEffect(() => { const lenis = new Lenis(); let raf = 0; const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }; raf = requestAnimationFrame(loop); return () => { cancelAnimationFrame(raf); lenis.destroy() } }, [])
  useEffect(() => { const onScroll = () => { setScrolled(window.scrollY > 40); for (const id of ['services', 'solutions', 'pricing', 'faq', 'about']) { const el = document.getElementById(id); if (el && window.scrollY >= el.offsetTop - 180) setActive(id[0].toUpperCase() + id.slice(1)) } }; window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll) }, [])
  useEffect(() => { const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY }); window.addEventListener('mousemove', move); return () => window.removeEventListener('mousemove', move) }, [])
  useEffect(() => { const t = setInterval(() => setTestimonial(i => (i + 1) % testimonials.length), 5500); return () => clearInterval(t) }, [])
  const current = useMemo(() => testimonials[testimonial], [testimonial])

  return <ClickSpark sparkColor="#06b6d4" sparkCount={8} sparkRadius={16}>
    <AnimatePresence>{intro && <motion.div className="intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}><motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .7 }} style={{ textAlign: 'center' }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 120, width: 'auto', marginBottom: 22 }} /><p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 22 }}>Build the future. Automate the now.</p><div style={{ width: 160, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', margin: '0 auto' }}><motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, var(--purple), var(--cyan))' }} /></div></motion.div></motion.div>}</AnimatePresence>
    <motion.div className="cursor" animate={{ x: cursor.x, y: cursor.y }} transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
    <UrgencyBanner />
    <FloatingCTA />
    <JarvisWelcome />
    <main>
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <a href="#top" className="logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 44, width: 'auto' }} /></a>
        <div className="nav-links">{nav.map(item => <a key={item} href={`#${item.toLowerCase()}`} className={active === item ? 'active' : ''}>{item}</a>)}</div>
        <Magnetic href={CALENDLY}>Let&apos;s talk</Magnetic>
      </nav>

      <section id="top" className="hero">
        <div className="hero-glow" />
        <div className="hero-copy">
          <Reveal><div className="availability"><i /> AI automation for businesses worldwide <span>→</span></div></Reveal>
          <LiveStatsTicker />
          <Reveal delay={.1}><h1>Build the future.<br /><em>Automate</em> the now.</h1></Reveal>
          <Reveal delay={.2}><p>We design intelligent systems that turn ambitious businesses into effortless operations, with digital marketing to match.</p></Reveal>
          <Reveal delay={.3}><Magnetic dark href={CALENDLY}>Start a conversation</Magnetic></Reveal>
        </div>
        <div className="hero-meta"><span>AI AUTOMATION / DIGITAL GROWTH</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <div className="ticker"><div className="ticker-track">{['INTELLIGENT SYSTEMS', 'WORKFLOW DESIGN', 'DIGITAL GROWTH', 'BUILT FOR HUMANS', 'INTELLIGENT SYSTEMS', 'WORKFLOW DESIGN', 'DIGITAL GROWTH'].map((x, i) => <span key={`${x}-${i}`}>{x} <b>✦</b></span>)}</div></div>

      <section className="trust-strip">
        <Reveal><span className="eyebrow">BUILT FOR</span></Reveal>
        <Reveal delay={.1}><div className="trust-chips">{['Real Estate', 'Healthcare', 'E-commerce', 'Law Firms', 'Finance', 'SaaS'].map(n => <span key={n} className="glass-card trust-chip">{n}</span>)}</div></Reveal>
      </section>

      <section id="services" className="section services">
        <div className="section-head">
          <Reveal><span className="eyebrow">01 / WHAT WE DO</span><h2>Complex problems.<br /><em>Clear solutions.</em></h2></Reveal>
          <Reveal delay={.15}><p className="section-intro">Technology should feel like an advantage, not another thing to manage. We make it work quietly in the background.</p></Reveal>
        </div>
        <div className="service-list">{services.slice(0, 3).map(([n, t, d], i) => <Reveal key={n} delay={i * .06}><article className="service-row"><span className="service-num">{n}</span><h3>{t}</h3><p>{d}</p><span className="row-arrow">↗</span></article></Reveal>)}</div>
        <Reveal delay={.2}><div style={{ textAlign: 'center', marginTop: 26 }}><a href="/services" style={{ color: 'var(--cyan)', fontSize: 13 }}>View all 6 services in detail →</a></div></Reveal>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 70 }} className="about">
          <Reveal><span className="eyebrow">02 / WHY CHOOSE US</span><h2 style={{ marginTop: 22 }}>The future of business<br />is <em>AI-powered.</em></h2>
            <p className="about-copy" style={{ fontSize: 16 }}>We combine cutting-edge AI technology with deep industry expertise to deliver solutions that transform how you do business.</p>
            <ul className="benefit-list">{benefits.map(b => <li key={b}><span className="dot">✓</span>{b}</li>)}</ul>
          </Reveal>
          <Reveal delay={.15}><div className="feature-grid">{featureCards.map(([t, d]) => <div key={t} className="glass-card feature-card"><div style={{ fontSize: 20 }}>✦</div><h4>{t}</h4><p>{d}</p></div>)}</div></Reveal>
        </div>
      </section>

      <section id="solutions" className="section solutions" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <Reveal><span className="eyebrow">03 / SOLUTIONS BY INDUSTRY</span><h2>Built around<br />your <em>business.</em></h2></Reveal>
          <Reveal delay={.15}><p className="section-intro">Every niche has its own missed calls and slow replies. We build for how your industry actually runs.</p></Reveal>
        </div>
        <Reveal><div className="solutions-grid">{solutions.map(([name, cat]) => <div key={name} className="solution-card"><span className="eyebrow">{cat.toUpperCase()}</span><h4>{name}</h4></div>)}</div></Reveal>
        <Reveal delay={.1}><div style={{ textAlign: 'center', marginTop: 26 }}><a href="/solutions" style={{ color: 'var(--cyan)', fontSize: 13 }}>View all industries in detail →</a></div></Reveal>
      </section>

      <section id="chat-demo" className="section" style={{ paddingTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <Reveal><span className="eyebrow">04 / SEE IT WORK</span><h2 style={{ marginTop: 22, fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}>This is the assistant<br />that <em>answers your calls.</em></h2>
            <p className="about-copy" style={{ fontSize: 16, marginTop: 22 }}>Type a question like a real visitor would. This demo runs on canned logic, your live version connects to your calendar and CRM to actually book the job.</p>
            <ul className="benefit-list">{['Answers instantly, day or night', 'Books directly into your calendar', 'Hands off to a human for anything urgent'].map(f => <li key={f}><span className="dot">✦</span>{f}</li>)}</ul>
          </Reveal>
          <Reveal delay={.15}><div className="glass-card" style={{ padding: 34, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✦</div>
            <h3 style={{ marginBottom: 10 }}>Try the live assistant</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 22 }}>Chat with a real working demo, ask about pricing, timelines, or how it books a call.</p>
            <a href="/demo" className="plan-cta primary" style={{ display: 'inline-block' }}>Open the live demo →</a>
          </div></Reveal>
        </div>
      </section>

      <section id="process" className="section process">
        <Reveal><span className="eyebrow">05 / HOW WE WORK</span><h2>From first thought<br />to <em>full flight.</em></h2></Reveal>
        <div className="process-grid">{[['Discover', 'Find the real opportunity hiding in plain sight.'], ['Design', 'Shape an experience your team will actually use.'], ['Build', 'Make it real with craft, care and the right technology.'], ['Launch', 'Ship with confidence. Learn fast. Keep growing.']].map(([t, d], i) => <Reveal key={t} delay={i * .1}><div className="process-item"><span>0{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></div></Reveal>)}</div>
      </section>

      <section className="quote-section">
        <div className="quote-mark">"</div>
        <AnimatePresence mode="wait"><motion.div key={testimonial} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .45 }}><p className="quote">{current.quote}</p><div className="quote-by"><span>{current.name}</span><span>{current.role}</span></div></motion.div></AnimatePresence>
        <div className="dots">{testimonials.map((_, i) => <button aria-label={`Show testimonial ${i + 1}`} key={i} onClick={() => setTestimonial(i)} className={i === testimonial ? 'selected' : ''} />)}</div>
      </section>

      <section id="pricing" className="section pricing">
        <div className="section-head">
          <Reveal><span className="eyebrow">06 / PRICING</span><h2>Simple, transparent<br /><em>pricing.</em></h2></Reveal>
          <Reveal delay={.15}><p className="section-intro">Every business is different, pricing depends on scope. Get a proposal built around your setup.</p></Reveal>
        </div>
        <div className="pricing-grid">{plans.map((p, i) => <Reveal key={p.name} delay={i * .1}><div className={`glass-card plan-card ${p.popular ? 'popular' : ''}`}>{p.popular && <span className="plan-badge">Most Popular</span>}<h3>{p.name}</h3><p className="plan-desc">{p.desc}</p><span className="plan-tag">Tailored Quote</span></div></Reveal>)}</div>
        <Reveal delay={.3}><div style={{ textAlign: 'center', marginTop: 30 }}><a href="/pricing" style={{ color: 'var(--cyan)', fontSize: 13 }}>See full plan features & how payment works →</a></div></Reveal>
      </section>

      <section id="faq" className="section faq" style={{ paddingTop: 0 }}>
        <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <Reveal><span className="eyebrow">07 / FAQ</span><h2>Frequently asked<br /><em>questions.</em></h2></Reveal>
        </div>
        <div className="faq-list">{faqs.slice(0, 4).map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}</div>
        <Reveal delay={.2}><div style={{ textAlign: 'center', marginTop: 26 }}><a href="/services" style={{ color: 'var(--cyan)', fontSize: 13 }}>See all FAQs →</a></div></Reveal>
      </section>

      <section id="about" className="section about">
        <div><Reveal><span className="eyebrow">08 / THE STUDIO</span><h2>Not an agency.<br /><em>A thinking partner.</em></h2></Reveal></div>
        <Reveal delay={.15}>
          <p className="about-copy">Starlight is a small, senior team for businesses ready to move with intention. We blend the imagination of a design studio with the rigour of an engineering team, so your growth system feels as considered as your brand.</p>
          <div className="stats"><div><strong>12<span>+</span></strong><small>Automations launched</small></div><div><strong>4<span>x</span></strong><small>Average ROI on systems</small></div><div><strong>24<span>/7</span></strong><small>Ideas in motion</small></div></div>
        </Reveal>
      </section>

      <section className="section story" style={{ paddingTop: 0 }}>
        <Reveal><div className="glass-card story-card">
          <span className="eyebrow">FROM THE FOUNDER</span>
          <p style={{ marginTop: 18 }}>Starlight AI started with a simple observation: small businesses lose revenue every day to something completely preventable, a missed call, a slow reply, a lead that goes cold. I founded Starlight AI to close that gap.</p>
          <p className="sign">— Aoun, Founder, Starlight AI</p>
          <a href="/about" style={{ color: 'var(--cyan)', fontSize: 13 }}>Read the full story →</a>
        </div></Reveal>
      </section>

      <section id="book" className="section" style={{ paddingTop: 0 }}>
        <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <Reveal><span className="eyebrow">09 / NEXT STEP</span><h2>Book a <em>15-minute call.</em></h2></Reveal>
        </div>
        <Reveal delay={.15}><div className="glass-card booking-frame"><iframe src={`${CALENDLY}?hide_gdpr_banner=1&background_color=0d0d0f&text_color=f5f5f5&primary_color=a855f7`} title="Book a call with Starlight AI" /></div></Reveal>
      </section>

      <section id="contact" className="contact">
        <div className="contact-inner">
          <Reveal><span className="eyebrow">10 / YOUR NEXT MOVE</span><h2>Let&apos;s make<br /><em>something happen.</em></h2><p>Tell us where you want to go. We&apos;ll help you map the way there.</p><Magnetic dark href={EMAIL}>hello@starlightai.site</Magnetic></Reveal>
          <div className="contact-side"><span>Based in</span><strong>Pakistan · Serving US · UK · Kuwait</strong><span>Reach us on</span><strong><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>WhatsApp</a></strong></div>
        </div>
      </section>

      <footer style={{ flexWrap: 'wrap', gap: 16 }}>
        <a href="#top" className="logo" style={{ display: 'flex', alignItems: 'center' }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 20, width: 'auto' }} /></a>
        <span>© 2026 Starlight AI</span>
        <div><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a><a href={EMAIL} target="_blank" rel="noopener noreferrer">Email</a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="/blog">Blog</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
      </footer>
    </main>
  </ClickSpark>
}
