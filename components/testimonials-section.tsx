"use client"

import { motion } from "framer-motion"

const results = [
  {
    icon: "🦷",
    industry: "Dental Clinics",
    result: "Automated patient enquiries, appointment reminders, and missed call follow-ups, freeing up front desk staff to focus on in-clinic care.",
    metric: "80% faster response time",
  },
  {
    icon: "🏢",
    industry: "Service Businesses",
    result: "End-to-end lead handling from first contact to booked appointment, running 24/7 without any manual input from the team.",
    metric: "3x more leads captured",
  },
  {
    icon: "🛒",
    industry: "E-commerce & Retail",
    result: "AI-powered customer support and order tracking automation that handles hundreds of enquiries simultaneously, around the clock.",
    metric: "Zero missed enquiries",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Results</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-balance">
            Built for Real{" "}
            <span className="gradient-text">Business Problems</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We build AI systems tailored to your industry, not generic tools, but solutions designed around how your business actually works.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {results.map((item, index) => (
            <motion.div
              key={item.industry}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-cyan-400 text-sm font-medium uppercase tracking-wider mb-3">{item.industry}</div>
              <p className="text-foreground mb-6 leading-relaxed">{item.result}</p>
              <div className="text-lg font-semibold gradient-text">{item.metric}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
