"use client"

import { motion } from "framer-motion"

export function BookingSection() {
  return (
    <section id="book" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Next Step</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-4 text-balance">
            Book a <span className="gradient-text">15-minute call</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Straight talk about your call volume, where jobs are slipping, and whether this is a fit.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-card rounded-2xl overflow-hidden p-2"
        >
          <iframe
            src="https://calendly.com/starlightai306/30min?hide_gdpr_banner=1&background_color=0d0d0f&text_color=f5f5f5&primary_color=a855f7"
            width="100%"
            height="640"
            frameBorder="0"
            title="Book a call with Starlight AI"
            className="rounded-xl"
          />
        </motion.div>
      </div>
    </section>
  )
}
