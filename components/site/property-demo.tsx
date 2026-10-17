'use client'

import { useState } from 'react'
import { MessageCircle, RotateCcw } from 'lucide-react'

type Message = { role: 'assistant' | 'visitor'; text: string }

const options = [
  {
    prompt: 'Show me a sample home under $400,000',
    response: 'For this preview, the sample dataset includes the Oakview Townhome in Austin, listed here as an illustrative $385,000 property with 3 bedrooms and 2 bathrooms. This is fictional demo data, not a live listing.',
  },
  {
    prompt: 'Can I book a viewing?',
    response: 'A configured live assistant could collect your preferred day and contact details, then send a viewing request to the agent for confirmation. This preview does not create a real appointment.',
  },
  {
    prompt: 'What happens to my enquiry?',
    response: 'In a live setup, the assistant can capture the details you choose to provide and route them to the agreed inbox or CRM. A team member can then follow up.',
  },
  {
    prompt: 'I want to speak to a person',
    response: 'That is a good handoff point. A live system can provide the agent’s approved contact path or request a callback, depending on the business workflow.',
  },
]

const initialMessage: Message = {
  role: 'assistant',
  text: 'Hi! I’m a sample property enquiry assistant. Ask about an example listing, request a viewing, or see how a lead can be handed to an agent.',
}

export function PropertyDemo() {
  const [messages, setMessages] = useState<Message[]>([initialMessage])

  function ask(option: (typeof options)[number]) {
    setMessages((current) => [
      ...current,
      { role: 'visitor', text: option.prompt },
      { role: 'assistant', text: option.response },
    ])
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface/80 shadow-[0_0_60px_-28px_var(--glow)]">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-primary"><MessageCircle className="size-5" /></span>
          <div>
            <p className="font-semibold">Property Enquiry Assistant</p>
            <p className="text-xs text-muted-foreground">Interactive concept preview</p>
          </div>
        </div>
        <button type="button" onClick={() => setMessages([initialMessage])} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground" aria-label="Reset demo conversation">
          <RotateCcw className="size-3.5" /> Reset
        </button>
      </div>

      <div className="max-h-[420px] min-h-[320px] space-y-4 overflow-y-auto p-5 md:p-7" role="log" aria-live="polite" aria-label="Demo conversation">
        {messages.map((message, index) => (
          <div key={index} className={message.role === 'visitor' ? 'flex justify-end' : 'flex justify-start'}>
            <p className={message.role === 'visitor' ? 'max-w-[88%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground' : 'max-w-[88%] rounded-2xl rounded-bl-sm border border-border bg-background px-4 py-3 text-sm leading-relaxed'}>
              {message.text}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-5 md:p-7">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Try a sample question</p>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button key={option.prompt} type="button" onClick={() => ask(option)} className="rounded-full border border-border bg-background/60 px-4 py-2.5 text-left text-xs leading-relaxed transition-colors hover:border-primary/60 hover:text-primary">
              {option.prompt}
            </button>
          ))}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Simulation only: responses use preset sample text. This preview is not connected to live listings, a CRM, WhatsApp, or a calendar, and it does not send or store lead details.</p>
      </div>
    </div>
  )
}
