import { Plus } from 'lucide-react'
import { faqs } from '@/lib/data'
import { SectionHeader } from './section-header'
import { StaggerGroup, StaggerItem } from '@/components/motion/reveal'

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-5xl px-6 py-28 md:py-40">
      <SectionHeader eyebrow="FAQ" title="The useful answers, before the first call." description="A short version of the questions visitors asked on the previous site, carried into the new experience." />
      <StaggerGroup className="mt-14 divide-y divide-border border-y border-border" delay={0.08}>
        {faqs.map((item) => (
          <StaggerItem key={item.question}>
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-bold tracking-tight marker:hidden [&::-webkit-details-marker]:hidden">{item.question}<span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border transition-transform group-open:rotate-45"><Plus className="size-4" /></span></summary>
              <p className="max-w-3xl pt-4 leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}
