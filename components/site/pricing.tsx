import { ArrowRight, Check } from 'lucide-react'
import { pricingPlans, site } from '@/lib/data'
import { SectionHeader } from './section-header'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/reveal'

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-28 md:py-40">
      <SectionHeader eyebrow="Pricing" title="Simple starting points. Scoped around your workflow." description="The current plan structure is carried into the new design. Final scope, usage, integrations, and support are confirmed before delivery." />
      <StaggerGroup className="mt-16 grid gap-5 lg:grid-cols-4" delay={0.08}>
        {pricingPlans.map((plan) => (
          <StaggerItem key={plan.name}>
            <article className={`relative flex h-full flex-col rounded-3xl border p-7 ${plan.featured ? 'border-primary bg-primary/10' : 'border-border bg-surface/60'}`}>
              {plan.featured && <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary-foreground">Most popular</span>}
              <h3 className="font-display text-2xl font-bold tracking-tight">{plan.name}</h3>
              <p className="mt-3 min-h-12 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
              <p className="mt-7 font-display text-4xl font-bold">{plan.price}<span className="font-sans text-sm font-normal text-muted-foreground">{plan.price === 'Tailored' ? '' : '/mo'}</span></p>
              <ul className="mt-7 flex-1 space-y-3 border-t border-border pt-6">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{feature}</li>)}</ul>
              <a href={site.bookingUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">Discuss this plan <ArrowRight className="size-4" /></a>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>
      <Reveal className="mt-8 text-sm text-muted-foreground" delay={0.2}>Plans are starting points, not a substitute for a scoped proposal. Usage, integrations, implementation, and support are confirmed before work begins.</Reveal>
    </section>
  )
}
