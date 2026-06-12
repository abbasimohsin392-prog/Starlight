import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - AI Automation Plans',
  description:
    'Simple, transparent pricing for AI automation, chatbots, and custom AI solutions. Find the perfect plan for your business and book a free strategy call.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Pricing - Starlight AI',
    description:
      'Simple, transparent pricing for AI automation, chatbots, and custom AI solutions. Find the perfect plan for your business and book a free strategy call.',
    url: 'https://www.starlightai.site/pricing',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
