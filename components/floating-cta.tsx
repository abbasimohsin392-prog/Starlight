"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { MessageCircle, X, Phone, Mail, Bot, CalendarCheck } from "lucide-react"

const CALENDLY_LINK = "https://calendly.com/starlightai306/30min"
const WHATSAPP_LINK = "https://wa.me/923007657038"
const EMAIL_LINK = "https://mail.google.com/mail/?view=cm&fs=1&to=hello@starlightai.site&su=Business%20Enquiry"
const DEMO_LINK = "/demo"

const actions = [
  { icon: CalendarCheck, label: "Talk to a Strategist", href: CALENDLY_LINK, external: true },
  { icon: Phone, label: "WhatsApp", href: WHATSAPP_LINK, external: true },
  { icon: Mail, label: "Email Us", href: EMAIL_LINK, external: true },
  { icon: Bot, label: "See Live Demo", href: DEMO_LINK, external: false },
]

export function FloatingCTA() {
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-end gap-2"
              >
                {actions.map((action, i) => (
                  <motion.a
                    key={action.label}
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="glass-card flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-foreground border border-white/10 shadow-lg hover:border-purple-500/40 hover:bg-purple-500/10"
                  >
                    <action.icon className="h-4 w-4 text-cyan-400" />
                    {action.label}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setOpen((v) => !v)}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            aria-label={open ? "Close contact options" : "Open contact options"}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow duration-300"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <MessageCircle className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-sm">{open ? "Close" : "Get in Touch"}</span>
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  )
}
