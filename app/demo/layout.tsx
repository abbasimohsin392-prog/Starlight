import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Receptionist Demo | Starlight AI',
  description: 'Try Starlight AI's interactive missed-call report and see how an AI receptionist can capture inquiries, qualify callers, and book jobs.',
  alternates: { canonical: '/demo' },
  openGraph: {
    title: 'AI Receptionist Demo | Starlight AI',
    description: 'Try Starlight AI's interactive missed-call report and see how an AI receptionist can capture inquiries, qualify callers, and book jobs.',
    url: 'https://starlightai.site/demo',
    type: 'website',
  },
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
