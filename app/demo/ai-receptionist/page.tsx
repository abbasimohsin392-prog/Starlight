import type { Metadata } from 'next'
import { ArrowRight, Headphones, MessageSquareText, ShieldCheck } from 'lucide-react'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import { VoiceReceptionist } from '@/components/site/voice-receptionist'

export const metadata: Metadata = {
  title: 'AI Receptionist Demo',
  description: 'Talk to Starlight AI’s branded voice receptionist demo. Speak through your microphone or type a message to see how a conversational AI assistant could help visitors.',
}

export default function AIReceptionistDemoPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="relative min-h-screen overflow-hidden pb-24 pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(ellipse_at_top,var(--glow),transparent_68%)] opacity-30" />
        <section className="relative mx-auto max-w-6xl px-6">
          <a href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">← Back to Starlight AI</a>
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Try a live voice workflow</p>
            <h1 className="font-display mt-5 text-4xl font-bold tracking-tight md:text-6xl">Meet your AI receptionist.</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Speak naturally, ask follow-up questions, or type a message. Hear how a conversational receptionist could answer enquiries and explain your next steps.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-5xl">
            <VoiceReceptionist />
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-border bg-surface/40 p-5">
              <Headphones className="size-5 text-primary" />
              <h2 className="mt-4 font-semibold">Natural voice</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use your microphone and hear spoken replies, with support for interruptions during a live conversation.</p>
            </article>
            <article className="rounded-2xl border border-border bg-surface/40 p-5">
              <MessageSquareText className="size-5 text-primary" />
              <h2 className="mt-4 font-semibold">Voice or text</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Try common questions about AI receptionists, WhatsApp agents, workflows, or starting prices.</p>
            </article>
            <article className="rounded-2xl border border-border bg-surface/40 p-5">
              <ShieldCheck className="size-5 text-primary" />
              <h2 className="mt-4 font-semibold">Clearly a demo</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">No actual appointments, lead submissions, CRM changes, or messages to your team are made from this preview.</p>
            </article>
          </div>

          <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-3">
            <a href="/contact" className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">Build one for my business <ArrowRight className="size-4" /></a>
            <a href="/demo/real-estate" className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:border-primary/60">Explore the property demo <ArrowRight className="size-4" /></a>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
            Uses a secure, short-lived session issued by the server. The AI provider may process voice and text to generate replies; usage limits or charges may apply. The microphone is requested only after you press Start.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
