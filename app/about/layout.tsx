import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.starlightai.site'),
  title: {
    default: 'Starlight AI - We Build AI Systems That Grow Your Business',
    template: '%s | Starlight AI',
  },
  description: 'We help businesses automate and scale using advanced AI systems and workflows. Book a strategy call today.',
  generator: 'v0.app',
  icons: {
    icon: '/images/starlight-logo.png',
    apple: '/images/starlight-logo.png',
    shortcut: '/images/starlight-logo.png',
  },
  openGraph: {
    title: 'Starlight AI - We Build AI Systems That Grow Your Business',
    description: 'We help businesses automate and scale using advanced AI systems and workflows. Book a strategy call today.',
    url: 'https://www.starlightai.site',
    siteName: 'Starlight AI',
    images: ['/images/starlight-logo.png'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Starlight AI - We Build AI Systems That Grow Your Business',
    description: 'We help businesses automate and scale using advanced AI systems and workflows. Book a strategy call today.',
    images: ['/images/starlight-logo.png'],
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Starlight AI",
              url: "https://www.starlightai.site",
              logo: "https://www.starlightai.site/images/starlight-logo.png",
              description:
                "Starlight AI builds custom AI chatbots, workflow automation, and AI integrations to help businesses scale.",
              email: "starlightai306@gmail.com",
              sameAs: [],
            }),
          }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
