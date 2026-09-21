"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const CALENDLY = "https://calendly.com/starlightai306/30min"
const EMAIL = "mailto:hello@starlightai.site"
const WHATSAPP = "https://wa.me/923007657038"
const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
]

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .7, delay, ease: [0.22, 1, .36, 1] }}>{children}</motion.div>
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return <div className="glass-card faq-item">
    <button type="button" className="faq-q" onClick={() => setOpen(o => !o)}>{q}<span style={{ transform: open ? "rotate(45deg)" : "none" }}>+</span></button>
    <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }} style={{ overflow: "hidden" }}><p className="faq-a">{a}</p></motion.div>}</AnimatePresence>
  </div>
}

const plans = [
  {
    name: "Starter",
    desc: "For solo businesses trying AI for the first time",
    monthlyPrice: 97,
    annualPrice: 77,
    features: ["1 AI Chatbot or Receptionist", "Basic workflow automation", "Email support", "Up to 5,000 chat messages/mo", "Up to 100 call minutes/mo"],
    popular: false,
  },
  {
    name: "Growth",
    desc: "Perfect for small businesses getting started with AI",
    monthlyPrice: 197,
    annualPrice: 157,
    features: ["1 Custom AI Chatbot", "Basic workflow automation", "Email support", "Monthly reporting", "Up to 10,000 chat messages/mo", "Up to 300 call minutes/mo"],
    popular: false,
  },
  {
    name: "Professional",
    desc: "For growing companies ready to scale with AI",
    monthlyPrice: 397,
    annualPrice: 327,
    features: ["Up to 3 scoped AI solutions", "Workflow scope agreed in proposal", "Support hours and channels agreed in proposal", "Reporting scope agreed in proposal", "Usage limits agreed in proposal", "Custom integrations subject to scope", "Named point of contact subject to plan"],
    popular: true,
  },
  {
    name: "Enterprise",
    desc: "Tailored solutions for large-scale operations",
    monthlyPrice: null,
    annualPrice: null,
    features: ["Custom workflow scope", "Security requirements reviewed in proposal", "Support hours and channels agreed in proposal", "Custom model work assessed case by case", "Usage limits agreed in proposal", "Deployment options assessed case by case", "Service levels agreed in proposal"],
    popular: false,
  },
]

const faqs: [string, string][] = [
  ["Are all plans monthly subscriptions?", "Monthly plans can be cancelled with notice. The annual option is a discounted 12-month commitment billed monthly; the exact cancellation terms are shown in the proposal before approval."],
  ["Are there any ongoing costs?", "Your monthly plan covers usage, support, and maintenance. Optional premium support, extra training, or major upgrades may have separate costs, but those are always discussed upfront."],
  ["Can I upgrade my plan later?", "Yes, you can upgrade to a higher tier at any time. You will only pay the difference between your current plan and the new plan."],
  ["Do you offer refunds?", "We begin with a scoped workflow review and agree the pilot deliverables before build. Any refund or cancellation terms are stated in the proposal so there are no hidden assumptions."],
  ["What happens if I go over my plan's usage?", "We will give you a heads-up before you hit your limit. From there you can move up a tier or add simple per-minute or per-message overage pricing, agreed in advance. No surprise bills."],
]

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly")
  return (
    <main>
      <nav className="nav nav-scrolled">
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center", gap: 8 }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 60, width: "auto" }} /></a>
        <div className="nav-links">{navItems.map(item => <a key={item.href} href={item.href} className={item.label === "Pricing" ? "active" : ""}>{item.label}</a>)}</div>
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex primary" style={{ borderRadius: 999, padding: "12px 20px", fontSize: 14 }}>Let&apos;s talk ↗</a>
      </nav>

      <section className="section" style={{ paddingTop: 170 }}>
        <div className="section-head" style={{ justifyContent: "center", textAlign: "center" }}>
          <Reveal><span className="eyebrow">PRICING</span><h1>Simple, transparent<br /><em className="gradient-text">pricing.</em></h1></Reveal>
          <Reveal delay={.1}><p className="section-intro" style={{ maxWidth: 460, margin: "16px auto 0" }}>For property-management companies, start with a free 3-point enquiry audit. We will review first response, qualification, and handoff before recommending a pilot or subscription.</p></Reveal>
        </div>

        <Reveal delay={.15}><div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 60 }}>
          <button type="button" onClick={() => setBilling("monthly")} className="inline-flex" style={{ borderRadius: 999, padding: "10px 20px", fontSize: 13, fontWeight: 500, border: "1px solid var(--line)", background: billing === "monthly" ? "linear-gradient(135deg, var(--purple), var(--cyan))" : "transparent", color: billing === "monthly" ? "#fff" : "var(--muted)", cursor: "pointer" }}>Monthly</button>
          <button type="button" onClick={() => setBilling("annual")} className="inline-flex" style={{ borderRadius: 999, padding: "10px 20px", fontSize: 13, fontWeight: 500, border: "1px solid var(--line)", background: billing === "annual" ? "linear-gradient(135deg, var(--purple), var(--cyan))" : "transparent", color: billing === "annual" ? "#fff" : "var(--muted)", cursor: "pointer" }}>Annual <span style={{ opacity: .8, fontSize: 11 }}>(12-month commitment)</span></button>
        </div></Reveal>

        <div className="pricing-grid">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * .1}>
              <div className={`glass-card plan-card ${p.popular ? "popular" : ""}`} style={{ position: "relative" }}>
                {p.popular && <span className="plan-badge">Most Popular</span>}
                <h3>{p.name}</h3>
                <p className="plan-desc">{p.desc}</p>
                {p.monthlyPrice ? (
                  <div style={{ margin: "0 0 22px" }}>
                    <span style={{ fontSize: 34, fontWeight: 700 }}>${billing === "monthly" ? p.monthlyPrice : p.annualPrice}</span>
                    <span style={{ color: "var(--muted)", fontSize: 13 }}>/mo</span>
                    {billing === "annual" && (
                      <div style={{ color: "var(--cyan)", fontSize: 12, marginTop: 4 }}>
                        Billed monthly for a 12-month commitment
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="plan-tag">Tailored Quote</span>
                )}
                <ul className="plan-features">
                  {p.features.map(f => <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--muted)" }}><span className="check">✓</span>{f}</li>)}
                </ul>
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="plan-cta">Discuss this plan</a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head" style={{ justifyContent: "center", textAlign: "center" }}>
          <Reveal><span className="eyebrow">FAQ</span><h2>Frequently asked<br /><em>questions.</em></h2></Reveal>
        </div>
        <div className="faq-list">{faqs.map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}</div>
      </section>

      <footer style={{ flexWrap: "wrap", gap: 16 }}>
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center" }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 20, width: "auto" }} /></a>
        <span>© 2026 Starlight AI</span>
        <div><a href={EMAIL} target="_blank" rel="noopener noreferrer">Email</a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="/blog">Blog</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
      </footer>
    </main>
  )
}
