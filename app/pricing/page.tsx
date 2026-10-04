import { pageMetadata } from '@/lib/seo'
export const metadata = pageMetadata("AI Automation Pricing & Plans", "Compare Starlight AI starting plans, usage allowances and support options. Confirm workflow scope, integrations and implementation before delivery.", "/pricing")
import { Nav } from '@/components/site/nav'
import { Pricing } from '@/components/site/pricing'
import { Faq } from '@/components/site/faq'
import { Footer } from '@/components/site/footer'
export default function PricingPage(){return <><Nav/><main className="pt-24"><Pricing headingLevel="h1"/><Faq/></main><Footer/></>}
