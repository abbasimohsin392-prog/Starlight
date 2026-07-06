import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read Starlight AI's terms of service governing use of our website and AI automation services.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-background relative">
      <CinematicBackground />
      <Navbar />
      <div className="relative z-10 pt-32 pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-6">Last updated: June 2026</p>

        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Services</h2>
            <p>Starlight AI provides AI automation, chatbot development, workflow automation, custom websites, and related digital services to businesses ("Clients"). The scope of each engagement will be agreed upon before work begins.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. Payments</h2>
            <p>Pricing for our services is listed on our website or provided directly to Clients. Payments are processed through our designated payment providers. All fees are non-refundable unless otherwise agreed in writing.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. Project Delivery</h2>
            <p>Delivery timelines are estimates and may vary depending on project complexity and Client responsiveness. We will communicate any significant changes to timelines as they arise.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Revisions</h2>
            <p>Each package includes a defined number of revisions as outlined at the time of purchase. Additional revisions beyond this scope may incur additional fees.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. Client Responsibilities</h2>
            <p>Clients are responsible for providing accurate information, timely feedback, and any necessary access (e.g. to existing systems, accounts, or platforms) required to complete the project.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. Limitation of Liability</h2>
            <p>Starlight AI is not liable for indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the amount paid for the specific service in question.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">7. Intellectual Property</h2>
            <p>Upon full payment, Clients receive ownership of the final deliverables created specifically for them. Starlight AI retains rights to general methodologies, tools, and frameworks used in delivering services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">8. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of our services after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">9. Contact Us</h2>
            <p>For questions about these Terms, contact us at starlightai306@gmail.com.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
