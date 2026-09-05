import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Starlight AI — Build the future. Automate the now.',
  description: 'Starlight AI builds intelligent systems, workflow automation and digital growth engines for ambitious businesses.',
  generator: 'Starlight AI',
  metadataBase: new URL('https://starlightai.site'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Starlight AI',
    description: 'Intelligent systems for ambitious businesses.',
    type: 'website',
    url: 'https://starlightai.site',
    images: [{ url: '/images/og-banner.jpg', width: 1200, height: 630, alt: 'Starlight AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Starlight AI',
    description: 'Intelligent systems for ambitious businesses.',
    images: ['/images/og-banner.jpg'],
  },
}

export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#0a0a0a', userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Starlight AI',
      url: 'https://starlightai.site',
      logo: 'https://starlightai.site/starlight-logo.png',
      sameAs: ['https://www.instagram.com/starlight_.ai/'],
      contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'hello@starlightai.site', availableLanguage: ['English'] },
      knowsAbout: ['AI receptionists', 'AI chatbots', 'workflow automation', 'lead capture', 'appointment booking'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Starlight AI',
      url: 'https://starlightai.site',
      inLanguage: 'en',
    },
  ]

  return <html lang="en" className="bg-background"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></body></html>
}
