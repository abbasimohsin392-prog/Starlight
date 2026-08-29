"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ChatbotDemoSection } from "@/components/chatbot-demo-section"
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

export default function ServicesPage() {
  return (
    <main>
      <nav className="nav nav-scrolled">
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center", gap: 8 }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 60, width: "auto" }} /></a>
        <div className="nav-links">{navItems.map(item => <a key={item.href} href={item.href} className={item.label === "Services" ? "active" : ""}>{item.label}</a>)}</div>
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex primary" style={{ borderRadius: 999, padding: "12px 20px", fontSize: 14 }}>Let&apos;s talk ↗</a>
      </nav>

      <section className="section" style={{ paddingTop: 170 }}>
        <div className="section-head" style={{ justifyContent: "center", textAlign: "center" }}>
          <Reveal><span className="eyebrow">OUR SERVICES</span><h1>AI solutions for<br /><em className="gradient-text">every business need.</em></h1></Reveal>
          <Reveal delay={.1}><p className="section-intro" style={{ maxWidth: 520, margin: "16px auto 0" }}>From chatbots to custom AI models, we deliver comprehensive AI solutions that drive real business results.</p></Reveal>
          <Reveal delay={.2}><div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
            <a href="/demo" className="inline-flex primary" style={{ borderRadius: 999, padding: "14px 28px", fontSize: 14 }}>Try the Live Demo ↗</a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex" style={{ borderRadius: 999, padding: "14px 28px", fontSize: 14, border: "1px solid var(--line)" }}>Chat on WhatsApp</a>
          </div></Reveal>
        </div>

        <div className="section-head" style={{ justifyContent: "center", textAlign: "center", marginBottom: 34 }}>
          <Reveal><span className="eyebrow">MOST REQUESTED</span><h2>What we build most often.</h2></Reveal>
        </div>
        <div className="feature-grid" style={{ marginBottom: 90 }}>
          {[
            { name: "AI Chatbots & Assistants", desc: "Custom AI-powered chatbots that handle customer support, lead generation, and internal operations 24/7.", features: ["Natural language understanding", "Multi-language support", "Seamless CRM integration", "Analytics dashboard"] },
            { name: "AI Receptionist", desc: "A 24/7 AI phone agent that answers every call, books appointments, and qualifies leads so you never miss a customer.", features: ["Answers calls day and night", "Automatic appointment booking", "Lead qualification & CRM logging", "Call transcripts & analytics"] },
          ].map((s, i) => (
            <Reveal key={s.name} delay={i * .1}><div className="glass-card feature-card">
              <span className="plan-badge" style={{ position: "static", display: "inline-block", marginBottom: 12 }}>Most Popular</span>
              <h3>{s.name}</h3>
              <p style={{ color: "var(--muted)", fontSize: 13, margin: "8px 0 16px" }}>{s.desc}</p>
              <ul className="plan-features">{s.features.map(f => <li key={f} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--muted)" }}><span className="check">✓</span>{f}</li>)}</ul>
            </div></Reveal>
          ))}
        </div>
      </section>

      <ChatbotDemoSection />

      <section className="section">
        <div className="section-head" style={{ justifyContent: "center", textAlign: "center", marginBottom: 34 }}>
          <Reveal><span className="eyebrow">RESULTS</span><h2>Built for real business problems.</h2></Reveal>
          <Reveal delay={.1}><p className="section-intro" style={{ maxWidth: 480, margin: "16px auto 0" }}>We build AI systems tailored to your industry, not generic tools, but solutions designed around how your business actually works.</p></Reveal>
        </div>
        <div className="feature-grid" style={{ marginBottom: 90 }}>
          {[
            { icon: "🦷", name: "Dental Clinics", desc: "Automated patient enquiries, appointment reminders, and missed call follow-ups, freeing up front desk staff to focus on in-clinic care.", stat: "80% faster response time" },
            { icon: "🏢", name: "Service Businesses", desc: "End-to-end lead handling from first contact to booked appointment, running 24/7 without any manual input from the team.", stat: "3x more leads captured" },
            { icon: "🛒", name: "E-commerce & Retail", desc: "AI-powered customer support and order tracking automation that handles hundreds of enquiries simultaneously, around the clock.", stat: "Zero missed enquiries" },
          ].map((r, i) => (
            <Reveal key={r.name} delay={i * .1}><div className="glass-card feature-card">
              <span style={{ fontSize: 28 }}>{r.icon}</span>
              <h3 style={{ marginTop: 10 }}>{r.name}</h3>
              <p style={{ color: "var(--muted)", fontSize: 13, margin: "8px 0 14px" }}>{r.desc}</p>
              <span style={{ color: "var(--cyan)", fontSize: 12, fontWeight: 600 }}>{r.stat}</span>
            </div></Reveal>
          ))}
        </div>

        <div className="section-head" style={{ justifyContent: "center", textAlign: "center", marginBottom: 34 }}>
          <Reveal><span className="eyebrow">ALSO AVAILABLE</span><h2>Full-stack AI, when you need it.</h2></Reveal>
        </div>
        <div className="feature-grid" style={{ marginBottom: 90 }}>
          {[
            { name: "Workflow Automation", desc: "End-to-end automation solutions that eliminate manual tasks and streamline your business processes.", features: ["Process mapping & optimization", "Custom automation scripts", "API integrations", "Real-time monitoring"] },
            { name: "AI Integration", desc: "Seamlessly integrate AI capabilities into your existing systems and tech stack.", features: ["Legacy system compatibility", "Cloud & on-premise options", "Custom API development", "Scalable architecture"] },
            { name: "Custom AI Models", desc: "Tailored machine learning models trained on your data for specific business use cases.", features: ["Data analysis & preparation", "Model training & tuning", "Performance optimization", "Continuous learning"] },
            { name: "Data Analytics & BI", desc: "Transform raw data into actionable insights with AI-powered analytics dashboards.", features: ["Real-time data processing", "Custom visualizations", "Predictive analytics", "Automated reporting"] },
          ].map((s, i) => (
            <Reveal key={s.name} delay={i * .08}><div className="glass-card feature-card">
              <h3>{s.name}</h3>
              <p style={{ color: "var(--muted)", fontSize: 13, margin: "8px 0 16px" }}>{s.desc}</p>
              <ul className="plan-features">{s.features.map(f => <li key={f} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--muted)" }}><span className="check">✓</span>{f}</li>)}</ul>
            </div></Reveal>
          ))}
        </div>

        <Reveal><div className="glass-card" style={{ textAlign: "center", padding: "50px 32px", marginBottom: 20 }}>
          <h2 style={{ marginBottom: 8 }}>Simple, transparent pricing.</h2>
          <p style={{ color: "var(--muted)", marginBottom: 22 }}>Every business is different — pricing depends on scope.</p>
          <a href="/pricing" className="inline-flex primary" style={{ borderRadius: 999, padding: "14px 28px", fontSize: 14 }}>See full pricing →</a>
        </div></Reveal>

        <Reveal delay={.1}><div className="glass-card" style={{ textAlign: "center", padding: "50px 32px" }}>
          <h2 style={{ marginBottom: 8 }}>Ready to transform your business?</h2>
          <p style={{ color: "var(--muted)", marginBottom: 22 }}>Book a free strategy call, or message us on WhatsApp if that&apos;s faster for you.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex primary" style={{ borderRadius: 999, padding: "14px 28px", fontSize: 14 }}>Get Your Proposal ↗</a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex" style={{ borderRadius: 999, padding: "14px 28px", fontSize: 14, border: "1px solid var(--line)" }}>Chat on WhatsApp</a>
          </div>
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
