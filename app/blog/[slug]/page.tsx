import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"
import { blogPosts } from "@/lib/blog-posts"
import { niches } from "@/lib/niches"

const CALENDLY_LINK = "https://calendly.com/starlightai306/30min"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return {}

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.metaTitle} | Starlight AI`,
      description: post.metaDescription,
      url: `https://www.starlightai.site/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.metaTitle} | Starlight AI`,
      description: post.metaDescription,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return notFound()

  const relatedNiche = niches.find((n) => n.slug === post.relatedNicheSlug)

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Starlight AI" },
    publisher: { "@type": "Organization", name: "Starlight AI", url: "https://www.starlightai.site" },
    mainEntityOfPage: `https://www.starlightai.site/blog/${post.slug}`,
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.starlightai.site/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.starlightai.site/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://www.starlightai.site/blog/${post.slug}` },
    ],
  }

  return (
    <main className="min-h-screen bg-background relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CinematicBackground />
      <div className="relative z-10">
        <Navbar />

        <article className="pt-40 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">{post.category}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-8 text-balance">{post.title}</h1>

            <div className="space-y-6">
              {post.content.map((block, i) => {
                if (block.type === "h2") {
                  return (
                    <h2 key={i} className="text-2xl font-semibold mt-10 mb-2">
                      {block.text}
                    </h2>
                  )
                }
                if (block.type === "ul") {
                  return (
                    <ul key={i} className="space-y-2 list-none">
                      {block.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )
                }
                return (
                  <p key={i} className="text-muted-foreground leading-relaxed text-lg">
                    {block.text}
                  </p>
                )
              })}
            </div>

            {relatedNiche && (
              <div className="glass-card rounded-2xl p-8 mt-12 border border-white/10 text-center">
                <p className="text-muted-foreground mb-4">
                  See exactly what we build for {relatedNiche.name.toLowerCase()}.
                </p>
                <Link href={`/solutions/${relatedNiche.slug}`}>
                  <Button variant="outline" className="border-white/20 hover:bg-white/5">
                    View {relatedNiche.name} Solutions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            <div className="glass-card rounded-2xl p-8 mt-6 border border-white/10 text-center">
              <h2 className="text-xl font-semibold mb-3">Ready to see it in action?</h2>
              <p className="text-muted-foreground mb-6">Book a free strategy call and we'll show you exactly how this would work for your business.</p>
              <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="btn-glow bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-foreground font-semibold px-8 py-6 text-lg">
                  Book a Free Strategy Call
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </main>
  )
}
