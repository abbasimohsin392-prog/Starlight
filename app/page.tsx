import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TrustedCompanies } from "@/components/trusted-companies"
import { ServicesSection } from "@/components/services-section"
import { FeaturesSection } from "@/components/features-section"
import { ChatbotDemoSection } from "@/components/chatbot-demo-section"
import { PricingSection } from "@/components/pricing-section"
import { BookingSection } from "@/components/booking-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"
import { UrgencyBanner } from "@/components/urgency-banner"
import { FloatingCTA } from "@/components/floating-cta"
import { JarvisWelcome } from "@/components/jarvis-welcome"
import { AIGuideOrb } from "@/components/ai-guide-orb"

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      <CinematicBackground />
      <AIGuideOrb />
      <UrgencyBanner />
      <Navbar />
      <div className="relative z-10 pt-28">
        <HeroSection />
        <TrustedCompanies />
        <ServicesSection />
        <FeaturesSection />
        <ChatbotDemoSection />
        <PricingSection />
        <BookingSection />
        <TestimonialsSection />
        <FAQSection />
        <Footer />
      </div>
      <JarvisWelcome />
      <FloatingCTA />
    </main>
  )
}
