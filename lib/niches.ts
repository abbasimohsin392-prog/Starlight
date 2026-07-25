export type Niche = {
  slug: string
  name: string
  category: string
  metaTitle: string
  metaDescription: string
  heroLine: string
  painPoint: string
  scenario: string
  useCases: string[]
}

export const niches: Niche[] = [
  {
    slug: "dental-clinics",
    name: "Dental Clinics",
    category: "Healthcare",
    metaTitle: "AI Receptionist & Chatbot for Dental Clinics",
    metaDescription:
      "AI receptionist and chatbot for dental clinics that answers calls, books appointments, and follows up on missed patients 24/7.",
    heroLine: "AI Receptionist for Dental Clinics",
    painPoint:
      "Front desk staff are already juggling check-ins and insurance calls, so new patient inquiries that come in during appointments or after hours often go straight to voicemail.",
    scenario:
      "A prospective patient calls to ask about availability for a cleaning, gets voicemail, and books with the practice down the street instead.",
    useCases: [
      "Answer calls during appointments and after hours",
      "Book and reschedule cleanings and consultations",
      "Send automated appointment reminders to cut no-shows",
      "Answer common questions about insurance, pricing, and services",
      "Follow up with patients who called but didn't book",
    ],
  },
  {
    slug: "real-estate-agencies",
    name: "Real Estate Agencies",
    category: "Real Estate",
    metaTitle: "AI Chatbot & Lead Qualification for Real Estate Agents",
    metaDescription:
      "AI chatbot and receptionist for real estate agencies that qualifies leads, books showings, and answers listing questions around the clock.",
    heroLine: "AI Chatbot for Real Estate Agencies",
    painPoint:
      "Buyer inquiries come in at all hours, especially evenings and weekends, and the agent who responds first is usually the one who gets the client.",
    scenario:
      "A buyer messages about a listing at 9pm on a Saturday. If nobody replies within a few hours, they've usually already reached out to three other agents.",
    useCases: [
      "Instantly answer listing questions (price, size, availability)",
      "Qualify buyer and seller leads before they reach an agent",
      "Book property showings automatically",
      "Follow up with leads who went quiet",
      "Route hot leads to the right agent immediately",
    ],
  },
  {
    slug: "law-firms",
    name: "Law Firms",
    category: "Legal",
    metaTitle: "AI Intake Assistant & Chatbot for Law Firms",
    metaDescription:
      "AI intake assistant for law firms that answers calls, screens potential clients, and books consultations 24/7, especially for personal injury and family law.",
    heroLine: "AI Intake Assistant for Law Firms",
    painPoint:
      "Potential clients, especially in personal injury cases, often call right after an accident. If nobody picks up, they call the next firm on Google within minutes.",
    scenario:
      "Someone calls a personal injury firm at 11pm the night of an accident. If it goes to voicemail, that case just went to a competitor.",
    useCases: [
      "Answer calls 24/7 and capture case details immediately",
      "Screen and qualify leads before an attorney's time is spent",
      "Book free consultations automatically",
      "Answer common questions about process and fees",
      "Follow up with leads who haven't scheduled yet",
    ],
  },
  {
    slug: "med-spas",
    name: "Med Spas",
    category: "Beauty & Wellness",
    metaTitle: "AI Booking Assistant & Chatbot for Med Spas",
    metaDescription:
      "AI receptionist and booking assistant for med spas that answers treatment questions, books appointments, and follows up on missed calls.",
    heroLine: "AI Booking Assistant for Med Spas",
    painPoint:
      "Front desk staff are often mid-treatment with a client when the phone rings, so inquiries about Botox, fillers, or laser treatments go unanswered.",
    scenario:
      "A client calls to ask about pricing for a treatment while staff are with another client. No answer means they book somewhere that did pick up.",
    useCases: [
      "Answer treatment and pricing questions instantly",
      "Book consultations and appointments 24/7",
      "Send pre- and post-treatment reminders",
      "Capture leads from social media inquiries",
      "Follow up automatically on missed calls",
    ],
  },
  {
    slug: "gyms-fitness-studios",
    name: "Gyms & Fitness Studios",
    category: "Fitness",
    metaTitle: "AI Chatbot & Lead Assistant for Gyms and Fitness Studios",
    metaDescription:
      "AI chatbot for gyms and fitness studios that answers membership questions, books trial classes, and follows up with leads automatically.",
    heroLine: "AI Chatbot for Gyms & Fitness Studios",
    painPoint:
      "Membership inquiries and trial class sign-ups often come in outside staffed hours, when the front desk is focused on members already in the building.",
    scenario:
      "Someone messages about a free trial class at 7am before work. By the time staff reply hours later, they've already signed up somewhere else.",
    useCases: [
      "Answer membership and class schedule questions 24/7",
      "Book trial classes and tours automatically",
      "Follow up with leads who haven't converted",
      "Handle membership pause and cancellation requests",
      "Send class reminders to reduce no-shows",
    ],
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    category: "Hospitality",
    metaTitle: "AI Reservation Assistant & Chatbot for Restaurants",
    metaDescription:
      "AI phone assistant and chatbot for restaurants that takes reservations, answers menu and hours questions, and handles calls during rush hours.",
    heroLine: "AI Reservation Assistant for Restaurants",
    painPoint:
      "During a dinner rush, staff can't step away to answer the phone, so reservation calls and simple questions about hours or menu items go unanswered.",
    scenario:
      "A customer calls to book a table for six on a Friday night. Nobody picks up during the rush, so they book at a competitor instead.",
    useCases: [
      "Take reservations by phone or chat, even during rush hours",
      "Answer hours, menu, and parking questions instantly",
      "Handle large party and private event inquiries",
      "Send reservation confirmations and reminders",
      "Free up staff from constant phone interruptions",
    ],
  },
  {
    slug: "hair-nail-salons",
    name: "Hair & Nail Salons",
    category: "Beauty & Wellness",
    metaTitle: "AI Booking Assistant & Chatbot for Hair and Nail Salons",
    metaDescription:
      "AI receptionist and chatbot for hair and nail salons that books appointments, answers service questions, and follows up on missed calls automatically.",
    heroLine: "AI Booking Assistant for Hair & Nail Salons",
    painPoint:
      "Stylists and technicians can't answer the phone mid-service, so booking calls go to voicemail and clients move on to the next salon.",
    scenario:
      "A client calls to book a color appointment while their stylist is mid-appointment with someone else. No answer, no booking.",
    useCases: [
      "Book appointments by phone or chat around the clock",
      "Answer service, pricing, and availability questions",
      "Send appointment reminders to cut no-shows",
      "Handle rescheduling without staff involvement",
      "Follow up with clients who called but didn't book",
    ],
  },
  {
    slug: "veterinary-clinics",
    name: "Veterinary Clinics",
    category: "Healthcare",
    metaTitle: "AI Receptionist & Chatbot for Veterinary Clinics",
    metaDescription:
      "AI receptionist for veterinary clinics that answers calls, books appointments, and handles urgent pet care questions 24/7.",
    heroLine: "AI Receptionist for Veterinary Clinics",
    painPoint:
      "Pet owners often call in a panic outside business hours, and a missed call can mean losing a client who needed help right away.",
    scenario:
      "A pet owner calls at 10pm worried about their dog. No answer means they either go to an emergency vet elsewhere or find a new regular clinic.",
    useCases: [
      "Answer calls 24/7 and triage urgency",
      "Book routine and follow-up appointments",
      "Answer common questions about services and pricing",
      "Send vaccination and appointment reminders",
      "Route true emergencies appropriately while handling routine questions automatically",
    ],
  },
  {
    slug: "property-management",
    name: "Property Management",
    category: "Real Estate",
    metaTitle: "AI Tenant Assistant & Chatbot for Property Management Companies",
    metaDescription:
      "AI assistant for property management companies that handles tenant inquiries, maintenance requests, and prospective tenant questions around the clock.",
    heroLine: "AI Tenant Assistant for Property Management",
    painPoint:
      "Between tenant maintenance requests, prospective tenant calls, and existing resident questions, property managers can't answer every call as it comes in.",
    scenario:
      "A prospective tenant calls about a vacant unit's availability. No answer, and they move to the next listing on their list.",
    useCases: [
      "Answer prospective tenant questions about units and pricing",
      "Log and route maintenance requests automatically",
      "Answer common tenant questions (rent, policies, amenities)",
      "Schedule unit tours",
      "Follow up with prospective tenants who haven't applied",
    ],
  },
  {
    slug: "auto-repair-shops",
    name: "Auto Repair Shops",
    category: "Automotive",
    metaTitle: "AI Receptionist & Chatbot for Auto Repair Shops",
    metaDescription:
      "AI receptionist for auto repair shops that answers calls, books appointments, and handles after-hours inquiries so no job walks to a competitor.",
    heroLine: "AI Receptionist for Auto Repair Shops",
    painPoint:
      "Mechanics can't stop mid-job to answer the phone, so calls about repairs, pricing, and availability go unanswered during work hours and after close.",
    scenario:
      "A customer calls about a check-engine light while the shop's hands are literally under another car. No answer, they call the next shop on Google.",
    useCases: [
      "Answer calls while staff are working on vehicles",
      "Book appointments and estimate requests 24/7",
      "Answer common questions about services and pricing",
      "Follow up with missed calls automatically",
      "Send appointment and pickup reminders",
    ],
  },
]
