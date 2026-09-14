'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import dynamic from 'next/dynamic'

const LiveStatsTicker = dynamic(() => import('@/components/live-stats-ticker').then((m) => m.LiveStatsTicker), { ssr: false, loading: () => null })

const CALENDLY = 'https://calendly.com/starlightai306/30min'
const EMAIL = 'mailto:hello@starlightai.site'
const WHATSAPP = 'https://wa.me/923007657038'
const INSTAGRAM = 'https://www.instagram.com/starlight_.ai/'

const FloatingCTA = dynamic(() => import('@/components/floating-cta').then((m) => m.FloatingCTA), { ssr: false, loading: () => null })
const UrgencyBanner = dynamic(() => import('@/components/urgency-banner').then((m) => m.UrgencyBanner), { ssr: false, loading: () => null })
const JarvisWelcome = dynamic(() => import('@/components/jarvis-welcome').then((m) => m.JarvisWelcome), { ssr: false, loading: () => null })
const LiveDemoPopup = dynamic(() => import('@/components/live-demo-popup').then((m) => m.LiveDemoPopup), { ssr: false, loading: () => null })

const nav = ['Services', 'Solutions', 'Pricing', 'FAQ', 'About']

const services = [
  ['01', 'AI CHATBOTS & ASSISTANTS', 'Custom AI-powered chatbots that handle customer support, lead generation, and internal operations 24/7.'],
  ['02', 'AI RECEPTIONIST', 'A 24/7 AI phone agent that answers calls, books appointments, and qualifies leads so you never miss a customer.'],
  ['03', 'WORKFLOW AUTOMATION', 'End-to-end automation that eliminates manual tasks and streamlines your business processes.'],
  ['04', 'AI INTEGRATION', 'Seamlessly integrate AI capabilities into your existing systems and tech stack.'],
  ['05', 'AI KNOWLEDGE SYSTEMS', 'Practical knowledge and workflow systems shaped around approved business information.'],
  ['06', 'DATA ANALYTICS & BI', 'Transform raw data into actionable insights with AI-powered analytics dashboards.'],
]

const solutions = [
  ['Dental Clinics', 'Healthcare'], ['Real Estate Agencies', 'Real Estate'], ['Law Firms', 'Legal'],
  ['Med Spas', 'Beauty & Wellness'], ['Gyms & Fitness Studios', 'Fitness'], ['Restaurants', 'Hospitality'],
  ['Hair & Nail Salons', 'Beauty & Wellness'], ['Veterinary Clinics', 'Healthcare'], ['Property Management', 'Real Estate'],
  ['Auto Repair Shops', 'Automotive'],
]

const benefits = [
  'Custom AI workflows shaped around your business',
  'Connects to the tools you already use',
  'Clear handoffs when a person needs human judgment',
  'Usage and outcomes reviewed with evidence',
  'Practical analytics and reporting',
  'Founder-led implementation and support',
]

const featureCards = [
  ['Always-on first response', 'Approved enquiries can receive a reply even when your team is busy or offline.'],
  ['Scalable workflows', 'Start with one focused workflow and expand when the evidence supports it.'],
  ['Human handoff', 'Sensitive, urgent, or uncertain requests can move to a person using agreed rules.'],
  ['Clear reporting', 'Review conversations, handoffs, and outcomes instead of relying on vague promises.'],
]

const plans = [
  { name: 'Starter', desc: 'For solo businesses trying AI for the first time', price: '$97/mo', features: ['1 AI Chatbot or Receptionist', 'Basic workflow automation', 'Email support', 'Up to 5,000 chat messages/mo', 'Up to 100 call minutes/mo'], popular: false },
  { name: 'Growth', desc: 'Perfect for small businesses getting started with AI', price: '$197/mo', features: ['1 Custom AI Chatbot', 'Basic workflow automation', 'Email support', 'Monthly reporting', 'Up to 10,000 chat messages/mo', 'Up to 300 call minutes/mo'], popular: false },
  { name: 'Professional', desc: 'For growing companies ready to scale with AI', price: '$397/mo', features: ['3 Custom AI Solutions', 'Advanced automation workflows', 'Support scope agreed in proposal', 'Real-time analytics dashboard', 'Up to 100,000 chat messages/mo', 'Up to 1,500 call minutes/mo', 'Custom integrations'], popular: true },
  { name: 'Enterprise', desc: 'Tailored solutions for large-scale operations', price: 'Tailored Quote', features: ['Custom workflow scope', 'Security and deployment requirements reviewed', 'Usage limits agreed in proposal', 'Support and reporting scope agreed upfront'], popular: false },
]

