import type { Metadata } from 'next'
import { Nav } from '@/components/site/nav'
import { Process } from '@/components/site/process'
import { Footer } from '@/components/site/footer'

export const metadata: Metadata = {
  title: 'Our Process',
  description: 'See how Starlight AI scopes, designs, builds, tests, and launches practical AI workflows with clear handoffs.',
}

export default function ProcessPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen pt-24">
        <Process />
        <div className="mx-auto max-w-4xl px-6 pb-24 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">We confirm deliverables, timeline, integrations, third-party costs, and ongoing support in writing before implementation begins.</p>
          <a href="/contact" className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">Discuss your workflow</a>
        </div>
      </main>
      <Footer />
    </>
  )
}
