import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Syne, Manrope, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { Cursor } from '@/components/motion/cursor'
import { Preloader } from '@/components/motion/preloader'
import './globals.css'

const display = Syne({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const body = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const siteUrl = 'https://starlightai.site'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Starlight AI | AI Automation Agency',
    template: '%s | Starlight AI',
  },
  description:
    'Starlight AI builds AI receptionists, chatbots, WhatsApp agents, and custom automation systems that handle customer communication, lead generation, and support 24/7.',
  keywords: [
    'AI automation agency',
    'AI receptionist',
    'AI chatbot',
    'WhatsApp AI agent',
    'lead generation automation',
    'AI customer support',
  ],
  applicationName: 'Starlight AI',
  authors: [{ name: 'Starlight AI', url: siteUrl }],
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Starlight AI',
    title: 'Starlight AI | AI Automation Agency',
    description:
      'AI receptionists, chatbots, WhatsApp agents, and custom automation systems that run your customer communication 24/7.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Starlight AI | AI Automation Agency',
    description:
      'AI receptionists, chatbots, WhatsApp agents, and custom automation systems that run your customer communication 24/7.',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b12' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="antialiased cursor-none-desktop">
        <ThemeProvider>
          <Preloader />
          <SmoothScroll>{children}</SmoothScroll>
          <Cursor />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
