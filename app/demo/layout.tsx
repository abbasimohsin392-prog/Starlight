import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Receptionist Demo | Starlight AI',
  description: "Try Starlight AI's interactive missed-call report and see how an AI receptionist can capture inquiries, qualify callers, and book jobs.",
  alternates: { canonical: '/demo' },
  openGraph: {
    title: 'AI Receptionist Demo | Starlight AI',
    description: "Try Starlight AI's interactive missed-call report and see how an AI receptionist can capture inquiries, qualify callers, and book jobs.",
    url: 'https://starlightai.site/demo',
    type: 'website',
    images: [{ url: 'https://starlightai.site/images/og-banner.jpg', width: 1200, height: 630, alt: 'Starlight AI AI receptionist demo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Receptionist Demo | Starlight AI',
    description: "Try Starlight AI's interactive AI receptionist demo.",
    images: ['https://starlightai.site/images/og-banner.jpg'],
  },
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
