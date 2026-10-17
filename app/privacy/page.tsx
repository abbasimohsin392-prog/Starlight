import type { Metadata } from 'next'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Starlight AI handles information submitted through this website.',
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="relative min-h-screen overflow-hidden pb-24 pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,var(--glow),transparent_68%)] opacity-20" />
        <article className="relative mx-auto max-w-3xl px-6">
          <a href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">← Back to Starlight AI</a>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-primary">Last updated October 17, 2026</p>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">Privacy Policy</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">This page explains how Starlight AI handles information you submit through starlightai.site. It covers this website and enquiry form, not every third-party service you may choose to use.</p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">Information you provide</h2>
              <p className="mt-3">When you submit the contact form, we receive the name, work email address, business name, and message you enter. Please do not submit passwords, payment details, sensitive personal information, or patient/health details through this form.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">How information is used</h2>
              <p className="mt-3">We use enquiry details to reply to your request, discuss a potential project, maintain relevant business communications, and protect the website from misuse. We do not sell contact form submissions.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">Service providers</h2>
              <p className="mt-3">The contact form uses Brevo to send enquiry notifications to Starlight AI. The website also uses Vercel Analytics in production to understand site usage and performance. External links such as Calendly, WhatsApp, email, and social networks are operated by their respective providers and are subject to their own privacy practices.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">Sharing and retention</h2>
              <p className="mt-3">We may share information with providers needed to operate this website and respond to you, or when disclosure is reasonably required by law, security, or the protection of our rights. We retain enquiry information only as long as reasonably needed for the request, ongoing business relationship, and legitimate recordkeeping needs.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">Your choices</h2>
              <p className="mt-3">To request access to, correction of, or deletion of information you submitted, email <a className="text-primary underline underline-offset-4" href="mailto:hello@starlightai.site">hello@starlightai.site</a>. Applicable rights may depend on where you live and the laws that apply.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">Changes and contact</h2>
              <p className="mt-3">We may update this policy when our website or data practices change. The date at the top indicates the latest revision. Questions can be sent to <a className="text-primary underline underline-offset-4" href="mailto:hello@starlightai.site">hello@starlightai.site</a>.</p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
