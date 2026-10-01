'use client'

import { useActionState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Mail, MessageCircle, CalendarDays, Loader2 } from 'lucide-react'
import { submitContact, type ContactState } from '@/app/actions/contact'
import { site } from '@/lib/data'
import { SectionHeader } from './section-header'
import { Reveal, ease } from '@/components/motion/reveal'
import { Magnetic } from '@/components/motion/magnetic'
import { cn } from '@/lib/utils'

const initial: ContactState = { status: 'idle' }

function Field({
  label,
  name,
  type = 'text',
  error,
  textarea,
  placeholder,
  autoComplete,
}: {
  label: string
  name: string
  type?: string
  error?: string
  textarea?: boolean
  placeholder?: string
  autoComplete?: string
}) {
  const id = `contact-${name}`
  const base =
    'peer w-full rounded-2xl border bg-background/60 px-5 py-4 text-base outline-none transition-colors placeholder:text-transparent focus:border-primary'
  return (
    <div className="relative">
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          placeholder={placeholder ?? label}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(base, 'resize-none pt-7', error ? 'border-red-400' : 'border-border')}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder ?? label}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(base, 'pt-7', error ? 'border-red-400' : 'border-border')}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-5 top-2 text-xs font-medium text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary"
      >
        {label}
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export function Contact() {
  const [state, action, pending] = useActionState(submitContact, initial)

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-primary/15 to-transparent" />
      <div aria-hidden className="absolute left-1/2 top-1/2 size-[50rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1fr] lg:gap-24">
        <div>
          <SectionHeader
            eyebrow="Let’s talk"
            title="Ready to stop losing leads to voicemail?"
            description="Book a free 30-minute strategy call. We’ll map your customer journey, spot the leaks, and show you exactly what an AI system would look like for your business."
          />
          <Reveal className="mt-12 space-y-4" delay={0.2}>
            <a href={`mailto:${site.email}`} className="group flex items-center gap-4 text-lg">
              <span className="flex size-12 items-center justify-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:text-primary">
                <Mail className="size-5" />
              </span>
              {site.email}
            </a>
            <a href={site.whatsappUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-lg">
              <span className="flex size-12 items-center justify-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:text-primary">
                <MessageCircle className="size-5" />
              </span>
              WhatsApp {site.whatsapp}
            </a>
            <a href={site.bookingUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-lg">
              <span className="flex size-12 items-center justify-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:text-primary">
                <CalendarDays className="size-5" />
              </span>
              Book a free strategy call
            </a>
          </Reveal>
          <Reveal className="mt-12 flex flex-wrap gap-3" delay={0.3}>
            {['Free strategy call', 'No commitment', 'Reply within 1 business day'].map((chip) => (
              <span key={chip} className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
                <Check className="size-3.5 text-primary" /> {chip}
              </span>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.15} amount={0.2}>
          <div className="relative rounded-[2rem] border border-border bg-surface/70 p-6 backdrop-blur md:p-10">
            <AnimatePresence mode="wait">
              {state.status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                  role="status"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                    className="glow-primary flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Check className="size-9" />
                  </motion.span>
                  <h3 className="font-display mt-8 text-3xl font-bold tracking-tight">You’re on the list.</h3>
                  <p className="mt-3 max-w-sm text-muted-foreground">{state.message}</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  action={action}
                  noValidate
                  initial={false}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" name="name" autoComplete="name" error={state.errors?.name} />
                    <Field label="Work email" name="email" type="email" autoComplete="email" error={state.errors?.email} />
                  </div>
                  <Field label="Business name" name="business" autoComplete="organization" error={state.errors?.business} />
                  <Field label="What would you like to automate?" name="message" textarea error={state.errors?.message} />
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

                  {state.status === 'error' && state.message && (
                    <p role="alert" className="text-sm text-red-400">
                      {state.message}
                    </p>
                  )}

                  <Magnetic className="w-full" strength={0.15}>
                    <button
                      type="submit"
                      disabled={pending}
                      className="glow-primary group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-primary text-base font-semibold text-primary-foreground transition-opacity disabled:opacity-70"
                    >
                      {pending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Sending
                        </>
                      ) : (
                        <>
                          Request my AI system
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </Magnetic>
                  <p className="text-center text-xs text-muted-foreground">
                    Prefer to talk? Email us at{' '}
                    <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:text-foreground">
                      {site.email}
                    </a>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
