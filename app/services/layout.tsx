import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Starlight AI - an AI automation agency helping businesses scale with custom chatbots, workflow automation, and AI integrations.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Starlight AI',
    description:
      'Learn about Starlight AI - an AI automation agency helping businesses scale with custom chatbots, workflow automation, and AI integrations.',
    url: 'https://www.starlightai.site/about',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
