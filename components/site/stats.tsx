import { stats } from '@/lib/data'
import { StaggerGroup, StaggerItem } from '@/components/motion/reveal'

export function Stats() {
  return (
    <section aria-label="What an AI workflow can support" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <StaggerGroup className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4" delay={0.1}>
        {stats.map((s) => (
          <StaggerItem key={s.label} className="bg-background p-8 md:p-10">
            <p className="font-display text-gradient text-4xl font-bold tracking-tight md:text-5xl">{s.value}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.label}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}
