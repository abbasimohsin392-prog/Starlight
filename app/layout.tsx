import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Starlight AI - We Build AI Systems That Grow Your Business',
  description: 'We help businesses automate and scale using advanced AI systems and workflows. Book a strategy call today.',
  generator: 'v0.app',
  icons: {
    icon: '/images/starlight-logo.png',
    apple: '/images/starlight-logo.png',
    shortcut: '/images/starlight-logo.png',
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
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
