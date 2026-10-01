import { Reveal, SplitWords } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

type Props = {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
  light?: boolean
}

export function SectionHeader({ eyebrow, title, description, align = 'left', className, light }: Props) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      <Reveal amount={0.6}>
        <p className={cn('mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]', align === 'center' && 'justify-center', light ? 'text-primary-foreground/70' : 'text-primary')}>
          <span className={cn('h-px w-8', light ? 'bg-primary-foreground/50' : 'bg-primary')} />
          {eyebrow}
        </p>
      </Reveal>
      <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-bold leading-[1] tracking-[-0.03em]">
        <SplitWords text={title} inView step={0.04} />
      </h2>
      {description && (
        <Reveal delay={0.2} amount={0.6}>
          <p className={cn('mt-6 text-lg leading-relaxed', light ? 'text-primary-foreground/80' : 'text-muted-foreground')}>{description}</p>
        </Reveal>
      )}
    </div>
  )
}
