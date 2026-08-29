"use client"
import { motion, AnimatePresence } from "framer-motion"
import { niches } from "@/lib/niches"
import Link from "next/link"
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

export default function SolutionsPage() {
  const categories = Array.from(new Set(niches.map(n => n.category)))
  return (
    <main>
      <nav className="nav nav-scrolled">
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center", gap: 8 }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 60, width: "auto" }} /></a>
        <div className="nav-links">{navItems.map(item => <a key={item.href} href={item.href} className={item.label === "Solutions" ? "active" : ""}>{item.label}</a>)}</div>
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex primary" style={{ borderRadius: 999, padding: "12px 20px", fontSize: 14 }}>Let&apos;s talk ↗</a>
      </nav>

      <section className="section" style={{ paddingTop: 170 }}>
        <div className="section-head" style={{ justifyContent: "center", textAlign: "center" }}>
          <Reveal><span className="eyebrow">SOLUTIONS BY INDUSTRY</span><h1>Built for your business,<br /><em className="gradient-text">not generic software.</em></h1></Reveal>
          <Reveal delay={.1}><p className="section-intro" style={{ maxWidth: 500, margin: "16px auto 0" }}>Every industry loses customers differently. See how we tailor AI receptionists and chatbots to the way your business actually runs.</p></Reveal>
        </div>

        {categories.map((cat, ci) => (
          <Reveal key={cat} delay={ci * .06}>
            <div style={{ marginBottom: 50 }}>
              <span className="eyebrow" style={{ display: "block", marginBottom: 16 }}>{cat.toUpperCase()}</span>
              <div className="solutions-grid">
                {niches.filter(n => n.category === cat).map(n => (
                  <Link key={n.slug} href={`/solutions/${n.slug}`} className="solution-card">
                    <h4>{n.name}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <footer style={{ flexWrap: "wrap", gap: 16 }}>
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center" }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 20, width: "auto" }} /></a>
        <span>© 2026 Starlight AI</span>
        <div><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a><a href={EMAIL} target="_blank" rel="noopener noreferrer">Email</a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="/blog">Blog</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
      </footer>
    </main>
  )
}
