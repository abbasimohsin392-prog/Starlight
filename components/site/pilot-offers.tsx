const pilots = [
  {
    market: 'Pakistan',
    name: 'WhatsApp lead capture',
    price: 'PKR 4,900',
    monthly: 'PKR 7,900/month',
    description: 'Answer property questions and pass viewing requests to your team.',
    limits: '100 AI replies in the pilot. 300 AI replies per month if you continue.',
    href: 'https://wa.me/923007657038?text=Hi%20Starlight%20AI%2C%20I%27d%20like%20to%20discuss%20the%20WhatsApp%20lead%20capture%20pilot.',
  },
  {
    market: 'United States',
    name: 'After-hours AI receptionist',
    price: '$49',
    monthly: '$99/month',
    description: 'Answer leasing calls after hours and email enquiry details to your team.',
    limits: '40 call minutes in the pilot. 100 call minutes per month if you continue.',
    href: 'mailto:hello@starlightai.site?subject=After-hours%20AI%20receptionist%20pilot',
  },
]

export function PilotOffers() {
  return (
    <section id="pilots" aria-labelledby="pilot-heading" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-12">
      <h2 id="pilot-heading" className="font-display text-3xl font-bold tracking-tight md:text-4xl">
        Try a 7-day pilot
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        We set up one location with approved FAQs, lead capture, a handoff to your team, and one revision. If you continue, we credit the pilot fee toward your first month.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {pilots.map((pilot) => (
          <article key={pilot.market} className="flex flex-col items-start rounded-3xl border border-border bg-surface/60 p-6 md:p-8">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">{pilot.market}</p>
            <h3 className="font-display mt-3 text-2xl font-bold">{pilot.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{pilot.description}</p>
            <p className="mt-5 text-sm text-muted-foreground">
              <strong className="font-display text-3xl font-bold text-foreground">{pilot.price}</strong> for 7 days
            </p>
            <p className="mt-2 text-sm font-semibold">{pilot.monthly} if you continue</p>
            <p className="mb-6 mt-2 text-sm text-muted-foreground">{pilot.limits}</p>
            <a href={pilot.href} className="mt-auto inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
              Request {pilot.market === 'Pakistan' ? 'WhatsApp' : 'receptionist'} pilot
            </a>
          </article>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        We confirm channel access and any separate provider fees before you pay.
      </p>
    </section>
  )
}
