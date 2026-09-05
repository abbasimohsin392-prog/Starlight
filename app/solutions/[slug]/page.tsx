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
      url: `https://starlightai.site/solutions/${niche.slug}`,
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
    provider: { "@type": "Organization", name: "Starlight AI", url: "https://starlightai.site" },
    url: `https://starlightai.site/solutions/${niche.slug}`,
    areaServed: niche.name,
    audience: { "@type": "Audience", audienceType: niche.name },
    description: niche.metaDescription,
  }
  const otherNiches = niches.filter((n) => n.slug !== niche.slug).slice(0, 4)

  const pageUrl = `https://starlightai.site/solutions/${niche.slug}`
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://starlightai.site/" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://starlightai.site/solutions" },
      { "@type": "ListItem", position: 3, name: niche.name, item: pageUrl },
    ],
  }

  const faqItems = [
    { question: "What can Starlight AI handle for " + niche.name.toLowerCase() + "?", answer: "It can capture enquiries, answer approved routine questions, collect the right details, and route or book the next step when your team is busy or offline." },
    { question: "Will it replace our team?", answer: "No. It provides non-clinical administrative support and follows your approved information while routing complex or urgent matters to your team." },
    { question: "How quickly can we see whether it helps?", answer: "We start with a focused workflow review, identify one high-value enquiry path, and recommend a practical implementation plan before any build begins." },
  ]
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd, breadcrumbJsonLd, faqJsonLd]) }} />
      <NicheContent niche={niche} otherNiches={otherNiches} />
    </>
  )
}
