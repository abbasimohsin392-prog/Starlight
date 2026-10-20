import type { Metadata } from 'next'
import { Nav } from '@/components/site/nav'
import { About } from '@/components/site/about'
import { Footer } from '@/components/site/footer'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Starlight AI’s practical approach to AI workflows, guardrails, and human handoffs.',
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen pt-24">
        <About />
        <div className="mx-auto max-w-4xl px-6 pb-24 text-center">
          <a href="/contact" className="inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">Talk to Starlight AI</a>
        </div>
      </main>
      <Footer />
    </>
  )
}
