import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Solutions by Industry | Starlight AI',
  description: 'Explore practical AI receptionists, chatbots, and workflow automation solutions tailored to dental clinics, real estate, law firms, and other service businesses.',
  alternates: { canonical: '/solutions' },
  openGraph: {
    title: 'AI Solutions by Industry | Starlight AI',
    description: 'Explore practical AI receptionists, chatbots, and workflow automation solutions tailored to dental clinics, real estate, law firms, and other service businesses.',
    url: 'https://starlightai.site/solutions',
    type: 'website',
  },
}

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return children
}
