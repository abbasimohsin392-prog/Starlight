import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TrustedCompanies } from "@/components/trusted-companies"
import { ServicesSection } from "@/components/services-section"
import { FeaturesSection } from "@/components/features-section"
import { PricingSection } from "@/components/pricing-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"
import { UrgencyBanner } from "@/components/urgency-banner"
import { FloatingCTA } from "@/components/floating-cta"
import { JarvisWelcome } from "@/components/jarvis-welcome"

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      <UrgencyBanner />
      <CinematicBackground />
      <JarvisWelcome />
      <div className="relative z-10 pt-9">
        <Navbar />
        <HeroSection />
        <TrustedCompanies />
        <ServicesSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <Footer />
      </div>
      <FloatingCTA />
    </main>
  )
}
