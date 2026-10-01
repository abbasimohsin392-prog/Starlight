import { ArrowUpRight } from 'lucide-react'
import { navLinks, site } from '@/lib/data'
import { Wordmark } from './logo'
import { Reveal } from '@/components/motion/reveal'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI automation agency building receptionists, chatbots, WhatsApp agents, and custom workflows for
              businesses that refuse to miss a lead.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="transition-colors hover:text-primary">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-primary">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.whatsappUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">
                  WhatsApp {site.whatsapp}
                </a>
              </li>
              <li>
                <a href={site.url} className="transition-colors hover:text-primary">
                  starlightai.site
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Social</p>
            <ul className="mt-5 space-y-3 text-sm">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 transition-colors hover:text-primary"
                  >
                    {s.label}
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Reveal amount={0.2} className="mt-20 overflow-hidden">
          <p
            aria-hidden
            className="font-display select-none whitespace-nowrap text-center text-[clamp(4rem,17vw,16rem)] font-bold leading-none tracking-[-0.05em] text-foreground/[0.04]"
          >
            Starlight AI
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Starlight AI. All rights reserved.</p>
          <p className="font-mono">Designed & engineered for businesses that never sleep.</p>
        </div>
      </div>
    </footer>
  )
}
