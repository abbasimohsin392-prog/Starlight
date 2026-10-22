import { cn } from '@/lib/utils'

/** Starlight AI original broad folded-ribbon S mark. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={cn('shrink-0', className)}>
      <defs>
        <linearGradient id="sl-ribbon-body" x1="9" y1="10" x2="55" y2="55" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f15cff" />
          <stop offset=".24" stopColor="#642cff" />
          <stop offset=".53" stopColor="#075cff" />
          <stop offset=".78" stopColor="#08baff" />
          <stop offset="1" stopColor="#62ffff" />
        </linearGradient>
        <linearGradient id="sl-ribbon-top" x1="16" y1="10" x2="50" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f9a8ff" />
          <stop offset=".3" stopColor="#643bff" />
          <stop offset=".72" stopColor="#087bff" />
          <stop offset="1" stopColor="#70ffff" />
        </linearGradient>
        <linearGradient id="sl-ribbon-bottom" x1="13" y1="38" x2="53" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ef54ff" />
          <stop offset=".42" stopColor="#5140ff" />
          <stop offset=".78" stopColor="#087cff" />
          <stop offset="1" stopColor="#54faff" />
        </linearGradient>
        <linearGradient id="sl-ribbon-edge" x1="11" y1="16" x2="53" y2="49" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffd5ff" />
          <stop offset=".45" stopColor="#8b8dff" />
          <stop offset="1" stopColor="#baffff" />
        </linearGradient>
      </defs>
      <path d="M52 8C47 3 38 4 28 8C17 12 7 18 7 26C7 32 15 36 27 40C36 43 45 46 45 50C45 54 37 56 29 56C22 56 16 54 11 50L8 57C15 62 25 63 35 60C47 56 56 50 56 43C56 35 47 31 35 27C25 24 17 21 18 18C19 15 29 11 38 10C43 9 47 11 50 13Z" fill="url(#sl-ribbon-body)"/>
      <path d="M52 8C47 3 38 4 28 8C17 12 7 18 7 26C7 32 15 36 27 40C36 43 45 46 45 50C45 54 37 56 29 56C22 56 16 54 11 50L8 57C15 62 25 63 35 60C47 56 56 50 56 43C56 35 47 31 35 27C25 24 17 21 18 18C19 15 29 11 38 10C43 9 47 11 50 13Z" fill="url(#sl-ribbon-top)" fillOpacity=".32"/>
      <path d="M8 24C8 17 20 11 29 8C39 4 47 5 52 8L50 13C45 10 39 10 32 12C22 15 15 20 15 24C15 28 24 31 34 35C47 40 56 45 56 51C54 57 43 62 34 62C24 63 15 60 8 55L11 50C16 54 22 56 29 56C38 56 45 54 45 50C45 46 36 43 27 40C15 36 7 32 8 24Z" fill="url(#sl-ribbon-body)"/>
      <path d="M8 24C8 17 20 11 29 8C39 4 47 5 52 8C45 7 37 10 28 14C20 18 15 22 15 25C15 29 24 32 34 35C47 40 55 45 55 50" stroke="url(#sl-ribbon-edge)" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M10 55C17 59 26 60 35 57C44 54 50 50 49 46C48 41 38 37 29 34C18 30 11 27 13 22" stroke="#d8caff" strokeOpacity=".48" strokeWidth=".8" strokeLinecap="round"/>
      <path d="M15 27C19 31 28 34 37 37C45 40 51 44 51 48C51 52 44 56 36 58" stroke="#061a8e" strokeOpacity=".32" strokeWidth="1.4" strokeLinecap="round"/>
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