const faqs = [
  ['How long does it take to get my AI system up and running?', 'Timing depends on the workflow and integrations. We scope the first useful workflow before committing to a delivery date.'],
  ['Do I need any technical knowledge to use the system?', 'No. We handle the agreed setup and explain the workflow in practical terms, with a human handoff when your team needs to take over.'],
  ['What exactly is included in the Growth plan?', 'The Growth plan is $197/month and includes one custom AI chatbot, basic workflow automation, email support, monthly reporting, up to 10,000 chat messages, and up to 300 call minutes per month.'],
  ['What if I want ongoing support or updates?', 'Support and update scope is defined before work begins. Professional and Enterprise proposals can include broader review, reporting, and improvement work where appropriate.'],
  ['Can the AI integrate with my existing tools and software?', 'Usually, yes, depending on the tools and access available. We review the required integrations and any limits before promising a workflow.'],
  ['Is my business data safe and secure?', 'Data handling depends on the tools and workflow. We discuss access, retention, permissions, and escalation requirements before implementation rather than making blanket security claims.'],
  ['What kind of businesses do you work with?', 'We focus on businesses with repetitive enquiries, missed calls, lead follow-up, appointment booking, or admin handoffs that can be improved with a carefully scoped workflow.'],
  ["What if I'm not satisfied with the result?", 'The agreed scope, review points, and change process are set out before implementation so expectations are clear.'],
]

const homepageStructuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'AI Automation Agency | Starlight AI',
    url: 'https://starlightai.site/',
    description: 'AI receptionists, chatbots, and workflow automation that answer enquiries, qualify leads, and reduce repetitive admin.',
    isPartOf: { '@type': 'WebSite', name: 'Starlight AI', url: 'https://starlightai.site/' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  },
]

function Reveal({ children, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <div className={className}>{children}</div>
}

function Magnetic({ children, href = '#contact', dark = false }: { children: React.ReactNode; href?: string; dark?: boolean }) {
  return <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className={`group inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium transition-colors ${dark ? 'bg-foreground text-background hover:bg-cyan' : 'bg-white/10 text-foreground hover:bg-cyan hover:text-background'}`}>{children}<span className="transition-transform group-hover:translate-x-1">↗</span></a>
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return <div className="glass-card faq-item">
    <button className="faq-q" onClick={() => setOpen(o => !o)}>{q}<span style={{ transform: open ? 'rotate(45deg)' : 'none' }}>+</span></button>
    <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }} style={{ overflow: 'hidden' }}><p className="faq-a">{a}</p></motion.div>}</AnimatePresence>
  </div>
}

function BookingFrame() {
  const frameRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setReady(true)
      observer.disconnect()
    }, { rootMargin: '200px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return <div ref={frameRef} className="glass-card booking-frame" style={{ minHeight: 680 }}>
    {ready ? <iframe src={`${CALENDLY}?hide_gdpr_banner=1&background_color=0d0d0f&text_color=f5f5f5&primary_color=a855f7`} title="Book a call with Starlight AI" /> : <div style={{ minHeight: 680 }} />}
  </div>
}

