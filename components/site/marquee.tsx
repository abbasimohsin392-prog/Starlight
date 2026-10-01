import { marqueeItems } from '@/lib/data'
import { Reveal } from '@/components/motion/reveal'

export function Marquee() {
  const items = [...marqueeItems, ...marqueeItems]
  return (
    <div className="relative border-y border-border bg-surface/40 py-5" aria-label="Automation stack and integrations">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee motion-reduce:animate-none" style={{ animationDuration: '45s' }}>
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            aria-hidden={i >= marqueeItems.length}
            className="font-mono mx-8 flex items-center gap-8 text-sm uppercase tracking-[0.2em] text-muted-foreground"
          >
            {item}
            <span className="size-1.5 rounded-full bg-primary/60" />
          </span>
        ))}
      </div>
    </div>
  )
}

