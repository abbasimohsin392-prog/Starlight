import Link from 'next/link'
import type { Metadata } from 'next'
import { blogPosts } from '@/lib/blog-posts'
export const metadata: Metadata = {
  title: 'Blog | Starlight AI',
  description: 'Practical guides on AI receptionists, chatbots, and automation for small businesses.',
  alternates: { canonical: '/blog' },
}

export default function BlogIndexPage() {
  return (
    <main style={{ minHeight: '100vh' }}>
      <nav className="nav nav-scrolled">
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center", gap: 8 }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 60, width: "auto" }} /></a>
        <div className="nav-links"><a href="/">Home</a><a href="/services">Services</a><a href="/solutions">Solutions</a><a href="/pricing">Pricing</a><a href="/about">About</a></div>
        <a href="https://calendly.com/starlightai306/30min" target="_blank" rel="noopener noreferrer" className="inline-flex primary" style={{ borderRadius: 999, padding: "12px 20px", fontSize: 14 }}>Let&apos;s talk ↗</a>
      </nav>
      <section className="section" style={{ paddingTop: 180 }}>
        <div className="section-head">
          <div><span className="eyebrow">BLOG</span><h1>Ideas worth<br /><em>automating around.</em></h1></div>
          <p className="section-intro">Practical, no-fluff guides on where AI actually saves businesses time and money.</p>
        </div>
        <div style={{ display: 'grid', gap: 18 }}>
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="glass-card" style={{ display: 'block', padding: '26px 30px' }}>
              <span className="eyebrow">{post.category.toUpperCase()} · {new Date(post.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              <h3 style={{ margin: '10px 0 8px', fontSize: 22, fontWeight: 500, letterSpacing: '-.02em' }}>{post.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
      <footer style={{ flexWrap: "wrap", gap: 16 }}>
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center" }}><img src="/starlight-logo.png" alt="Starlight AI" style={{ height: 20, width: "auto" }} /></a>
        <span>© 2026 Starlight AI</span>
        <div><a href="https://www.instagram.com/starlight_.ai/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://mail.google.com/mail/?view=cm&fs=1&to=hello@starlightai.site&su=Business%20Enquiry" target="_blank" rel="noopener noreferrer">Email</a><a href="https://wa.me/923007657038" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="/blog">Blog</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
      </footer>
    </main>
  )
}
