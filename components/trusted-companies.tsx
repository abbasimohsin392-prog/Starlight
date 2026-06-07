"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "80%", label: "Faster response times" },
  { value: "24/7", label: "Always-on AI systems" },
  { value: "2 weeks", label: "Average setup time" },
  { value: "$799", label: "One-time, no monthly fees" },
]

const logos = ["Real Estate", "Healthcare", "E-commerce", "Law Firms", "Finance", "SaaS"]

export function TrustedCompanies() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <p className="text-muted-foreground text-sm uppercase tracking-wider">
            What you can expect
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-12 md:gap-20 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-6">Serving businesses across</p>
          <div className="flex flex-wrap justify-center gap-3">
            {logos.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="glass-card px-5 py-2 rounded-full border border-white/10 text-sm text-muted-foreground"
              >
                {name}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
