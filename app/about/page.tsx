import { pageMetadata } from '@/lib/seo'
export const metadata = pageMetadata("About Our AI Automation Studio", "Learn how Starlight AI approaches customer communication automation with workflow discovery, approved answers, human handoffs and measured outcomes.", "/about")
import { Nav } from '@/components/site/nav'
import { About } from '@/components/site/about'
import { Footer } from '@/components/site/footer'
export default function AboutPage(){return <><Nav/><main className="pt-24"><About headingLevel="h1"/></main><Footer/></>}
