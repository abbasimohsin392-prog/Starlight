"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
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
    link: "https://calendly.com/starlightai306/30min",
  },
  {
    name: "Professional",
    price: "$997",
    period: "/mo",
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
    link: "https://calendly.com/starlightai306/30min",
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
export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-balance">
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that fits your business needs. All plans include our core AI technology stack.
          </p>
        </motion.div>
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
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
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
        {/* Payment Methods Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 glass-card rounded-2xl p-8 max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Payment</span>
            <h3 className="text-2xl font-bold mt-2 mb-2">How Payment Works</h3>
            <p className="text-muted-foreground text-sm">
              We accept international bank transfers. Simple, secure, and hassle-free.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-400 font-bold text-sm">1</span>
              </div>
              <p className="text-sm font-medium mb-1">Book a Call</p>
              <p className="text-xs text-muted-foreground">We discuss your needs and agree on a plan</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold text-sm">2</span>
              </div>
              <p className="text-sm font-medium mb-1">Receive Invoice</p>
              <p className="text-xs text-muted-foreground">We send you a USD invoice via email</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-400 font-bold text-sm">3</span>
              </div>
              <p className="text-sm font-medium mb-1">Wire Transfer</p>
              <p className="text-xs text-muted-foreground">Pay via international bank transfer in USD</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-4">
              We accept USD international wire transfers. Payment details are shared after your strategy call.
            </p>
            <a
              href="https://calendly.com/starlightai306/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              Book a free strategy call to get started →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
