"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Instagram, Mail } from "lucide-react"

const GMAIL_LINK = "mailto:hello@starlightai.site"
const CALENDLY_LINK = "https://calendly.com/starlightai306/30min"
const INSTAGRAM_LINK = "https://www.instagram.com/starlight_.ai/"

const socialLinks = [
  { icon: Instagram, href: INSTAGRAM_LINK, label: "Instagram" },
  { icon: Mail, href: GMAIL_LINK, label: "Email" },
]

export function Footer() {
  return (
    <footer className="relative pt-24 pb-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/starlight-logo.png"
                alt="Starlight AI"
                width={150}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              We build AI systems that grow your business. Transform your operations with cutting-edge artificial intelligence.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Services</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Pricing</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li><a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Book a Strategy Call</a></li>
              <li><a href={GMAIL_LINK} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Email Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Starlight AI. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Built with AI, for AI-powered businesses.
          </p>
        </div>
      </div>
    </footer>
  )
}
