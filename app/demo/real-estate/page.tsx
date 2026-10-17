import type { Metadata } from 'next'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import { PropertyDemo } from '@/components/site/property-demo'

export const metadata: Metadata = {
  title: 'Real Estate AI Demo',
  description: 'Explore an illustrative property enquiry assistant workflow with sample responses. No live listings, appointments, or lead collection are connected.',
}

export default function RealEstateDemoPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="relative min-h-screen overflow-hidden pb-24 pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(ellipse_at_top,var(--glow),transparent_68%)] opacity-30" />
        <section className="relative mx-auto max-w-6xl px-6">
          <a href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">← Back to Starlight AI</a>
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Real estate workflow</p>
            <h1 className="font-display mt-5 text-4xl font-bold tracking-tight md:text-6xl">See how an AI property assistant could respond.</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Try the conversation preview to see one possible way to answer common questions, capture an enquiry, and route a request to an agent.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <PropertyDemo />
          </div>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border bg-surface/40 p-5 text-sm leading-relaxed text-muted-foreground">
            This is a front-end concept demo with preset sample responses. It is not a deployed AI agent, does not use real property data, and does not book appointments or collect customer leads.
          </div>
          <div className="mt-10 text-center">
            <a href="/#contact" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">Discuss a live version for your agency</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
