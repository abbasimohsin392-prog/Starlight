import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CustomCursor } from '@/components/custom-cursor'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.starlightai.site'),
  title: {
    default: 'Starlight AI - AI Chatbots, Receptionists & Automation for Any Business',
    template: '%s | Starlight AI',
  },
  description: 'Starlight AI builds AI chatbots, 24/7 AI receptionists, and workflow automation for businesses across every industry — real estate, dental, legal, hospitality, home services, and more. Serving the US, UK, and Kuwait. Book a free strategy call.',
  keywords: [
    'AI automation agency',
    'AI chatbot development',
    'AI receptionist for small business',
    'missed call text back service',
    'workflow automation',
    'custom AI solutions',
    'AI integration services',
    'business process automation',
    'AI chatbot for real estate',
    'AI chatbot for dental clinics',
    'AI chatbot for law firms',
    'AI chatbot for restaurants',
    'AI receptionist for med spas',
    'AI receptionist for gyms',
    'AI automation UK',
    'AI automation Kuwait',
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
    title: 'Starlight AI - AI Chatbots, Receptionists & Automation for Any Business',
    description: 'AI chatbots, 24/7 AI receptionists, and workflow automation for businesses across every industry, serving the US, UK, and Kuwait.',
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
    title: 'Starlight AI - AI Chatbots, Receptionists & Automation for Any Business',
    description: 'AI chatbots, 24/7 AI receptionists, and workflow automation for businesses across every industry, serving the US, UK, and Kuwait.',
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
  description: 'AI automation agency offering chatbots, AI receptionists, workflow automation, custom AI solutions, and AI integrations for businesses across every industry, worldwide.',
  sameAs: ['https://x.com/MAoun_onrise', 'https://www.instagram.com/starlight_.ai/'],
  areaServed: ['United States', 'United Kingdom', 'Kuwait'],
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'AI Chatbots, Receptionists & Workflow Automation',
  provider: {
    '@type': 'Organization',
    name: 'Starlight AI',
    url: 'https://www.starlightai.site',
  },
  areaServed: ['United States', 'United Kingdom', 'Kuwait'],
  audience: {
    '@type': 'Audience',
    audienceType: 'Businesses of any type, including real estate, dental, legal, hospitality, beauty and wellness, fitness, automotive, property management, and home services',
  },
  description: 'AI receptionist and chatbot systems that answer after-hours and missed calls, qualify leads, and book appointments, plus workflow automation, AI integration, custom AI models, and AI-powered analytics for businesses of any type.',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Starlight AI Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Chatbots & Assistants' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Receptionist' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Workflow Automation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Integration' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom AI Models' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Data Analytics & BI' } },
    ],
  },
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
        <CustomCursor />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
