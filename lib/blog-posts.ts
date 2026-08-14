export type BlogContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }

export type BlogPost = {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  date: string
  category: string
  excerpt: string
  relatedNicheSlug: string
  content: BlogContentBlock[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-receptionist-for-dental-clinics-complete-guide",
    title: "AI Receptionist for Dental Clinics: Complete Guide",
    metaTitle: "AI Receptionist for Dental Clinics: Complete Guide (2026)",
    metaDescription:
      "How an AI receptionist works for dental clinics, what it costs, and how much revenue a missed call is actually costing your practice.",
    date: "2026-08-02",
    category: "Healthcare",
    excerpt:
      "A practical look at how AI receptionists answer calls, book appointments, and cut missed-patient losses for dental practices.",
    relatedNicheSlug: "dental-clinics",
    content: [
      {
        type: "p",
        text: "Front desk staff at most dental practices are stretched thin. They're checking patients in, verifying insurance, and managing same-day cancellations, all while the phone keeps ringing. When a new patient calls to ask about availability during that window, the call often goes to voicemail, and the patient books with the practice down the street instead. An AI receptionist exists to close that gap without adding headcount.",
      },
      { type: "h2", text: "What an AI receptionist actually does" },
      {
        type: "p",
        text: "Unlike a basic voicemail system, an AI receptionist has a real conversation. It answers the call, understands what the patient needs, and takes action instead of just recording a message.",
      },
      {
        type: "ul",
        items: [
          "Answers calls during appointments, lunch breaks, and after hours",
          "Books and reschedules cleanings and consultations directly into your calendar",
          "Sends automated reminders to reduce no-shows",
          "Answers common questions about insurance, pricing, and services",
          "Follows up automatically with patients who called but didn't book",
        ],
      },
      { type: "h2", text: "The real cost of a missed call" },
      {
        type: "p",
        text: "A single new patient is worth far more than one appointment. Between cleanings, exams, and any follow-up treatment, a new patient relationship commonly runs into the thousands of dollars over a few years. When that first call goes unanswered, the clinic isn't just losing one booking, it's losing the entire relationship, usually to a competitor who happened to pick up.",
      },
      { type: "h2", text: "How long it takes to set up" },
      {
        type: "p",
        text: "Most dental practices can have an AI receptionist live within one to two weeks. It connects to your existing phone number and scheduling system, so patients don't notice any change in how they reach you, they just stop getting voicemail.",
      },
      { type: "h2", text: "Is it right for your practice" },
      {
        type: "p",
        text: "If your front desk is already busy during peak hours, or if you know calls are going unanswered after 5pm, an AI receptionist pays for itself with a single recovered patient. It's not meant to replace your front desk team, it's meant to make sure no call ever goes to voicemail again.",
      },
    ],
  },
  {
    slug: "ai-chatbot-for-real-estate-agents-how-it-works",
    title: "AI Chatbot for Real Estate Agents: How It Works",
    metaTitle: "AI Chatbot for Real Estate Agents: How It Works (2026)",
    metaDescription:
      "How AI chatbots qualify buyer leads, answer listing questions, and book showings for real estate agents around the clock.",
    date: "2026-08-02",
    category: "Real Estate",
    excerpt:
      "Buyer inquiries come in at all hours. Here's how an AI chatbot captures and qualifies them before your competitor does.",
    relatedNicheSlug: "real-estate-agencies",
    content: [
      {
        type: "p",
        text: "Real estate is a speed business. A buyer messages about a listing on a Saturday evening, and the agent who replies first is usually the one who gets the client. If nobody responds within a couple of hours, that buyer has typically already reached out to two or three other agents.",
      },
      { type: "h2", text: "What the chatbot handles" },
      {
        type: "ul",
        items: [
          "Instantly answers listing questions like price, square footage, and availability",
          "Qualifies buyer and seller leads before they reach an agent's calendar",
          "Books property showings automatically",
          "Follows up with leads who went quiet after their first message",
          "Routes hot leads to the right agent immediately, day or night",
        ],
      },
      { type: "h2", text: "Why response speed matters this much" },
      {
        type: "p",
        text: "Studies on lead response time consistently show the odds of qualifying a lead drop sharply after the first few minutes, and drop further after the first hour. A chatbot doesn't get tired, doesn't sleep, and doesn't miss a Saturday night inquiry because it's off the clock.",
      },
      { type: "h2", text: "Where it fits into your existing workflow" },
      {
        type: "p",
        text: "The chatbot isn't meant to replace the agent-client relationship, it's meant to protect it. It handles the first response and the qualifying questions, then hands a warm, qualified lead to you instead of a cold one that's already talked to two other agents.",
      },
      { type: "h2", text: "Getting started" },
      {
        type: "p",
        text: "Most agencies can have a chatbot live on their website and connected to WhatsApp or Instagram within a couple of weeks, with no technical setup required on the agent's end.",
      },
    ],
  },
  {
    slug: "ai-intake-assistant-for-law-firms-personal-injury",
    title: "AI Intake Assistant for Law Firms: A Personal Injury Guide",
    metaTitle: "AI Intake Assistant for Law Firms: Personal Injury Guide (2026)",
    metaDescription:
      "How an AI intake assistant answers calls, screens potential clients, and books consultations for personal injury and family law firms 24/7.",
    date: "2026-08-13",
    category: "Legal",
    excerpt:
      "A missed call after an accident is a missed case. Here's how an AI intake assistant captures and screens leads the moment they call.",
    relatedNicheSlug: "law-firms",
    content: [
      {
        type: "p",
        text: "Personal injury cases usually start with a phone call made right after the worst moment of someone's week, an accident, an injury, a sudden legal problem. If that call goes to voicemail, the caller doesn't wait around. They search Google again and call the next firm on the list, often within minutes. An AI intake assistant exists to make sure that call never goes unanswered, at any hour.",
      },
      { type: "h2", text: "What an AI intake assistant actually does" },
      {
        type: "ul",
        items: [
          "Answers calls 24/7 and captures the key case details immediately",
          "Screens and qualifies leads before an attorney's time is spent",
          "Books free consultations directly into the firm's calendar",
          "Answers common questions about process, timelines, and fees",
          "Follows up automatically with leads who haven't scheduled yet",
        ],
      },
      { type: "h2", text: "Why intake speed decides who gets the case" },
      {
        type: "p",
        text: "Unlike most purchases, a potential client calling about an accident is usually calling several firms in the same hour. The firm that picks up, listens, and books the consultation first is usually the one that signs the case, regardless of which firm has the better track record.",
      },
      { type: "h2", text: "Screening before the attorney gets involved" },
      {
        type: "p",
        text: "Not every caller has a case the firm can take. An AI intake assistant asks the right qualifying questions upfront, so attorneys spend their time on consultations that are actually worth booking, instead of manually screening every incoming call.",
      },
      { type: "h2", text: "Getting started" },
      {
        type: "p",
        text: "Most firms can have an AI intake assistant live on their existing phone number within one to two weeks. Callers notice no change in how they reach the firm, they just stop reaching voicemail after hours.",
      },
    ],
  },
  {
    slug: "ai-receptionist-for-auto-repair-shops-guide",
    title: "AI Receptionist for Auto Repair Shops: A Practical Guide",
    metaTitle: "AI Receptionist for Auto Repair Shops: Practical Guide (2026)",
    metaDescription:
      "How an AI receptionist answers calls, books appointments, and captures after-hours inquiries for auto repair shops so no job walks to a competitor.",
    date: "2026-08-13",
    category: "Automotive",
    excerpt:
      "Mechanics can't stop mid-job to answer the phone. Here's how an AI receptionist keeps every inquiry from becoming a lost job.",
    relatedNicheSlug: "auto-repair-shops",
    content: [
      {
        type: "p",
        text: "Most auto repair shops lose jobs quietly. A customer calls about a check-engine light or an estimate while the shop's hands are literally under another vehicle, gets no answer, and calls the next shop on Google instead. There's no missed-call notification for a job that never got booked in the first place.",
      },
      { type: "h2", text: "What an AI receptionist handles" },
      {
        type: "ul",
        items: [
          "Answers calls while staff are working on vehicles",
          "Books appointments and estimate requests around the clock",
          "Answers common questions about services, turnaround, and pricing",
          "Follows up automatically with missed calls instead of losing them",
          "Sends appointment and vehicle pickup reminders",
        ],
      },
      { type: "h2", text: "Why after-hours calls matter more than they seem" },
      {
        type: "p",
        text: "A car problem doesn't wait for business hours. Customers calling in the evening or on weekends about a strange noise or a warning light are often ready to book immediately, they just need someone to pick up. Shops that only answer during the day are handing those bookings to whichever competitor answers first.",
      },
      { type: "h2", text: "What it costs the shop to skip this" },
      {
        type: "p",
        text: "A single missed estimate call is rarely just one job. A customer who books elsewhere for a repair often becomes that shop's regular customer for years of future maintenance. The cost of a missed call compounds well past the first visit.",
      },
      { type: "h2", text: "Getting started" },
      {
        type: "p",
        text: "Most shops can have an AI receptionist live on their existing shop number within one to two weeks, answering calls and booking estimates the same day it goes live.",
      },
    ],
  },
]
