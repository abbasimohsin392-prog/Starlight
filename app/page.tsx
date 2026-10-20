import type { Metadata } from 'next'
import { Nav } from '@/components/site/nav'
import { Hero } from '@/components/site/hero'
import { Marquee } from '@/components/site/marquee'
import { Footer } from '@/components/site/footer'

export const metadata: Metadata = {
  title: 'AI Automation Agency',
  description: 'Explore practical AI receptionists, website chatbots, WhatsApp agents, and custom business workflows from Starlight AI.',
}

export default function HomePage() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <Nav />
      <main id="main-content">
        <Hero />
        <Marquee />
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: 'Explore services', description: 'AI receptionists, chatbots, WhatsApp agents, and custom workflows.', href: '/services', label: 'View services' },
              { title: 'See how we work', description: 'A clear path from workflow discovery to testing and launch.', href: '/process', label: 'Our process' },
              { title: 'Explore solutions', description: 'Illustrative workflow blueprints for common business needs.', href: '/solutions', label: 'View solutions' },
            ].map((item) => (
              <a key={item.href} href={item.href} className="group rounded-3xl border border-border bg-surface/50 p-7 transition-colors hover:border-primary/50 md:p-8">
                <h2 className="font-display text-2xl font-bold tracking-tight">{item.title}</h2>
                <p className="mt-3 min-h-12 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">{item.label}<span aria-hidden className="transition-transform group-hover:translate-x-1">→</span></span>
              </a>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="/about" className="inline-flex h-12 items-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:border-primary/60">About Starlight AI</a>
            <a href="/pricing" className="inline-flex h-12 items-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:border-primary/60">View pricing</a>
            <a href="/contact" className="inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">Book a call</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
