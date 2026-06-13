"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Users, Target, Lightbulb, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description: "We focus on delivering measurable outcomes that directly impact your bottom line.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We stay at the cutting edge of AI technology to bring you the most advanced solutions.",
  },
  {
    icon: Users,
    title: "Client Partnership",
    description: "We work as an extension of your team, understanding your unique challenges and goals.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We are committed to delivering exceptional quality in everything we do.",
  },
]

export default function AboutPage() {
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
            <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">About Us</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-balance">
              Building the Future with{" "}
              <span className="gradient-text">AI Innovation</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We help businesses harness the power of artificial intelligence to achieve real, measurable results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
        <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                At Starlight AI, we believe every business deserves access to powerful AI technology. Our mission is to make AI accessible, affordable, and impactful for businesses of all sizes.
              </p>
              <p className="text-muted-foreground text-lg">
                We combine cutting-edge technology with deep industry expertise to create AI solutions that solve real problems and deliver measurable results. Our approach is collaborative, transparent, and always focused on your success.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <Image
                src="/images/starlight-logo.png"
                alt="Starlight AI"
                width={400}
                height={100}
                className="h-32 w-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These core values guide everything we do and shape how we work with our clients.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
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
                Ready to Work With Us?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Let us discuss how we can help transform your business with AI.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="btn-glow btn-pulse bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-foreground font-semibold px-8 py-6 text-lg"
                >
                  Book a Strategy Call
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
