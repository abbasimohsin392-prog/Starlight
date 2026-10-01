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

  const faqItems = slug === "property-management"
    ? [
        { question: "Is this a live property-management integration?", answer: "No. This page describes a proposed workflow and the interactive journey is a labelled simulation. It does not claim a live property feed, inbox, CRM, calendar, or maintenance system connection." },
        { question: "What does the free 3-point enquiry audit include?", answer: "We review three moments where property enquiries can lose momentum: first response, qualification, and handoff. You receive practical observations and a suggested pilot scope without a commitment to build." },
        { question: "Can the workflow use our approved property information?", answer: "Yes, in a scoped implementation. We would first agree the source of truth, escalation rules, tone, and information that must never be guessed." },
        { question: "Will it replace property managers or letting teams?", answer: "No. The aim is to reduce repetitive admin and make handoffs clearer. Your team keeps control of exceptions, sensitive issues, decisions, and relationship-led conversations." },
        { question: "How does pricing work?", answer: "Pricing depends on the enquiry paths, channels, knowledge sources, and handoff requirements. The audit is the right starting point; the pricing page explains the broader engagement model." },
      ]
    : [
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
