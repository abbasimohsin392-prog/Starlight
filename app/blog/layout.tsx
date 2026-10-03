import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Automation Guides & Insights',
  description: 'Practical guides on AI receptionists, chatbots, lead handling, support automation, and workflow design for growing businesses.',
  alternates: { canonical: '/blog' },
  openGraph: { title: 'AI Automation Guides & Insights | Starlight AI', description: 'Practical guides on AI receptionists, chatbots, lead handling, support automation, and workflow design for growing businesses.', url: 'https://starlightai.site/blog', type: 'website' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) { return children }
