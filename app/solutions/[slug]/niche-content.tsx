"use client"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import type { Niche } from "@/lib/niches"
const CALENDLY = "https://calendly.com/starlightai306/30min"
const WHATSAPP = "https://wa.me/923007657038"
const EMAIL = "https://mail.google.com/mail/?view=cm&fs=1&to=hello@starlightai.site&su=Business%20Enquiry"
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

export function NicheContent({ niche, otherNiches }: { niche: Niche; otherNiches: Niche[] }) {
  return (
    <main>
      <nav className="nav nav-scrolled">
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center", gap: 8 }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 60, width: "auto" }} /></a>
        <div className="nav-links">{navItems.map(item => <a key={item.href} href={item.href} className={item.label === "Solutions" ? "active" : ""}>{item.label}</a>)}</div>
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex primary" style={{ borderRadius: 999, padding: "12px 20px", fontSize: 14 }}>Let&apos;s talk ↗</a>
      </nav>

      <section className="section" style={{ paddingTop: 170 }}>
        <div className="section-head" style={{ justifyContent: "center", textAlign: "center" }}>
          <Reveal><span className="eyebrow">{niche.category.toUpperCase()}</span><h1>{niche.heroLine}</h1></Reveal>
          <Reveal delay={.1}><p className="section-intro" style={{ maxWidth: 560, margin: "16px auto 0" }}>{niche.painPoint}</p></Reveal>
          <Reveal delay={.2}><div style={{ marginTop: 26 }}><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex primary" style={{ borderRadius: 999, padding: "14px 28px", fontSize: 14 }}>Book a Free Strategy Call ↗</a></div></Reveal>
        </div>

        <Reveal><div className="glass-card" style={{ padding: "32px", marginBottom: 50 }}>
          <span className="eyebrow" style={{ color: "var(--cyan)" }}>THE PROBLEM</span>
          <p style={{ marginTop: 14, color: "var(--muted)", lineHeight: 1.7 }}>{niche.scenario}</p>
        </div></Reveal>

        <div className="section-head" style={{ justifyContent: "center", textAlign: "center", marginBottom: 30 }}>
          <Reveal><h2>What we build for {niche.name.toLowerCase()}</h2></Reveal>
        </div>
        <div className="feature-grid" style={{ marginBottom: 60 }}>
          {niche.useCases.map((uc, i) => (
            <Reveal key={uc} delay={i * .06}><div className="glass-card feature-card" style={{ display: "flex", alignItems: "flex-start", gap: 12 }}><span className="check">✓</span><p style={{ margin: 0 }}>{uc}</p></div></Reveal>
          ))}
        </div>

        <section aria-labelledby="workflow-heading" style={{ marginBottom: 60 }}>
          <div className="section-head" style={{ justifyContent: "center", textAlign: "center", marginBottom: 28 }}>
            <Reveal><span className="eyebrow">A PRACTICAL WORKFLOW</span><h2 id="workflow-heading">How it fits into your {niche.name.toLowerCase()}</h2></Reveal>
          </div>
          <div className="feature-grid">
            {[
              ["Capture every inquiry", "Answer calls and messages when your team is busy or offline."],
              ["Qualify and route", "Collect the right details, answer common questions, and route urgent or complex requests to your team."],
              ["Book the next step", "Turn a qualified inquiry into an appointment, showing, consultation, or estimate request."],
            ].map(([title, description], i) => (
              <Reveal key={title} delay={i * .06}><div className="glass-card feature-card"><h3>{title}</h3><p>{description}</p></div></Reveal>
            ))}
          </div>
        </section>

        <Reveal><div className="glass-card" style={{ textAlign: "center", padding: "44px 32px", marginBottom: 60 }}>
          <h2 style={{ marginBottom: 10 }}>See how it would work for your {niche.name.toLowerCase().replace(/s$/, "")}</h2>
          <p style={{ color: "var(--muted)", marginBottom: 22, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>No pressure, no generic pitch. We&apos;ll look at how you currently handle calls and inquiries and tell you honestly whether this would help.</p>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex primary" style={{ borderRadius: 999, padding: "14px 28px", fontSize: 14 }}>Book a Free Strategy Call ↗</a>
        </div></Reveal>

        <Reveal delay={.1}>
          <p className="eyebrow" style={{ textAlign: "center", marginBottom: 16 }}>WE ALSO BUILD FOR</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            {otherNiches.map(n => (
              <Link key={n.slug} href={`/solutions/${n.slug}`} className="inline-flex" style={{ borderRadius: 999, padding: "10px 18px", fontSize: 13, border: "1px solid var(--line)", color: "var(--muted)" }}>{n.name}</Link>
            ))}
          </div>
        </Reveal>
      </section>

      <footer style={{ flexWrap: "wrap", gap: 16 }}>
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center" }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 20, width: "auto" }} /></a>
        <span>© 2026 Starlight AI</span>
        <div><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a><a href={EMAIL} target="_blank" rel="noopener noreferrer">Email</a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="/blog">Blog</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
      </footer>
    </main>
  )
}
