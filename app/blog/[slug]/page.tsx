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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://starlightai.site/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: 'https://starlightai.site/images/og-banner.jpg', alt: post.title }],
    },
  }
}

function Block({ block }: { block: BlogContentBlock }) {
  if (block.type === 'h2') return <h2 style={{ fontSize: 24, fontWeight: 500, margin: '34px 0 14px', letterSpacing: '-.02em' }}>{block.text}</h2>
  if (block.type === 'ul') return <ul className="benefit-list">{block.items.map((i) => <li key={i}><span className="dot">✓</span>{i}</li>)}</ul>
  return <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.75, margin: '0 0 18px' }}>{block.text}</p>
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()
  const relatedNiche = niches.find((n) => n.slug === post.relatedNicheSlug)

  const pageUrl = `https://starlightai.site/blog/${post.slug}`
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.date,
      dateModified: post.date,
      author: { '@type': 'Organization', name: 'Starlight AI', url: 'https://starlightai.site' },
      publisher: { '@type': 'Organization', name: 'Starlight AI', url: 'https://starlightai.site' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
      image: 'https://starlightai.site/images/og-banner.jpg',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://starlightai.site/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://starlightai.site/blog' },
        { '@type': 'ListItem', position: 3, name: post.title, item: pageUrl },
      ],
    },
  ]

  return (
    <main style={{ minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
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
