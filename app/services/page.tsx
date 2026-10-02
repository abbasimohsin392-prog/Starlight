import { Nav } from '@/components/site/nav'
import { Services } from '@/components/site/services'
import { Process } from '@/components/site/process'
import { Footer } from '@/components/site/footer'
export default function ServicesPage(){return <><Nav/><main className="pt-24"><section className="mx-auto max-w-7xl px-6 pt-20 pb-4"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Services</p><h1 className="font-display mt-5 max-w-4xl text-[clamp(2.75rem,7vw,6rem)] font-bold leading-none tracking-[-0.04em]">Systems that take work off your team’s plate.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Explore the full service knowledge carried over from the previous website, now organised into a clearer journey.</p></section><Services/><Process/></main><Footer/></>}
