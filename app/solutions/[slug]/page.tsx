import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"
import { niches } from "@/lib/niches"

const CALENDLY_LINK = "https://calendly.com/starlightai306/30min"

export function generateStaticParams() {
  return niches.map((niche) => ({ slug: niche.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const niche = niches.find((n) => n.slug === slug)
  if (!niche) return {}

  return {
    title: niche.metaTitle,
    description: niche.metaDescription,
    alternates: {
      canonical: `/solutions/${niche.slug}`,
    },
    openGraph: {
      title: `${niche.metaTitle} | Starlight AI`,
      description: niche.metaDescription,
      url: `https://www.starlightai.site/solutions/${niche.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${niche.metaTitle} | Starlight AI`,
      description: niche.metaDescription,
    },
  }
}

export default async function NichePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const niche = niches.find((n) => n.slug === slug)
  if (!niche) return notFound()

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: niche.metaTitle,
    provider: {
      "@type": "Organization",
      name: "Starlight AI",
      url: "https://www.starlightai.site",
    },
    audience: {
      "@type": "Audience",
      audienceType: niche.name,
    },
    description: niche.metaDescription,
  }

  const otherNiches = niches.filter((n) => n.slug !== niche.slug).slice(0, 4)

  return (
    <main className="min-h-screen bg-background relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <CinematicBackground />
      <div className="relative z-10">
        <Navbar />

        <section className="pt-40 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">
              {niche.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-balance">
              {niche.heroLine}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              {niche.painPoint}
            </p>
            <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="btn-glow bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-foreground font-semibold px-8 py-6 text-lg shadow-lg shadow-purple-500/25"
              >
                Book a Free Strategy Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-2xl p-8 sm:p-10 mb-12 border border-white/10">
              <h2 className="text-xl font-semibold mb-3 text-cyan-400">The problem</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{niche.scenario}</p>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
              What we build for {niche.name.toLowerCase()}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-16">
              {niche.useCases.map((useCase) => (
                <div
                  key={useCase}
                  className="glass-card rounded-xl p-5 flex items-start gap-3 border border-white/10"
                >
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{useCase}</span>
                </div>
              ))}
            </div>

            <div className="text-center glass-card rounded-2xl p-10 border border-white/10">
              <h2 className="text-2xl font-bold mb-4">
                See how it would work for your {niche.name.toLowerCase().replace(/s$/, "")}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                No pressure, no generic pitch. We'll look at how you currently handle calls and
                inquiries and tell you honestly whether this would help.
              </p>
              <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="btn-glow bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-foreground font-semibold px-8 py-6 text-lg"
                >
                  Book a Free Strategy Call
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>

            <div className="mt-20">
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground text-center mb-6">
                We also build for
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {otherNiches.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/solutions/${n.slug}`}
                    className="glass-card px-4 py-2 rounded-full text-sm text-muted-foreground border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/10 transition-colors duration-200"
                  >
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
