import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl = 'https://starlightai.site'
const siteTitle = 'Starlight AI: AI Automation Agency & AI Receptionists'
const siteDescription = 'Starlight AI builds AI receptionists, chatbots, and workflow automation that answer enquiries, qualify leads, and reduce repetitive admin for growing businesses.'
const socialImage = siteUrl + '/images/og-banner.jpg'
const faviconImage = siteUrl + '/favicon.svg'

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  generator: 'Starlight AI',
  applicationName: 'Starlight AI',
  keywords: ['AI automation agency', 'AI receptionist', 'AI chatbot', 'workflow automation', 'business process automation'],
  robots: { index: true, follow: true },
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: [{ url: '/starlight-ai-apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: siteTitle,
    description: 'AI receptionists, chatbots, and workflow automation for growing businesses.',
    type: 'website',
    url: siteUrl,
    siteName: 'Starlight AI',
    images: [{ url: socialImage, width: 1200, height: 630, type: 'image/jpeg', alt: 'Starlight AI — AI automation for growing businesses' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: 'AI receptionists, chatbots, and workflow automation for growing businesses.',
    images: [{ url: socialImage, alt: 'Starlight AI — AI automation for growing businesses' }],
  },
}

export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#0a0a0a', userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': siteUrl + '/#organization',
      name: 'Starlight AI',
      url: siteUrl,
      description: siteDescription,
      logo: { '@type': 'ImageObject', url: faviconImage, width: 512, height: 512 },
      image: faviconImage,
      sameAs: ['https://www.instagram.com/starlight_.ai/'],
      contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'hello@starlightai.site', availableLanguage: ['English'] },
      knowsAbout: ['AI receptionists', 'AI chatbots', 'workflow automation', 'lead capture', 'appointment booking'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': siteUrl + '/#website',
      name: 'Starlight AI',
      url: siteUrl,
      inLanguage: 'en',
      publisher: { '@id': siteUrl + '/#organization' },
    },
  ]

  return <html lang="en" className="bg-background"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></body></html>
}