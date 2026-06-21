"use client"
import { motion } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CinematicBackground } from "@/components/cinematic-background"
const plans = [
  {
    name: "Growth",
    price: "$297",
    period: "monthly",
    description: "Perfect for small businesses getting started with AI",
    features: [
      "1 Custom AI Chatbot",
      "Basic workflow automation",
      "Email support",
      "Monthly reporting",
      "Up to 10k interactions/mo",
    ],
    popular: false,
    link: "https://www.creem.io/payment/prod_2Y9ewaoyMMSAuUyLDgMiNR",
  },
  {
    name: "Professional",
    price: "$2,599",
    period: " one-time",
    description: "For growing companies ready to scale with AI",
    features: [
      "3 Custom AI Solutions",
      "Advanced automation workflows",
      "Priority support (24/7)",
      "Real-time analytics dashboard",
      "Up to 100k interactions/mo",
      "Custom integrations",
      "Dedicated account manager",
    ],
    popular: true,
    link: "https://www.creem.io/payment/prod_6cZACXePnr7hqlbziXYm4l",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large-scale operations",
    features: [
      "Unlimited AI Solutions",
      "Enterprise-grade security",
      "24/7 phone & Slack support",
      "Custom ML model development",
      "Unlimited interactions",
      "On-premise deployment option",
      "SLA guarantee",
      "Executive business reviews",
    ],
    popular: false,
    link: "https://calendly.com/starlightai306/30min",
  },
]
const faqs = [
  {
    question: "What is included in the one-time payment?",
    answer: "Your one-time payment includes full setup, implementation, and deployment of your AI solution. You own the solution outright with no recurring fees for the core functionality.",
  },
  {
    question: "Are there any ongoing costs?",
    answer: "The one-time payment covers the full solution. Optional services like premium support, additional training, or major upgrades may have separate costs.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes, you can upgrade to a higher tier at any time. You will only pay the difference between your current plan and the new plan.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day satisfaction guarantee. If you are not happy with your solution, we will work with you to make it right or provide a full refund.",
  },
]
export default function PricingPage() {
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
            <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Pricing</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-balance">
              Simple, Transparent{" "}
              <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              One-time payment, lifetime value. Choose the plan that fits your business needs.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Pricing Cards */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "glass-card border-purple-500/50 glow-purple"
                    : "glass-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-cyan-500 text-foreground text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a href={plan.link} target="_blank" rel="noopener noreferrer">
                    <Button
                      className="w-full btn-glow bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-foreground"
                    >
                      {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                    </Button>
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ Section */}
        <section className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Have questions about our pricing? We have answers.
            </p>
          </motion.div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
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
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Book a free strategy call to discuss your needs and find the perfect plan.
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
