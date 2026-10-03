import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Starlight AI',
  description: 'Talk with Starlight AI about AI receptionists, chatbots, lead automation, and custom workflow systems for your business.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact Starlight AI', description: 'Talk with Starlight AI about AI receptionists, chatbots, lead automation, and custom workflow systems for your business.', url: 'https://starlightai.site/contact', type: 'website' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) { return children }
