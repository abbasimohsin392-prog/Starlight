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
    default: 'Starlight AI - AI Automation Agency for Chatbots & Workflow Automation',
    template: '%s | Starlight AI',
  },
  description: 'Starlight AI builds custom AI chatbots, AI receptionists, workflow automation, and AI integrations for businesses worldwide. Book a free strategy call today.',
  keywords: [
    'AI automation agency',
    'AI chatbot development',
    'AI receptionist',
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
    title: 'Starlight AI - AI Automation Agency for Chatbots & Workflow Automation',
    description: 'Custom AI chatbots, AI receptionists, workflow automation, and AI integrations for businesses worldwide.',
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
    title: 'Starlight AI - AI Automation Agency',
    description: 'Custom AI chatbots, AI receptionists, workflow automation, and AI integrations for businesses worldwide.',
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
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SmoothScrollProvider />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
