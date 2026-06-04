"use client"

import { motion } from "framer-motion"
import { Check, Rocket, Clock, LineChart, Users } from "lucide-react"

const features = [
  {
    icon: Rocket,
    title: "10x Faster Deployment",
    description: "Launch AI solutions in weeks, not months.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "AI systems that never sleep, always ready to serve.",
  },
  {
    icon: LineChart,
    title: "Scalable Architecture",
    description: "Built to grow with your business demands.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Expert team available whenever you need help.",
  },
]

const benefits = [
  "Custom AI solutions tailored to your industry",
  "Seamless integration with existing systems",
  "Enterprise-grade security and compliance",
  "Continuous learning and optimization",
  "Real-time analytics and reporting",
  "Dedicated account management",
]

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-balance">
              The Future of Business is{" "}
              <span className="gradient-text">AI-Powered</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We combine cutting-edge AI technology with deep industry expertise to deliver solutions that transform how you do business.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-foreground" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
