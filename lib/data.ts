export const site = {
  name: 'Starlight AI',
  url: 'https://starlightai.site',
  email: 'hello@starlightai.site',
  bookingUrl: 'https://calendly.com/starlightai306/30min',
  whatsapp: '+923007657038',
  whatsappUrl: 'https://wa.me/923007657038',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/starlight_.ai' },
    { label: 'X', href: 'https://x.com/MAoun_onrise' },
  ],
}

export const navLinks = [
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'systems', label: 'Systems' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export const services = [
  {
    index: '01',
    title: 'AI Receptionist',
    tagline: 'Give every caller a clear next step.',
    description:
      'A voice agent can answer configured inbound calls, collect caller details, handle approved FAQs, and route booking requests or urgent issues to your team.',
    bullets: ['Inbound call handling', 'Calendar booking', 'Call summaries to CRM'],
  },
  {
    index: '02',
    title: 'AI Chatbots',
    tagline: 'Website conversations that help qualify leads.',
    description:
      'A chatbot can use approved information about your business to answer FAQs, capture enquiries, and route complex questions to a person using agreed handoff rules.',
    bullets: ['Trained on your data', 'Lead capture', 'Human handoff'],
  },
  {
    index: '03',
    title: 'AI Customer Support',
    tagline: 'Handle routine questions with a clear handoff.',
    description:
      'A support assistant can answer approved FAQs, guide customers through defined steps, and pass complex issues to a human with the context collected so far.',
    bullets: ['Email, chat & help desk', 'Order & account lookups', 'Smart escalation'],
  },
  {
    index: '04',
    title: 'WhatsApp AI Agents',
    tagline: 'Respond on the channel customers already use.',
    description:
      'An assistant on WhatsApp Business can handle approved FAQs, collect enquiry details, and trigger agreed follow-ups, subject to your setup and messaging permissions.',
    bullets: ['WhatsApp Business API', 'Follow-up sequences', 'Booking confirmations'],
  },
  {
    index: '05',
    title: 'Lead Automation',
    tagline: 'From form fill to a faster follow-up.',
    description:
      'Connect new enquiries to agreed routing, notifications, and follow-up workflows so your team can respond consistently.',
    bullets: ['Fast enquiry routing', 'Scoring & routing', 'Multi-channel nurture'],
  },
  {
    index: '06',
    title: 'Custom AI Automation',
    tagline: 'Connect the repetitive steps in your operations.',
    description:
      'Workflows connecting your CRM, inbox, calendar, and other agreed tools, scoped around how your business actually runs.',
    bullets: ['CRM & tool integrations', 'Internal ops workflows', 'Reporting & alerts'],
  },
]

export const process = [
  {
    step: '01',
    title: 'Discover',
    description:
      'We map your customer journey and identify one practical workflow worth improving first.',
    duration: 'Discovery',
  },
  {
    step: '02',
    title: 'Design',
    description:
      'We agree on conversation flows, approved answers, guardrails, integrations, and success measures before the build.',
    duration: 'Scope agreed',
  },
  {
    step: '03',
    title: 'Build',
    description:
      'We build and test the agreed system against typical and edge-case scenarios, then refine it with your feedback.',
    duration: 'Build + test',
  },
  {
    step: '04',
    title: 'Launch',
    description:
      'Launch with documentation, agreed monitoring, and a clear path for human escalation. Ongoing support is defined in your proposal.',
    duration: 'Launch + review',
  },
]

export const systems = [
  {
    title: 'Clinic Reception Suite',
    category: 'Healthcare',
    result: 'Calls → team',
    description: 'Illustrative workflow: a voice receptionist and WhatsApp reminders, subject to clinic systems, permissions, and approved content.',
    image: '/images/system-clinic.webp',
  },
  {
    title: 'Property Lead Engine',
    category: 'Real Estate',
    result: 'Lead → agent',
    description: 'Illustrative workflow: qualify a property enquiry and pass a viewing request to an agent; no live listings or bookings are connected in this example.',
    image: '/images/system-realestate.webp',
  },
  {
    title: 'E-commerce Support Agent',
    category: 'E-commerce',
    result: 'FAQ → handoff',
    description: 'Illustrative workflow: answer approved order and product questions, then route complex support requests to a person.',
    image: '/images/system-ecommerce.webp',
  },
  {
    title: 'Service Booking Flow',
    category: 'Home Services',
    result: 'Enquiry → request',
    description: 'Illustrative workflow: collect service details and send a booking request for a team member to confirm.',
    image: '/images/system-services.webp',
  },
]

export const stats = [
  { value: '24/7', label: 'After-hours handling can be configured for supported channels' },
  { value: 'Human', label: 'Clear handoff paths when an enquiry needs your team' },
  { value: 'Connected', label: 'Connect the tools included in your agreed workflow' },
  { value: 'Measured', label: 'Track response time, enquiries, and bookings you agree to measure' },
]

export const marqueeItems = [
  'Website chat',
  'Voice workflows',
  'Lead routing',
  'CRM connections',
  'WhatsApp Business',
  'Email follow-up',
  'Appointment requests',
  'Human handoff',
  'Workflow monitoring',
  'Custom integrations',
]

