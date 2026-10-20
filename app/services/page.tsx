import type { Metadata } from 'next'
import { ArrowRight, Check } from 'lucide-react'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import { services } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore Starlight AI services: AI receptionists, website chatbots, WhatsApp assistants, customer support, lead routing, and custom automation.',
}

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="relative min-h-screen overflow-hidden pb-24 pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(ellipse_at_top,var(--glow),transparent_68%)] opacity-30" />
        <section className="relative mx-auto max-w-7xl px-6">
          <a href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">← Back to Starlight AI</a>
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Services</p>
            <h1 className="font-display mt-5 text-4xl font-bold tracking-tight md:text-6xl">Automation for the work your team repeats.</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">We scope each workflow around your business, approved information, tools, and handoff needs. Availability depends on the chosen providers and agreed implementation.</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.index} className="flex flex-col rounded-3xl border border-border bg-surface/60 p-6 md:p-7">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{service.index} / service</p>
                <h2 className="font-display mt-4 text-2xl font-bold tracking-tight">{service.title}</h2>
                <p className="mt-2 font-medium">{service.tagline}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                <ul className="mt-5 space-y-2">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2 text-sm">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="/pricing" className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:border-primary/60">View pricing <ArrowRight className="size-4" /></a>
            <a href="/contact" className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">Discuss your workflow <ArrowRight className="size-4" /></a>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">A service name is not a promise that every integration is included. We confirm deliverables, usage limits, third-party fees, support, and implementation cost in writing before work begins.</p>
        </section>
      </main>
      <Footer />
    </>
  )
}
