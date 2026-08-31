"use client"
import { motion, AnimatePresence } from "framer-motion"

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

export default function AboutPage() {
  return (
    <main>
      <nav className="nav nav-scrolled">
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center", gap: 8 }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 60, width: "auto" }} /></a>
        <div className="nav-links">{navItems.map(item => <a key={item.href} href={item.href} className={item.label === "About" ? "active" : ""}>{item.label}</a>)}</div>
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex primary" style={{ borderRadius: 999, padding: "12px 20px", fontSize: 14 }}>Let&apos;s talk ↗</a>
      </nav>

      <section className="section" style={{ paddingTop: 170 }}>
        <div className="section-head" style={{ justifyContent: "center", textAlign: "center" }}>
          <Reveal><span className="eyebrow">ABOUT US</span><h1>Building the future<br />with <em className="gradient-text">AI innovation.</em></h1></Reveal>
          <Reveal delay={.1}><p className="section-intro" style={{ maxWidth: 480, margin: "16px auto 0" }}>We help businesses harness the power of artificial intelligence to achieve real, measurable results.</p></Reveal>
        </div>

        <Reveal><div className="glass-card" style={{ padding: "36px 32px", marginBottom: 40 }}>
          <span className="eyebrow">OUR MISSION</span>
          <p style={{ marginTop: 14, color: "var(--muted)", lineHeight: 1.7 }}>At Starlight AI, we believe every business deserves access to powerful AI technology. Our mission is to make AI accessible, affordable, and impactful for businesses of all sizes.</p>
          <p style={{ marginTop: 14, color: "var(--muted)", lineHeight: 1.7 }}>We combine cutting-edge technology with deep industry expertise to create AI solutions that solve real problems and deliver measurable results. Our approach is collaborative, transparent, and always focused on your success.</p>
        </div></Reveal>

        <Reveal delay={.1}><div className="glass-card" style={{ padding: "36px 32px", marginBottom: 80 }}>
          <span className="eyebrow">FROM THE FOUNDER</span>
          <p style={{ marginTop: 14, color: "var(--muted)", lineHeight: 1.7 }}>Starlight AI started with a simple observation: small businesses lose revenue every day to something completely preventable: a missed call, a slow reply, a lead that goes cold. I founded Starlight AI to close that gap.</p>
          <p style={{ marginTop: 14, color: "var(--muted)", lineHeight: 1.7 }}>What began as one idea, that every business deserves the responsiveness of a company ten times its size, has grown into an automation practice trusted by businesses worldwide. Every system we build is designed around how your business actually runs, so nothing falls through the cracks.</p>
          <p style={{ marginTop: 18, color: "var(--cyan)", fontSize: 13 }}>Aoun, Founder, Starlight AI</p>
        </div></Reveal>

        <div className="section-head" style={{ justifyContent: "center", textAlign: "center", marginBottom: 40 }}>
          <Reveal><span className="eyebrow">OUR VALUES</span><h2>These core values guide<br />everything we do.</h2></Reveal>
        </div>
        <div className="feature-grid">
          {[
            ["Results-Driven", "We focus on delivering measurable outcomes that directly impact your bottom line."],
            ["Innovation First", "We stay at the cutting edge of AI technology to bring you the most advanced solutions."],
            ["Client Partnership", "We work as an extension of your team, understanding your unique challenges and goals."],
            ["Excellence", "We are committed to delivering exceptional quality in everything we do."],
          ].map(([title, desc], i) => (
            <Reveal key={title} delay={i * .08}><div className="glass-card feature-card"><h3>{title}</h3><p>{desc}</p></div></Reveal>
          ))}
        </div>

        <Reveal delay={.2}><div className="glass-card" style={{ textAlign: "center", padding: "50px 32px", marginTop: 80 }}>
          <h2 style={{ marginBottom: 10 }}>Ready to work with us?</h2>
          <p style={{ color: "var(--muted)", marginBottom: 24 }}>Let us discuss how we can help transform your business with AI.</p>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex primary" style={{ borderRadius: 999, padding: "14px 28px", fontSize: 14 }}>Book a Strategy Call ↗</a>
        </div></Reveal>
      </section>

      <footer style={{ flexWrap: "wrap", gap: 16 }}>
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center" }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 20, width: "auto" }} /></a>
        <span>© 2026 Starlight AI</span>
        <div><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a><a href={EMAIL} target="_blank" rel="noopener noreferrer">Email</a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="/blog">Blog</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
      </footer>
    </main>
  )
}
