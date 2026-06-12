import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Services - Chatbots, Automation & Custom AI Solutions',
  description:
    'Explore Starlight AI services: AI chatbots, workflow automation, AI integration, custom AI models, and data analytics built to grow your business.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'AI Services - Starlight AI',
    description:
      'Explore Starlight AI services: AI chatbots, workflow automation, AI integration, custom AI models, and data analytics built to grow your business.',
    url: 'https://www.starlightai.site/services',
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
