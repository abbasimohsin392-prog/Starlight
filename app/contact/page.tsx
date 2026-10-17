import type { Metadata } from 'next'
import { Nav } from '@/components/site/nav'
import { Contact } from '@/components/site/contact'
import { Footer } from '@/components/site/footer'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Book a free 30-minute workflow strategy call or contact Starlight AI by email or WhatsApp.',
}

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen pt-24">
        <Contact />
      </main>
      <Footer />
    </>
  )
}
