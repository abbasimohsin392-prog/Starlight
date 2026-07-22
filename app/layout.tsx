import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.starlightai.site'),
  title: {
    default: 'Starlight AI - AI Receptionist & Chatbots for Home Service Businesses',
    template: '%s | Starlight AI',
  },
  description: 'Starlight AI builds AI receptionists and chatbots that answer missed calls and book jobs for plumbing, HVAC, and electrical companies — plus workflow automation for any business. Book a free strategy call.',
  keywords: [
    'AI receptionist for plumbers',
    'AI receptionist for HVAC companies',
    'missed call text back service',
    'AI chatbot for home services',
    'AI automation agency',
    'AI chatbot development',
    'workflow automation',
    'custom AI solutions',
    'AI integration services',
    'business process automation',
  ],
  generator: 'v0.app',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/images/starlight-logo.png',
    apple: '/images/starlight-logo.png',
    shortcut: '/images/starlight-logo.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.starlightai.site',
    siteName: 'Starlight AI',
    title: 'Starlight AI - AI Receptionist & Chatbots for Home Service Businesses',
    description: 'AI receptionists and chatbots that answer missed calls and book jobs for plumbing, HVAC, and electrical companies — plus workflow automation for any business.',
    images: [
      {
        url: '/images/og-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Starlight AI - Custom AI Systems That Run Your Business',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Starlight AI - AI Receptionist & Chatbots for Home Service Businesses',
    description: 'AI receptionists and chatbots that answer missed calls and book jobs for plumbing, HVAC, and electrical companies.',
    images: ['/images/og-banner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '0QMjYd5hSASQ_63IPTOFqdZlyssMFaRxbkvOBLZVuJY',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Starlight AI',
  url: 'https://www.starlightai.site',
  logo: 'https://www.starlightai.site/images/starlight-logo.png',
  description: 'AI automation agency offering chatbots, AI receptionists, workflow automation, custom AI solutions, and AI integrations for businesses worldwide.',
  sameAs: ['https://x.com/MAoun_onrise'],
  areaServed: 'Worldwide',
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'AI Receptionist and Chatbot for Home Service Businesses',
  provider: {
    '@type': 'Organization',
    name: 'Starlight AI',
    url: 'https://www.starlightai.site',
  },
  areaServed: ['United States', 'United Kingdom', 'Kuwait'],
  audience: {
    '@type': 'Audience',
    audienceType: 'Plumbing, HVAC, and electrical companies',
  },
  description: 'AI receptionist and chatbot systems that answer after-hours and missed calls, qualify leads, and book jobs for plumbing, HVAC, and electrical businesses.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SmoothScrollProvider />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
