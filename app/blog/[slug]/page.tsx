import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { blogPosts, type BlogContentBlock } from '@/lib/blog-posts'
import { niches } from '@/lib/niches'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
  }
}

function Block({ block }: { block: BlogContentBlock }) {
  if (block.type === 'h2') return <h2 style={{ fontSize: 24, fontWeight: 500, margin: '34px 0 14px', letterSpacing: '-.02em' }}>{block.text}</h2>
  if (block.type === 'ul') return <ul className="benefit-list">{block.items.map((i) => <li key={i}><span className="dot">✓</span>{i}</li>)}</ul>
  return <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.75, margin: '0 0 18px' }}>{block.text}</p>
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) notFound()
  const relatedNiche = niches.find((n) => n.slug === post.relatedNicheSlug)

  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />
      <article className="section" style={{ paddingTop: 180, maxWidth: 760 }}>
        <span className="eyebrow">{post.category.toUpperCase()} · {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        <h1 style={{ margin: '18px 0 32px', fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontWeight: 450, letterSpacing: '-.05em', lineHeight: 1.05 }}>{post.title}</h1>
        {post.content.map((block, i) => <Block key={i} block={block} />)}

        {relatedNiche && (
          <div className="glass-card" style={{ padding: 28, margin: '40px 0' }}>
            <span className="eyebrow">SEE THE FULL SOLUTION</span>
            <h3 style={{ margin: '10px 0' }}>{relatedNiche.heroLine}</h3>
            <Link href={`/solutions/${relatedNiche.slug}`} style={{ color: 'var(--cyan)', fontSize: 13 }}>Read more →</Link>
          </div>
        )}

        <Link href="/blog" style={{ color: 'var(--cyan)', fontSize: 13 }}>← All posts</Link>
      </article>
      <Footer />
    </main>
  )
}
