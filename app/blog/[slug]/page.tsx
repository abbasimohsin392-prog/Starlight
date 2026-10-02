import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import { blogPosts } from '@/lib/data'

export function generateStaticParams() { return blogPosts.map((post) => ({ slug: post.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const post = blogPosts.find((item) => item.slug === slug); if (!post) return {}
  return { title: post.title, description: post.excerpt, alternates: { canonical: '/blog/' + post.slug }, openGraph: { title: post.title, description: post.excerpt, url: 'https://starlightai.site/blog/' + post.slug, type: 'article', siteName: 'Starlight AI' }, twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt } }
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = blogPosts.find((item) => item.slug === slug); if (!post) notFound()
  const articleJsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.excerpt, articleSection: post.category, mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://starlightai.site/blog/' + post.slug }, author: { '@type': 'Organization', name: 'Starlight AI', url: 'https://starlightai.site' }, publisher: { '@type': 'Organization', name: 'Starlight AI', url: 'https://starlightai.site' } }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} /><Nav/><main className="mx-auto max-w-4xl px-6 pt-40 pb-28"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{post.category} · {post.readTime}</p><h1 className="font-display mt-6 text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-none tracking-[-0.04em]">{post.title}</h1><p className="mt-8 text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p><div className="mt-16 space-y-12">{post.sections.map((section)=><section key={section.heading} className="border-t border-border pt-8"><h2 className="font-display text-3xl font-bold tracking-tight">{section.heading}</h2><p className="mt-4 text-lg leading-relaxed text-muted-foreground">{section.body}</p></section>)}</div><a href="/blog" className="mt-16 inline-block font-semibold text-primary">← Back to all guides</a></main><Footer/></>
}