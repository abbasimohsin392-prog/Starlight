"use client"
import { motion } from "framer-motion"
import { Bot, Workflow, Zap, Brain, Database, PhoneCall } from "lucide-react"
const services = [
  {
    icon: Bot,
    title: "AI Chatbots & Assistants",
    description: "Custom AI-powered chatbots that handle customer support, lead generation, and internal operations 24/7.",
  },
  {
    icon: PhoneCall,
    title: "AI Receptionist",
    description: "A 24/7 AI phone agent that answers calls, books appointments, and qualifies leads so you never miss a customer.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "End-to-end automation solutions that eliminate manual tasks and streamline your business processes.",
  },
  {
    icon: Zap,
    title: "AI Integration",
    description: "Seamlessly integrate AI capabilities into your existing systems and tech stack.",
  },
  {
    icon: Brain,
    title: "Custom AI Models",
    description: "Tailored machine learning models trained on your data for specific business use cases.",
  },
  {
    icon: Database,
    title: "Data Analytics & BI",
    description: "Transform raw data into actionable insights with AI-powered analytics dashboards.",
  },
]
export function ServicesSection() {
  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Our Services</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-balance">
            AI Solutions for Every{" "}
            <span className="gradient-text">Business Need</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From chatbots to custom AI models, we deliver comprehensive AI solutions that drive real business results.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card rounded-2xl p-8 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                <service.icon className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
