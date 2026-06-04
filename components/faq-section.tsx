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
    question: "How long does it take to implement an AI solution?",
    answer: "Implementation timelines vary based on complexity, but most projects are completed within 4-8 weeks. Simple chatbots can be deployed in as little as 2 weeks, while custom ML models may take 2-3 months.",
  },
  {
    question: "Do I need technical expertise to use your AI solutions?",
    answer: "Not at all! Our solutions are designed with user-friendly interfaces. We also provide comprehensive training and ongoing support to ensure your team can maximize the value of the AI systems.",
  },
  {
    question: "How do you ensure data security and privacy?",
    answer: "Security is our top priority. We use enterprise-grade encryption, comply with GDPR, SOC 2, and HIPAA standards, and can deploy solutions on-premise if required. Your data never leaves your control.",
  },
  {
    question: "Can your AI integrate with our existing systems?",
    answer: "Yes! Our solutions are built with integration in mind. We support all major CRMs, ERPs, communication platforms, and can build custom integrations for proprietary systems via APIs.",
  },
  {
    question: "What kind of ROI can we expect?",
    answer: "Most clients see positive ROI within 3-6 months. On average, our AI solutions reduce operational costs by 40-60% and increase productivity by 3x in automated areas.",
  },
  {
    question: "Do you offer ongoing support and maintenance?",
    answer: "Absolutely. All plans include support and regular updates. Our AI systems continuously learn and improve, and our team is always available to help optimize performance.",
  },
]

export function FAQSection() {
  return (
    <section id="about" className="py-24 relative">
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
            Everything you need to know about our AI solutions.
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
