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
    <main className="min-h-screen bg-background relative">
      <CinematicBackground />
      <UrgencyBanner />
      <Navbar />
      <div className="relative z-10 pt-28">
        <HeroSection />
        <ScrollExpand
          src="/images/og-banner.jpg"
          alt="Starlight AI automation in action"
          title="Built to scale"
          scrollHint="Scroll"
        >
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-3">Every workflow, everywhere</h2>
          <p className="text-muted-foreground leading-relaxed">
            From missed calls to booked appointments, Starlight AI automates the moments that used to cost you customers.
          </p>
        </ScrollExpand>
        <div style={{ position: "relative", width: "100%", height: "450px" }}>
          <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
            <div className="text-center px-4">
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Your leads, chased down</h2>
              <p className="text-muted-foreground">Move your cursor and click around.</p>
            </div>
          </ClickSpark>
        </div>
        <TrustedCompanies />
        <ServicesSection />
        <FeaturesSection />
        <WorkPerformanceSection />
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
