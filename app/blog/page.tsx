import Link from 'next/link'
import type { Metadata } from 'next'
import { blogPosts } from '@/lib/blog-posts'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Blog — Starlight AI',
  description: 'Practical guides on AI receptionists, chatbots, and automation for small businesses.',
  alternates: { canonical: '/blog' },
}

export default function BlogIndexPage() {
  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />
      <section className="section" style={{ paddingTop: 180 }}>
        <div className="section-head">
          <div><span className="eyebrow">BLOG</span><h2>Ideas worth<br /><em>automating around.</em></h2></div>
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
      <Footer />
    </main>
  )
}
