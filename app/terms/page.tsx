import type { Metadata } from 'next'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Website terms and project-scope information for Starlight AI.',
}

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="relative min-h-screen overflow-hidden pb-24 pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,var(--glow),transparent_68%)] opacity-20" />
        <article className="relative mx-auto max-w-3xl px-6">
          <a href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">← Back to Starlight AI</a>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-primary">Last updated October 17, 2026</p>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">Terms of Service</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">These website terms cover use of starlightai.site and provide general information about discussing a project with Starlight AI. A signed proposal, statement of work, or service agreement may add project-specific terms.</p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">Website information and pricing</h2>
              <p className="mt-3">Website copy, examples, workflows, and starting prices are provided for general information and are not a final quote or promise that a particular feature is available in every package. Starting prices are in US dollars. The written proposal must confirm the deliverables, one-time implementation fee, recurring fees, integrations, usage limits, support, timeline, cancellation terms, and any applicable third-party charges before work begins.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">Project scope and timing</h2>
              <p className="mt-3">Implementation depends on the agreed scope, access to required accounts and data, third-party services, testing, and timely approvals. If these requirements change, the timeline or price may need to be updated in writing. We do not start paid implementation until the scope and charges have been approved.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">AI systems and results</h2>
              <p className="mt-3">AI-generated responses can be incomplete or incorrect and may depend on provider availability, the information supplied, and integrations. No particular sales, lead-conversion, savings, response-time, or return-on-investment result is guaranteed. High-impact decisions and exceptions should have an appropriate human review or handoff path.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">Third-party services and customer responsibilities</h2>
              <p className="mt-3">Projects may rely on external AI, telephony, messaging, calendar, CRM, or hosting providers whose availability, terms, pricing, and usage limits are outside Starlight AI’s control. Any separate costs will be identified in the proposal where applicable. You are responsible for having the rights and permissions needed to provide data, contact your customers, and use the connected services for your intended purpose.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">Payments, cancellation, and ownership</h2>
              <p className="mt-3">Payment milestones, recurring billing, refunds, cancellation, and ownership or licensing of deliverables must be stated in the written agreement for the project. Please review and resolve these terms before approving work; do not assume an unstated refund, cancellation, or transfer arrangement.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">Contact</h2>
              <p className="mt-3">For questions about these terms or a proposed project, email <a className="text-primary underline underline-offset-4" href="mailto:hello@starlightai.site">hello@starlightai.site</a>.</p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
