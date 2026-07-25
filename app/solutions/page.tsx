import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"
import { niches } from "@/lib/niches"

export const metadata: Metadata = {
  title: "AI Receptionist & Chatbot Solutions by Industry",
  description:
    "Starlight AI builds AI receptionists and chatbots tailored to your industry, from dental clinics to auto repair shops to law firms. See what we build for your business.",
  alternates: {
    canonical: "/solutions",
  },
  openGraph: {
    title: "AI Receptionist & Chatbot Solutions by Industry | Starlight AI",
    description:
      "Starlight AI builds AI receptionists and chatbots tailored to your industry, from dental clinics to auto repair shops to law firms.",
    url: "https://www.starlightai.site/solutions",
  },
}

const categories = Array.from(new Set(niches.map((n) => n.category)))

export default function SolutionsIndexPage() {
  return (
    <main className="min-h-screen bg-background relative">
      <CinematicBackground />
      <div className="relative z-10">
        <Navbar />

        <section className="pt-40 pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">
              Solutions by Industry
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-balance">
              Built for Your Business, Not Generic Software
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every industry loses customers differently. See how we tailor AI receptionists and
              chatbots to the way your business actually runs.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-xl font-semibold mb-5 text-muted-foreground uppercase tracking-wider text-sm">
                  {category}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {niches
                    .filter((n) => n.category === category)
                    .map((n) => (
                      <Link
                        key={n.slug}
                        href={`/solutions/${n.slug}`}
                        className="glass-card rounded-xl p-5 flex items-center justify-between border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/10 transition-colors duration-200 group"
                      >
                        <span className="font-medium">{n.name}</span>
                        <ArrowRight className="h-4 w-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
