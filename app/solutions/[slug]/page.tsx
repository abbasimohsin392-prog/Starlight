import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { blogPosts } from '@/lib/data'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import { niches } from '@/lib/niches'

export function generateStaticParams() { return niches.map((niche) => ({ slug: niche.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const niche = niches.find((item) => item.slug === slug)
  if (!niche) return {}
  return pageMetadata(niche.metaTitle, niche.metaDescription, `/solutions/${niche.slug}`)
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const niche = niches.find((item) => item.slug === slug)
  if (!niche) notFound()
  const guides = blogPosts.filter(post => post.solutionSlug === niche.slug)
  const related = niches.filter((item) => item.slug !== niche.slug).slice(0, 6)
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Service', name: niche.metaTitle, description: niche.metaDescription, provider: { '@type': 'Organization', name: 'Starlight AI', url: 'https://starlightai.site' }, url: `https://starlightai.site/solutions/${niche.slug}` }
  return <><Nav/><main className="mx-auto max-w-7xl px-6 pt-40 pb-28"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{niche.category}</p><h1 className="font-display mt-6 max-w-5xl text-[clamp(2.75rem,7vw,6rem)] font-bold leading-none tracking-[-0.04em]">{niche.heroLine}</h1><p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">{niche.painPoint}</p><a href="https://calendly.com/starlightai306/30min" target="_blank" rel="noreferrer" className="mt-10 inline-flex h-14 items-center rounded-full bg-primary px-7 font-semibold text-primary-foreground">Book a strategy call</a><section className="mt-24 grid gap-5 md:grid-cols-2"><div className="rounded-3xl border border-border bg-surface/60 p-8"><p className="font-mono text-xs uppercase tracking-widest text-primary">The scenario</p><p className="mt-5 text-lg leading-relaxed text-muted-foreground">{niche.scenario}</p></div><div className="rounded-3xl border border-border bg-surface/60 p-8"><p className="font-mono text-xs uppercase tracking-widest text-primary">What the system can handle</p><ul className="mt-5 space-y-3 text-muted-foreground">{niche.useCases.map((item)=><li key={item} className="flex gap-3"><span className="text-primary">＋</span>{item}</li>)}</ul></div></section><section className="mt-24"><p className="font-mono text-xs uppercase tracking-widest text-primary">A practical workflow</p><h2 className="font-display mt-5 text-4xl font-bold tracking-tight">Capture. Qualify. Book.</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{[['Capture every enquiry','Answer approved questions when your team is busy or offline.'],['Qualify and route','Collect the right details and escalate urgent or complex requests.'],['Book the next step','Turn a qualified enquiry into an appointment, consultation, showing, or estimate.']].map(([title,body])=><article key={title} className="rounded-3xl border border-border p-7"><h3 className="font-display text-2xl font-bold">{title}</h3><p className="mt-4 leading-relaxed text-muted-foreground">{body}</p></article>)}</div></section><section className="mt-24"><p className="font-mono text-xs uppercase tracking-widest text-primary">More solutions</p><div className="mt-6 flex flex-wrap gap-3">{related.map((item)=><a key={item.slug} href={`/solutions/${item.slug}`} className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary">{item.name}</a>)}</div></section><section className="mt-24"><h2 className="font-display text-3xl font-bold">Practical guides</h2><div className="mt-6 flex flex-col gap-4 text-primary">{guides.map(post=><a key={post.slug} href={`/blog/${post.slug}`}>{post.title} →</a>)}<a href="/blog">Browse all AI workflow guides →</a><a href="/solutions">Explore all industry solutions →</a></div></section></main><Footer/></>
}
