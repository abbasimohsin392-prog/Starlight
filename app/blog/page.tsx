import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"
import { blogPosts } from "@/lib/blog-posts"

export const metadata: Metadata = {
  title: "Blog - AI Automation Insights",
  description:
    "Guides on AI chatbots, AI receptionists, and workflow automation for businesses across every industry.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog - Starlight AI",
    description:
      "Guides on AI chatbots, AI receptionists, and workflow automation for businesses across every industry.",
    url: "https://www.starlightai.site/blog",
  },
}

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-background relative">
      <CinematicBackground />
      <div className="relative z-10">
        <Navbar />

        <section className="pt-40 pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Blog</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-balance">
              AI Automation Insights
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Practical guides on AI chatbots, AI receptionists, and workflow automation for businesses across every industry.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 transition-colors duration-200 group flex flex-col"
              >
                <span className="text-cyan-400 text-xs font-medium uppercase tracking-wider mb-3">
                  {post.category}
                </span>
                <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                <p className="text-muted-foreground text-sm mb-4 flex-1">{post.excerpt}</p>
                <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                  Read more
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
