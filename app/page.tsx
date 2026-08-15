import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { Services } from '@/components/services'
import { Features } from '@/components/features'
import { Showcase } from '@/components/showcase'
import { Pricing } from '@/components/pricing'
import { Testimonials } from '@/components/testimonials'
import { Faq } from '@/components/faq'

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Hero />
        <Services />
        <Features />
        <Showcase />
        <Pricing />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}
