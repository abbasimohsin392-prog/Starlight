import type { Metadata } from 'next'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent starting prices for Starlight AI workflow automation. Final scope, setup fees, support, usage limits, and third-party costs are confirmed in writing.',
}

const plans = [
  {
    name: 'Starter',
    price: '$197',
    summary: 'For one clearly defined enquiry workflow.',
    features: [
      'One agreed website chatbot or straightforward lead workflow',
      'One primary channel and lead-capture path',
      'Approved business information and a defined human handoff',
      'Monthly service scope and support stated in your proposal',
    ],
    featured: false,
  },
  {
    name: 'Growth',
    price: '$397',
    summary: 'For a tailored assistant connected to your day-to-day tools.',
    features: [
      'A customized assistant for one agreed business use case',
      'An agreed CRM, calendar, or inbox connection',
      'Lead qualification and team notifications where supported',
      'Review against success measures agreed before launch',
    ],
    featured: true,
  },
  {
    name: 'Pro',
    price: '$597+',
    summary: 'For more involved workflows and integrations.',
    features: [
      'Multi-step or multi-channel workflows, as scoped',
      'Multiple agreed integrations where technically supported',
      'Defined routing and escalation for more complex requests',
      'Monitoring and optimization cadence specified in your proposal',
    ],
    featured: false,
  },
]

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="relative min-h-screen overflow-hidden pb-24 pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(ellipse_at_top,var(--glow),transparent_68%)] opacity-30" />
        <section className="relative mx-auto max-w-7xl px-6">
          <a href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">← Back to Starlight AI</a>
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Transparent starting points</p>
            <h1 className="font-display mt-5 text-4xl font-bold tracking-tight md:text-6xl">Pricing built around the workflow.</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Start with the business problem, not a bundle of features you may not need. These are starting monthly service prices in USD; we confirm the exact scope and all costs in writing before work begins.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className={plan.featured ? 'flex flex-col rounded-3xl border border-primary/60 bg-surface p-7 shadow-[0_0_40px_-16px_var(--glow)] md:p-9' : 'flex flex-col rounded-3xl border border-border bg-surface/60 p-7 md:p-9'}>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-2xl font-bold">{plan.name}</h2>
                  {plan.featured && <span className="rounded-full bg-primary/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-primary">Connected workflow</span>}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{plan.summary}</p>
                <p className="mt-8">
                  <span className="font-display text-5xl font-bold tracking-tight">{plan.price}</span>
                  <span className="ml-2 text-sm text-muted-foreground">/ month, starting</span>
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Recurring service price. Any one-time implementation fee is quoted separately where applicable.</p>
                <ul className="mt-8 flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm leading-relaxed">
                      <span aria-hidden className="mt-1 text-primary">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="/contact" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
                  Discuss this plan
                </a>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-border bg-surface/50 p-6 md:p-8">
            <h2 className="font-display text-xl font-bold">What is included in the final quote?</h2>
            <div className="mt-4 grid gap-5 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
              <p><strong className="text-foreground">Implementation:</strong> A one-time build/setup fee is quoted separately based on the workflow and integrations. Nothing starts until you approve the written scope.</p>
              <p><strong className="text-foreground">Third-party usage:</strong> AI/API usage, phone minutes, WhatsApp, CRM, and other vendor fees may be separate. Applicable costs and usage limits are disclosed before approval.</p>
              <p><strong className="text-foreground">Support and limits:</strong> Channels, usage limits, support hours, monitoring, and revision limits are defined in the proposal so neither side has to guess.</p>
              <p><strong className="text-foreground">Results:</strong> No specific sales, response-time, or ROI outcome is guaranteed. Results depend on your workflow, data, integrations, customer demand, and team follow-up.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">Need a different workflow?</p>
            <a href="/demo/real-estate" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Explore the illustrative real-estate demo <span aria-hidden>↗</span></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
