import { Nav } from '@/components/site/nav'
import { Hero } from '@/components/site/hero'
import { Marquee } from '@/components/site/marquee'
import { Stats } from '@/components/site/stats'
import { Systems } from '@/components/site/systems'
import { Contact } from '@/components/site/contact'
import { Footer } from '@/components/site/footer'

const pages = [
  { href: '/services', label: 'Services', text: 'Explore receptionists, chatbots, support agents, WhatsApp systems, lead automation, and custom workflows.' },
  { href: '/solutions', label: 'Solutions', text: 'See practical system blueprints for healthcare, property, commerce, and service businesses.' },
  { href: '/pricing', label: 'Pricing & FAQ', text: 'Review the starting plans and answers visitors need before a strategy call.' },
  { href: '/blog', label: 'Blog', text: 'Read practical guides about AI reception, enquiry handling, and workflow automation.' },
]

export default function HomePage() {
  return <><a href="#systems" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a><Nav /><main><Hero /><Marquee /><Stats /><section className="mx-auto max-w-7xl px-6 py-28 md:py-40"><div className="grid gap-5 md:grid-cols-2">{pages.map((page) => <a key={page.href} href={page.href} className="group rounded-3xl border border-border bg-surface/60 p-8 transition-colors hover:border-primary"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Explore</p><h2 className="font-display mt-4 text-3xl font-bold tracking-tight group-hover:text-primary">{page.label}</h2><p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{page.text}</p><span className="mt-8 inline-block text-sm font-semibold text-primary">Open page →</span></a>)}</div></section><Systems /><Contact /></main><Footer /></>
}
