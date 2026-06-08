"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How long does it take to get my AI system up and running?",
    answer: "Most of our clients are live within 2 weeks. A basic AI chatbot can be deployed in as little as 5-7 days. More complex workflow automations or custom websites typically take 2-4 weeks depending on your requirements.",
  },
  {
    question: "Do I need any technical knowledge to use the system?",
    answer: "Zero technical knowledge required. We handle everything from setup to deployment. Once it's live, your AI system runs on autopilot. We also provide a simple dashboard so you can monitor performance anytime.",
  },
  {
    question: "What exactly is included in the $799 one-time package?",
    answer: "The $799 Starter package includes a fully custom AI chatbot built for your business, integrated directly into your website or platform. It handles customer queries, lead capture, and appointment booking 24/7. No hidden fees, no monthly subscriptions.",
  },
  {
    question: "What if I want ongoing support or updates?",
    answer: "Our $99/month Professional plan includes continuous updates, priority support, performance monitoring, and regular optimizations to keep your AI system improving over time.",
  },
  {
    question: "Can the AI integrate with my existing tools and software?",
    answer: "Yes! We integrate with WhatsApp, Instagram, websites, CRMs, booking systems, email platforms and more. If you use a specific tool, just let us know and we'll make it work seamlessly.",
  },
  {
    question: "Is my business data safe and secure?",
    answer: "Absolutely. All data is encrypted end-to-end and we never share your data with third parties. Your business information stays completely private and under your control at all times.",
  },
  {
    question: "What kind of businesses do you work with?",
    answer: "We work with businesses across all industries — salons, dental clinics, real estate agencies, law firms, e-commerce stores, restaurants, SaaS companies and more. If you have customers, we can automate and improve how you serve them.",
  },
  {
    question: "What if I'm not satisfied with the result?",
    answer: "We offer unlimited revisions until you're 100% happy with the system. Our goal is to deliver real results for your business, not just a finished product. Your satisfaction is our priority.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-balance">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know before getting started with Starlight AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-xl px-6 border-0"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6 text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
