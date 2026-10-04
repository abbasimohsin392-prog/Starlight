import { pageMetadata } from '@/lib/seo'
export const metadata = pageMetadata("Contact Our AI Automation Team", "Discuss your customer communication workflow with Starlight AI. Contact the team by email, WhatsApp or a strategy call to scope your next system.", "/contact")
import { Nav } from '@/components/site/nav'
import { Contact } from '@/components/site/contact'
import { Footer } from '@/components/site/footer'
export default function ContactPage(){return <><Nav/><main className="pt-24"><Contact headingLevel="h1"/></main><Footer/></>}
