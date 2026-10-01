import Link from 'next/link'

const CALENDLY = 'https://calendly.com/starlightai306/30min?utm_source=contact&utm_medium=property_management&utm_campaign=enquiry_audit'
const EMAIL = 'mailto:hello@starlightai.site?subject=Free%203-point%20property%20enquiry%20audit'

export const metadata = { title: 'Contact Starlight AI | Property Management Enquiry Audit', description: 'Request a free 3-point property-enquiry audit from Starlight AI.' }

export default function ContactPage() {
  return <main className="section" style={{ maxWidth: 900, margin: '0 auto', paddingTop: 160 }}>
    <Link href="/" style={{ color: 'var(--cyan)' }}>← Starlight AI</Link>
    <span className="eyebrow" style={{ display: 'block', marginTop: 70 }}>PROPERTY MANAGEMENT / NEXT STEP</span>
    <h1>Find where property enquiries<br /><em>lose momentum.</em></h1>
    <p className="section-intro" style={{ maxWidth: 620 }}>Request a free 3-point audit of first response, qualification, and handoff. We will return practical observations and a suggested pilot scope—without pretending to know what has not been connected.</p>
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 30 }}>
      <a href={EMAIL} className="inline-flex primary" style={{ borderRadius: 999, padding: '14px 22px' }}>Request the free audit ↗</a>
      <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex" style={{ borderRadius: 999, padding: '14px 22px', border: '1px solid var(--line)' }}>Book a 15-minute review ↗</a>
    </div>
    <div className="glass-card" style={{ marginTop: 70, padding: 28 }}>
      <h2 style={{ marginTop: 0 }}>What to include</h2>
      <ul className="benefit-list"><li><span className="dot">1</span>Company and website</li><li><span className="dot">2</span>Approximate monthly enquiry volume</li><li><span className="dot">3</span>Where enquiries currently arrive</li><li><span className="dot">4</span>The handoff your team most wants to improve</li></ul>
    </div>
  </main>
}
