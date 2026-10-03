import { cn } from '@/lib/utils'

/** Starlight AI "S" mark: gradient S with a small star accent. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={cn('shrink-0', className)}>
      <defs>
        <linearGradient id="sl-grad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="0.5" stopColor="#5b6cff" />
          <stop offset="1" stopColor="#c04cff" />
        </linearGradient>
      </defs>
      <path
        d="M44 18c-3-3.5-8-5.5-13.5-5.5C21 12.5 15 17.5 15 24.5c0 6.5 5 9.5 13 11.5l6 1.5c6 1.5 8.5 3 8.5 6 0 3.5-3.5 6-9.5 6-5 0-9.5-2-12.5-5.5"
        stroke="url(#sl-grad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M50 8l1.6 4.4L56 14l-4.4 1.6L50 20l-1.6-4.4L44 14l4.4-1.6L50 8z" fill="#7dd3fc" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <Logo className="size-8" />
      <span className="font-display text-lg font-bold tracking-tight">
        Starlight <span className="text-gradient">AI</span>
      </span>
    </span>
  )
}
