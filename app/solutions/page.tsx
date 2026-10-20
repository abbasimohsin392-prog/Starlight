import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import { systems } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'Explore illustrative Starlight AI workflow blueprints for clinics, real estate, ecommerce, and home services.',
}

export default function SolutionsPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="relative min-h-screen overflow-hidden pb-24 pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(ellipse_at_top,var(--glow),transparent_68%)] opacity-30" />
        <section className="relative mx-auto max-w-7xl px-6">
          <a href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">← Back to Starlight AI</a>
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Solutions</p>
            <h1 className="font-display mt-5 text-4xl font-bold tracking-tight md:text-6xl">Start with a real workflow.</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">These examples show the kinds of workflows an implementation could cover. They are illustrative blueprints—not client case studies, measured outcomes, or live connected systems.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {systems.map((system) => (
              <article key={system.title} className="overflow-hidden rounded-3xl border border-border bg-surface/60">
                <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
                  <Image src={system.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{system.category}</p>
                    <span className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">{system.result}</span>
                  </div>
                  <h2 className="font-display mt-4 text-2xl font-bold">{system.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{system.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="/demo/real-estate" className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:border-primary/60">Try the real-estate demo <ArrowRight className="size-4" /></a>
            <a href="/contact" className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">Discuss a solution <ArrowRight className="size-4" /></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
