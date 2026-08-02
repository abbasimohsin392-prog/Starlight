"use client"

import { motion } from "framer-motion"
import { Bot, Workflow, Zap, Brain, Database, ArrowRight, PhoneCall, MessageCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"
import { UrgencyBanner } from "@/components/urgency-banner"
import { FloatingCTA } from "@/components/floating-cta"
import { ChatbotDemoSection } from "@/components/chatbot-demo-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"

const WHATSAPP_LINK = "https://wa.me/923007657038"
const CALENDLY_LINK = "https://calendly.com/starlightai306/30min"

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.starlightai.site/" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://www.starlightai.site/services" },
  ],
}

const featuredServices = [
  {
    icon: Bot,
    title: "AI Chatbots & Assistants",
    description: "Custom AI-powered chatbots that handle customer support, lead generation, and internal operations 24/7.",
    details: [
      "Natural language understanding",
      "Multi-language support",
      "Seamless CRM integration",
      "Analytics dashboard",
    ],
  },
  {
    icon: PhoneCall,
    title: "AI Receptionist",
    description: "A 24/7 AI phone agent that answers every call, books appointments, and qualifies leads so you never miss a customer.",
    details: [
      "Answers calls day and night",
      "Automatic appointment booking",
      "Lead qualification & CRM logging",
      "Call transcripts & analytics",
    ],
  },
]

const additionalServices = [
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "End-to-end automation solutions that eliminate manual tasks and streamline your business processes.",
    details: ["Process mapping & optimization", "Custom automation scripts", "API integrations", "Real-time monitoring"],
  },
  {
    icon: Zap,
    title: "AI Integration",
    description: "Seamlessly integrate AI capabilities into your existing systems and tech stack.",
    details: ["Legacy system compatibility", "Cloud & on-premise options", "Custom API development", "Scalable architecture"],
  },
  {
    icon: Brain,
    title: "Custom AI Models",
    description: "Tailored machine learning models trained on your data for specific business use cases.",
    details: ["Data analysis & preparation", "Model training & tuning", "Performance optimization", "Continuous learning"],
  },
  {
    icon: Database,
    title: "Data Analytics & BI",
    description: "Transform raw data into actionable insights with AI-powered analytics dashboards.",
    details: ["Real-time data processing", "Custom visualizations", "Predictive analytics", "Automated reporting"],
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CinematicBackground />
      <UrgencyBanner />
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Our Services</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-balance">
                AI Solutions for Every{" "}
                <span className="gradient-text">Business Need</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                From chatbots to custom AI models, we deliver comprehensive AI solutions that drive real business results.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#live-demo">
                  <Button size="lg" className="btn-glow bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-foreground font-semibold px-8 py-6 text-lg">
                    Try the Live Demo
                    <Bot className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white/20 hover:bg-white/5">
                    Chat on WhatsApp
                    <MessageCircle className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Most Requested</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 text-balance">What We Build Most Often</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-8 relative border border-cyan-500/20"
                >
                  <div className="absolute -top-3 left-8 flex items-center gap-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-xs font-semibold px-3 py-1 rounded-full text-white">
                    <Star className="h-3 w-3 fill-white" /> Most Popular
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                      <p className="text-muted-foreground mb-4">{service.description}</p>
                      <ul className="space-y-2">
                      {service.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                </div>
              </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Demo */}
        <div id="live-demo">
          <ChatbotDemoSection />
        </div>

        {/* Proof */}
        <TestimonialsSection />

        {/* Additional Services */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Also Available</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 text-balance">Full-Stack AI, When You Need It</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <ul className="space-y-1.5">
                    {service.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-cyan-400" />
                      {detail}
                      </li>
                  ))}
                </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <PricingSection />

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Book a free strategy call, or message us on WhatsApp if that's faster for you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="btn-glow btn-pulse bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-foreground font-semibold px-8 py-6 text-lg">
                      Book a Strategy Call
                    <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white/20 hover:bg-white/5">
                      Chat on WhatsApp
                      <MessageCircle className="ml-2 h-5 w-5" />
                  </Button>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
      <FloatingCTA />
    </main>
  )
}
