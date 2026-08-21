import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import ScrollExpand from "@/components/scroll-expand"
import ClickSpark from "@/components/click-spark"
import { TrustedCompanies } from "@/components/trusted-companies"
import { ServicesSection } from "@/components/services-section"
import { FeaturesSection } from "@/components/features-section"
import { WorkPerformanceSection } from "@/components/work-performance-section"
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

export default function Home() {
  return (
    <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      <main className="min-h-screen bg-background relative">
        <CinematicBackground />
        <UrgencyBanner />
        <Navbar />
        <div className="relative z-10 pt-28">
          <HeroSection />
          <ScrollExpand
            title="Built to scale"
            scrollHint="Scroll"
            useWindowScroll
            content={<ChatbotDemoSection />}
          >
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-3">Every workflow, everywhere</h2>
            <p className="text-muted-foreground leading-relaxed">
              From missed calls to booked appointments, Starlight AI automates the moments that used to cost you customers.
            </p>
          </ScrollExpand>
          <TrustedCompanies />
          <ServicesSection />
          <FeaturesSection />
          <WorkPerformanceSection />
          <PricingSection />
          <BookingSection />
          <TestimonialsSection />
          <FAQSection />
          <Footer />
        </div>
        <JarvisWelcome />
        <FloatingCTA />
      </main>
    </ClickSpark>
  )
}
