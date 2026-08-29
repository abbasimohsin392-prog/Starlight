import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { niches } from "@/lib/niches"
import { NicheContent } from "./niche-content"

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
    alternates: { canonical: `/solutions/${niche.slug}` },
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
    provider: { "@type": "Organization", name: "Starlight AI", url: "https://www.starlightai.site" },
    audience: { "@type": "Audience", audienceType: niche.name },
    description: niche.metaDescription,
  }
  const otherNiches = niches.filter((n) => n.slug !== niche.slug).slice(0, 4)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <NicheContent niche={niche} otherNiches={otherNiches} />
    </>
  )
}
