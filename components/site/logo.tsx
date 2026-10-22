import { cn } from '@/lib/utils'

/** Starlight AI glossy ribbon S mark. Shared by the header and animated preloader. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={cn('shrink-0', className)}>
      <defs>
        <linearGradient id="sl-ribbon" x1="13" y1="7" x2="51" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#26e7f5" />
          <stop offset="0.25" stopColor="#087bff" />
          <stop offset="0.55" stopColor="#4438ff" />
          <stop offset="0.78" stopColor="#a52cff" />
          <stop offset="1" stopColor="#f044db" />
        </linearGradient>
        <linearGradient id="sl-ribbon-highlight" x1="19" y1="12" x2="49" y2="53" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b8ffff" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#6ca7ff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#f5b5ff" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="sl-ribbon-dot" cx="0" cy="0" r="1" gradientTransform="matrix(8 10 -10 8 48 5)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#54ffff" />
          <stop offset="0.55" stopColor="#168bff" />
          <stop offset="1" stopColor="#5d36ff" />
        </radialGradient>
      </defs>
      <path
        d="M46.5 7.5C39.5 5.2 28.4 9.2 19.9 14.1C10.9 19.3 7.5 25.5 11.4 31.4C14.3 35.8 22.3 38.7 32.2 41.8C40.4 44.4 45.1 47.2 41.5 51.3C37.8 55.6 26.6 57.9 16.1 54.2L12.1 61C24.7 65.6 40.4 60.9 48.2 53.7C55.4 47 51.5 40.1 41.8 35.2C33.5 31 21.8 29 20.8 25.1C19.8 21.4 29.2 16.7 38.4 13.9C42.4 12.7 46.3 13.5 49.2 15.4L52.1 9.5C50.4 8.6 48.5 7.9 46.5 7.5Z"
        fill="url(#sl-ribbon)"
      />
      <path
        d="M19.7 14.5C29.1 9.1 39.7 6.6 46.3 8.6C39.1 8.1 28.4 13 21.7 17.7C15.8 21.8 14.3 25.1 16.2 28.2"
        stroke="url(#sl-ribbon-highlight)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M13.9 32.7C18.1 36.4 26.6 38.9 35.2 41.7C43.1 44.3 47.2 47.3 44.3 51.2C41.1 55.3 28.7 59.3 17.3 56.1"
        stroke="#b9caff"
        strokeOpacity="0.35"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <circle cx="51.5" cy="7.5" r="4.1" fill="url(#sl-ribbon-dot)" />
      <circle cx="50.3" cy="6.3" r="1.1" fill="#d7ffff" fillOpacity="0.8" />
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