export default function Page() {
  const [intro, setIntro] = useState(true)
  const [active, setActive] = useState('Services')
  const [scrolled, setScrolled] = useState(false)
  const [enhancementsReady, setEnhancementsReady] = useState(false)
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setIntro(false); return }
    if (sessionStorage.getItem('starlight-intro')) setIntro(false)
    else { sessionStorage.setItem('starlight-intro', '1'); const t = setTimeout(() => setIntro(false), 1500); return () => clearTimeout(t) }
  }, [])
  useEffect(() => {
    const enable = () => setEnhancementsReady(true)
    const timer = window.setTimeout(enable, 15000)
    window.addEventListener('scroll', enable, { once: true, passive: true })
    window.addEventListener('pointerdown', enable, { once: true, passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', enable)
      window.removeEventListener('pointerdown', enable)
    }
  }, [])
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cancelled = false
    let raf = 0
    let destroy = () => {}
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      const lenis = new Lenis()
      const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
      destroy = () => lenis.destroy()
    })
    return () => { cancelled = true; cancelAnimationFrame(raf); destroy() }
  }, [])
  useEffect(() => { const onScroll = () => { setScrolled(window.scrollY > 40); for (const id of ['services', 'solutions', 'pricing', 'faq', 'about']) { const el = document.getElementById(id); if (el && window.scrollY >= el.offsetTop - 180) setActive(id[0].toUpperCase() + id.slice(1)) } }; window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll) }, [])
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  
  return <div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }} />
    <AnimatePresence>{intro && <motion.div className="intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}><motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .7 }} style={{ textAlign: 'center' }}><img src="/starlight-logo-256.png" alt="Starlight AI" style={{ height: 120, width: 'auto', marginBottom: 22 }} /><p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 22 }}>Build the future. Automate the now.</p><div style={{ width: 160, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', margin: '0 auto' }}><motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, var(--purple), var(--cyan))' }} /></div></motion.div></motion.div>}</AnimatePresence>
    <motion.div className="cursor" animate={{ x: cursor.x, y: cursor.y }} transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
    {enhancementsReady && <>
      <UrgencyBanner />
      <FloatingCTA />
      <JarvisWelcome />
      <LiveDemoPopup />
    </>}
    <main>
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <a href="#top" className="logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><img src="/starlight-logo-256.png" alt="Starlight AI" style={{ height: 60, width: 'auto' }} /></a>
        <div className="nav-links">{nav.map(item => <a key={item} href={`#${item.toLowerCase()}`} className={active === item ? 'active' : ''}>{item}</a>)}</div>
        <Magnetic href={CALENDLY}>Let&apos;s talk</Magnetic>
      </nav>

      <section id="top" className="hero">
        <div className="hero-glow" />
        <div className="hero-copy">
          <Reveal><div className="availability"><i /> AI automation for businesses worldwide <span>→</span></div></Reveal>
          <LiveStatsTicker />
          <Reveal delay={.1}><h1>Build the future.<br /><em>Automate</em> the now.</h1></Reveal>
          <Reveal delay={.2}><p>Most businesses do not need another dashboard. They need every new enquiry answered, qualified, and moved to the next step without adding headcount. We design the workflow that makes that happen.</p></Reveal>
          <Reveal delay={.3}><Magnetic dark href={CALENDLY}>Start a conversation</Magnetic></Reveal>
        </div>
        <div className="hero-meta"><span>AI AUTOMATION / DIGITAL GROWTH</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <div className="ticker"><div className="ticker-track">{['INTELLIGENT SYSTEMS', 'WORKFLOW DESIGN', 'DIGITAL GROWTH', 'BUILT FOR HUMANS', 'INTELLIGENT SYSTEMS', 'WORKFLOW DESIGN', 'DIGITAL GROWTH'].map((x, i) => <span key={`${x}-${i}`}>{x} <b>✦</b></span>)}</div></div>

      <section className="trust-strip">
        <Reveal><span className="eyebrow">BUILT FOR</span></Reveal>
        <Reveal delay={.1}><div className="trust-chips">{['Real Estate', 'Healthcare', 'E-commerce', 'Law Firms', 'Finance', 'SaaS'].map(n => <span key={n} className="glass-card trust-chip">{n}</span>)}</div></Reveal>
      </section>

      <section className="section" aria-labelledby="problem-heading">
        <div className="section-head">
          <Reveal><span className="eyebrow">THE PROBLEM WE SOLVE</span><h2 id="problem-heading">Revenue leaks hide in<br /><em>ordinary moments.</em></h2></Reveal>
          <Reveal delay={.15}><p className="section-intro">A missed call, an unanswered form, or a lead waiting until tomorrow is not just an admin issue. It is a customer choosing the business that replied first.</p></Reveal>
        </div>
        <div className="feature-grid">
          <Reveal><article className="glass-card feature-card"><div className="eyebrow">01 / MISSED ENQUIRIES</div><h4>Calls and messages go unanswered</h4><p>We give every new enquiry a fast first response, even when your team is serving customers, driving, or offline.</p></article></Reveal>
          <Reveal delay={.08}><article className="glass-card feature-card"><div className="eyebrow">02 / ADMIN OVERLOAD</div><h4>Your team repeats the same work</h4><p>We automate approved questions, data capture, reminders, and routing so people spend more time on work that needs judgment.</p></article></Reveal>
          <Reveal delay={.16}><article className="glass-card feature-card"><div className="eyebrow">03 / COLD LEADS</div><h4>Interested prospects lose momentum</h4><p>We build follow-up paths that keep the conversation moving toward a booking, quote, consultation, or human handoff.</p></article></Reveal>
        </div>
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
            <p className="about-copy" style={{ fontSize: 16 }}>We do not start with a tool. We start with the expensive problem: missed demand, slow response, repetitive admin, or a handoff that breaks. Then we design the smallest useful system around your existing operation.</p>
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

      <section className="section" aria-labelledby="rollout-heading">
        <Reveal><span className="eyebrow">WHAT YOU GET</span><h2 id="rollout-heading">Start with one workflow.<br /><em>Measure the difference.</em></h2></Reveal>
        <div className="process-grid">
          {[["Map the leak", "We review where enquiries slow down, what your team repeats, and which handoffs cost the most opportunities."], ["Build the first win", "We launch one focused workflow around your highest-value enquiry path instead of forcing a risky all-at-once change."], ["Connect the tools", "We connect the assistant to the calendar, CRM, inbox, or booking flow your team already uses."], ["Improve with evidence", "You see the conversations, handoffs, and bookings that matter, then we refine what is not working."]].map(([t, d], i) => <Reveal key={t} delay={i * .08}><div className="process-item"><span>0{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></div></Reveal>)}
        </div>
        <Reveal delay={.2}><div style={{ textAlign: 'center', marginTop: 30 }}><Magnetic dark href={CALENDLY}>Get a workflow review</Magnetic></div></Reveal>
      </section>

      <section id="pricing" className="section pricing">
        <div className="section-head">
          <Reveal><span className="eyebrow">06 / PRICING</span><h2>Simple, transparent<br /><em>pricing.</em></h2></Reveal>
          <Reveal delay={.15}><p className="section-intro">Every business is different, pricing depends on scope. Get a proposal built around your setup.</p></Reveal>
        </div>
        <div className="pricing-grid">{plans.map((p, i) => <Reveal key={p.name} delay={i * .1}><div className={`glass-card plan-card ${p.popular ? 'popular' : ''}`}>{p.popular && <span className="plan-badge">Most Popular</span>}<h3>{p.name}</h3><p className="plan-desc">{p.desc}</p><span className="plan-tag">{p.price}</span></div></Reveal>)}</div>
        <Reveal delay={.3}><div style={{ textAlign: 'center', marginTop: 30 }}><a href="/pricing" style={{ color: 'var(--cyan)', fontSize: 13 }}>See full plan features & how payment works →</a></div></Reveal>
      </section>

      <section id="faq" className="section faq" style={{ paddingTop: 0 }}>
        <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <Reveal><span className="eyebrow">07 / FAQ</span><h2>Frequently asked<br /><em>questions.</em></h2></Reveal>
        </div>
        <div className="faq-list">{faqs.slice(0, 4).map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}</div>
        <Reveal delay={.2}><div style={{ textAlign: 'center', marginTop: 26 }}><a href="/pricing" style={{ color: 'var(--cyan)', fontSize: 13 }}>See all FAQs →</a></div></Reveal>
      </section>

      <section id="about" className="section about">
        <div><Reveal><span className="eyebrow">08 / THE STUDIO</span><h2>Not an agency.<br /><em>A thinking partner.</em></h2></Reveal></div>
        <Reveal delay={.15}>
          <p className="about-copy">Starlight is a founder-led practice for businesses ready to move with intention. We combine thoughtful design with practical engineering, so your growth system fits the way your business actually runs.</p>
          <div className="stats"><div><strong>1</strong><small>Focused workflow to start</small></div><div><strong>Clear</strong><small>Scope before build</small></div><div><strong>Human</strong><small>Handoff when needed</small></div></div>
        </Reveal>
      </section>

      <section className="section story" style={{ paddingTop: 0 }}>
        <Reveal><div className="glass-card story-card">
          <span className="eyebrow">FROM THE FOUNDER</span>
          <p style={{ marginTop: 18 }}>Starlight AI started with a simple observation: small businesses lose revenue every day to something completely preventable, a missed call, a slow reply, a lead that goes cold. I founded Starlight AI to close that gap.</p>
          <p className="sign">Aoun, Founder, Starlight AI</p>
          <a href="/about" style={{ color: 'var(--cyan)', fontSize: 13 }}>Read the full story →</a>
        </div></Reveal>
      </section>

      <section id="book" className="section" style={{ paddingTop: 0 }}>
        <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <Reveal><span className="eyebrow">09 / NEXT STEP</span><h2>Book a <em>15-minute call.</em></h2></Reveal>
        </div>
        <Reveal delay={.15}><BookingFrame /></Reveal>
      </section>

      <section id="contact" className="contact">
        <div className="contact-inner">
          <Reveal><span className="eyebrow">10 / YOUR NEXT MOVE</span><h2>Let&apos;s make<br /><em>something happen.</em></h2><p>Tell us where you want to go. We&apos;ll help you map the way there.</p><Magnetic dark href={EMAIL}>hello@starlightai.site</Magnetic></Reveal>
          <div className="contact-side"><span>Based in</span><strong>Pakistan · Serving US · UK · Kuwait</strong><span>Reach us on</span><strong><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>WhatsApp</a></strong></div>
        </div>
      </section>

      <footer style={{ flexWrap: 'wrap', gap: 16 }}>
        <a href="#top" className="logo" style={{ display: 'flex', alignItems: 'center' }}><img src="/starlight-logo-256.png" alt="Starlight AI" style={{ height: 20, width: 'auto' }} /></a>
        <span>© 2026 Starlight AI</span>
        <div><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a><a href={EMAIL} target="_blank" rel="noopener noreferrer">Email</a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="/blog">Blog</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
      </footer>
    </main>
  </div>
}
