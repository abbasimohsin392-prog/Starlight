"use client"

import { motion } from "framer-motion"
import { Bot, Workflow, Zap, Brain, Database, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"

const services = [
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
    icon: Workflow,
    title: "Workflow Automation",
    description: "End-to-end automation solutions that eliminate manual tasks and streamline your business processes.",
    details: [
      "Process mapping & optimization",
      "Custom automation scripts",
      "API integrations",
      "Real-time monitoring",
    ],
  },
  {
    icon: Zap,
    title: "AI Integration",
    description: "Seamlessly integrate AI capabilities into your existing systems and tech stack.",
    details: [
      "Legacy system compatibility",
      "Cloud & on-premise options",
      "Custom API development",
      "Scalable architecture",
    ],
  },
  {
    icon: Brain,
    title: "Custom AI Models",
    description: "Tailored machine learning models trained on your data for specific business use cases.",
    details: [
      "Data analysis & preparation",
      "Model training & tuning",
      "Performance optimization",
      "Continuous learning",
    ],
  },
  {
    icon: Database,
    title: "Data Analytics & BI",
    description: "Transform raw data into actionable insights with AI-powered analytics dashboards.",
    details: [
      "Real-time data processing",
      "Custom visualizations",
      "Predictive analytics",
      "Automated reporting",
    ],
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background relative">
      <CinematicBackground />
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
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From chatbots to custom AI models, we deliver comprehensive AI solutions that drive real business results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-8"
              >
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

      {/* CTA Section */}
        <section className="py-24 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Book a free strategy call to discuss how AI can help you achieve your goals.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a href="https://calendly.com/starlightai306/30min" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="btn-glow btn-pulse bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-foreground font-semibold px-8 py-6 text-lg"
                  >
                    Book a Strategy Call
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
