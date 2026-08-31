"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const CALENDLY = "https://calendly.com/starlightai306/30min"
const EMAIL = "https://mail.google.com/mail/?view=cm&fs=1&to=hello@starlightai.site&su=Business%20Enquiry"
const WHATSAPP = "https://wa.me/923007657038"
const INSTAGRAM = "https://www.instagram.com/starlight_.ai/"
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
    <button className="faq-q" onClick={() => setOpen(o => !o)}>{q}<span style={{ transform: open ? "rotate(45deg)" : "none" }}>+</span></button>
    <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }} style={{ overflow: "hidden" }}><p className="faq-a">{a}</p></motion.div>}</AnimatePresence>
  </div>
}

const plans = [
  {
    name: "Growth",
    desc: "Perfect for small businesses getting started with AI",
    monthlyPrice: 297,
    annualPrice: 247,
    features: ["1 Custom AI Chatbot", "Basic workflow automation", "Email support", "Monthly reporting", "Up to 10k interactions/mo"],
    popular: false,
  },
  {
    name: "Professional",
    desc: "For growing companies ready to scale with AI",
    monthlyPrice: 597,
    annualPrice: 497,
    features: ["3 Custom AI Solutions", "Advanced automation workflows", "Priority support (24/7)", "Real-time analytics dashboard", "Up to 100k interactions/mo", "Custom integrations", "Dedicated account manager"],
    popular: true,
  },
  {
    name: "Enterprise",
    desc: "Tailored solutions for large-scale operations",
    monthlyPrice: null,
    annualPrice: null,
    features: ["Unlimited AI Solutions", "Enterprise-grade security", "24/7 phone & Slack support", "Custom ML model development", "Unlimited interactions", "On-premise deployment option", "SLA guarantee", "Executive business reviews"],
    popular: false,
  },
]

const faqs: [string, string][] = [
  ["Are all plans monthly subscriptions?", "Yes. Growth and Professional run as monthly subscriptions covering ongoing usage, support, and updates. There's no long-term lock-in; you can cancel anytime with notice."],
  ["Are there any ongoing costs?", "Your monthly plan covers usage, support, and maintenance. Optional premium support, extra training, or major upgrades may have separate costs, but those are always discussed upfront."],
  ["Can I upgrade my plan later?", "Yes, you can upgrade to a higher tier at any time. You will only pay the difference between your current plan and the new plan."],
  ["Do you offer refunds?", "We offer a 30-day satisfaction guarantee. If you are not happy with your solution, we will work with you to make it right or provide a full refund."],
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
          <Reveal delay={.1}><p className="section-intro" style={{ maxWidth: 460, margin: "16px auto 0" }}>Every business is different, and pricing depends on scope. Get a proposal built around your setup.</p></Reveal>
        </div>

        <Reveal delay={.15}><div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 60 }}>
          <button onClick={() => setBilling("monthly")} className="inline-flex" style={{ borderRadius: 999, padding: "10px 20px", fontSize: 13, fontWeight: 500, border: "1px solid var(--line)", background: billing === "monthly" ? "linear-gradient(135deg, var(--purple), var(--cyan))" : "transparent", color: billing === "monthly" ? "#fff" : "var(--muted)", cursor: "pointer" }}>Monthly</button>
          <button onClick={() => setBilling("annual")} className="inline-flex" style={{ borderRadius: 999, padding: "10px 20px", fontSize: 13, fontWeight: 500, border: "1px solid var(--line)", background: billing === "annual" ? "linear-gradient(135deg, var(--purple), var(--cyan))" : "transparent", color: billing === "annual" ? "#fff" : "var(--muted)", cursor: "pointer" }}>Annual <span style={{ opacity: .8, fontSize: 11 }}>(save ~17%)</span></button>
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
                    {billing === "annual" && <div style={{ color: "var(--cyan)", fontSize: 12, marginTop: 4 }}>Billed annually</div>}
                  </div>
                ) : (
                  <span className="plan-tag">Tailored Quote</span>
                )}
                <ul className="plan-features">
                  {p.features.map(f => <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--muted)" }}><span className="check">✓</span>{f}</li>)}
                </ul>
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="plan-cta">Get Started</a>
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
        <div><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a><a href={EMAIL} target="_blank" rel="noopener noreferrer">Email</a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="/blog">Blog</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
      </footer>
    </main>
  )
}
