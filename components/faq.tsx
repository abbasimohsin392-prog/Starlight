'use client'

import { useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const FAQS = [
  {
    question: 'How long does a typical project take?',
    answer:
      'A Sprint runs two weeks; a full Studio build usually lands between six and ten weeks depending on scope. We fix the timeline before kickoff and hold it.',
  },
  {
    question: 'Does all that motion hurt performance?',
    answer:
      'No — we treat frame rate as a design constraint. Animations run on the compositor where possible, heavy scenes are lazy-loaded, and every project ships with a performance budget we verify before launch.',
  },
  {
    question: 'What about users who prefer reduced motion?',
    answer:
      'Every animation respects the prefers-reduced-motion setting. Those users get the same content and layout with instant, calm transitions instead of choreography.',
  },
  {
    question: 'Do you work with in-house teams?',
    answer:
      'Often. On Partner retainers we embed directly into your workflow — your designers keep ownership, we bring the motion and build expertise.',
  },
  {
    question: 'What do we receive at handoff?',
    answer:
      'A production-ready codebase, a documented motion system with tokens and easing curves, and a walkthrough session so your team can extend it without us.',
  },
]

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" aria-labelledby="faq-heading" className="relative">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 md:py-28">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mb-12 flex flex-col gap-3"
        >
          <motion.p
            variants={item}
            className="font-mono text-xs uppercase tracking-[0.3em] text-accent"
          >
            FAQ
          </motion.p>
          <motion.h2
            id="faq-heading"
            variants={item}
            className="text-balance font-sans text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Questions, <span className="text-primary">answered</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col"
        >
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div key={faq.question} variants={item} className="border-t border-border last:border-b">
                <button
                  type="button"
                  data-cursor-hover
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-primary"
                >
                  <span className="text-pretty font-medium leading-relaxed">{faq.question}</span>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center font-mono text-lg text-muted-foreground"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-12 text-pretty text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
