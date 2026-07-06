import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read Starlight AI's privacy policy to understand how we collect, use, and protect your data.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background relative">
      <CinematicBackground />
      <Navbar />
      <div className="relative z-10 pt-32 pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: June 2026</p>

        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p>When you contact us through our website, book a strategy call, or engage our services, we may collect information such as your name, email address, phone number, business name, and details about your business needs.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
            <p>We use the information you provide to respond to inquiries, deliver our services, communicate about your project, and improve our offerings. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. Data Security</h2>
            <p>We take reasonable measures to protect your information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Third-Party Services</h2>
            <p>We may use third-party tools (such as scheduling platforms, payment processors, and analytics services) to operate our business. These providers have their own privacy policies governing the use of your information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. Cookies</h2>
            <p>Our website may use cookies to improve user experience and analyze site traffic. You can disable cookies through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal information by contacting us directly.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">7. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, contact us at starlightai306@gmail.com.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
