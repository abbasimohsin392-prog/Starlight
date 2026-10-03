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
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'process', label: 'Process', href: '/services#process' },
  { id: 'systems', label: 'Systems', href: '/solutions' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'blog', label: 'Blog', href: '/blog' },
  { id: 'contact', label: 'Contact', href: '/contact' },
]
export const services = [
  {
    index: '01',
    title: 'AI Receptionist',
    tagline: 'Never miss a call again.',
    description:
      'A voice agent that picks up every call within seconds, books appointments, qualifies callers, and sends urgent requests straight to your team, day and night.',
    bullets: ['Inbound call handling', 'Calendar booking', 'Call summaries to CRM'],
  },
  {
    index: '02',
    title: 'AI Chatbots',
    tagline: 'Website visitors, turned into leads.',
    description:
      'Trained on your business, tone, and offers. Answers questions instantly, captures contact details, and hands off to a human at exactly the right moment.',
    bullets: ['Trained on your data', 'Lead capture', 'Human handoff'],
  },
  {
    index: '03',
    title: 'AI Customer Support',
    tagline: 'Fewer tickets, faster answers.',
    description:
      'Support agents that handle repetitive questions across email and chat, look up orders and accounts, and escalate everything else with full context attached.',
    bullets: ['Email, chat & help desk', 'Order & account lookups', 'Smart escalation'],
  },
  {
    index: '04',
    title: 'WhatsApp AI Agents',
    tagline: 'Reach customers where they already chat.',
    description:
      'WhatsApp Business agents that follow up on enquiries, confirm bookings, send reminders, and keep conversations moving until a human is needed.',
    bullets: ['WhatsApp Business API', 'Follow-up sequences', 'Booking confirmations'],
  },
  {
    index: '05',
    title: 'Lead Automation',
    tagline: 'From form fill to booked call, automatically.',
    description:
      'Instant replies, lead scoring, and follow-up across email, SMS, and WhatsApp, so no enquiry sits unanswered.',
    bullets: ['Speed-to-lead < 60s', 'Scoring & routing', 'Multi-channel nurture'],
  },
  {
    index: '06',
    title: 'Custom AI Automation',
    tagline: 'If it repeats, we automate it.',
    description:
      'Custom workflows connecting your CRM, inbox, calendar, and tools, built around how your business actually runs.',
    bullets: ['CRM & tool integrations', 'Internal ops workflows', 'Reporting & alerts'],
  },
]

export const process = [
  { step: '01', title: 'Discover', description: 'We map your customer journey, find where time and leads leak out, and pick the highest-ROI automations first.', duration: 'Week 1' },
  { step: '02', title: 'Design', description: 'Conversation flows, agent personas, guardrails, and integrations are designed and approved before a line of code.', duration: 'Week 1–2' },
  { step: '03', title: 'Build', description: 'We build, train, and stress-test your AI system against real scenarios until it performs like your best employee.', duration: 'Week 2–4' },
  { step: '04', title: 'Launch', description: 'Go live with monitoring, weekly optimization, and a team that keeps improving your system as your business grows.', duration: 'Ongoing' },
]

export const pricingPlans = [
  { name: 'Starter', price: '$97', description: 'For solo businesses trying AI for the first time', features: ['1 AI chatbot or receptionist', 'Basic workflow automation', 'Email support', 'Up to 5,000 chat messages per month', 'Up to 100 call minutes per month'] },
  { name: 'Growth', price: '$197', description: 'For small businesses getting started with AI', featured: true, features: ['1 custom AI chatbot', 'Basic workflow automation', 'Email support', 'Monthly reporting', 'Up to 10,000 chat messages per month', 'Up to 300 call minutes per month'] },
  { name: 'Professional', price: '$397', description: 'For growing companies ready to scale', features: ['Multiple AI systems', 'Advanced workflow automation', 'Priority support', 'Custom integrations', 'Expanded usage limits'] },
  { name: 'Enterprise', price: 'Tailored', description: 'For larger or more complex operations', features: ['Multi-system architecture', 'Custom integrations and guardrails', 'Dedicated delivery scope', 'Reporting and optimization plan'] },
]

export const faqs = [
  { question: 'How long does it take to get an AI system up and running?', answer: 'Most focused systems can move from discovery to launch in around four weeks. The exact timeline depends on the workflow, integrations, content, testing, and approval requirements.' },
  { question: 'Do I need technical knowledge to use the system?', answer: 'No. We design the system around your team’s existing workflow and provide the handoff, documentation, and support needed to operate it confidently.' },
  { question: 'What is included in the Growth plan?', answer: 'The Growth plan includes one custom AI chatbot, basic workflow automation, email support, monthly reporting, and the listed monthly usage allowances. Final scope is confirmed before work begins.' },
  { question: 'What if I want ongoing support or updates?', answer: 'Ongoing optimization, support, new workflows, and additional integrations can be scoped around your needs after launch.' },
]

export const systems = [
  { title: 'Clinic Reception Suite', category: 'Healthcare', result: 'Example system', description: 'Voice receptionist + WhatsApp reminders for a multi-location dental clinic.', image: '/images/system-clinic.webp' },
  { title: 'Property Lead Engine', category: 'Real Estate', result: 'Example system', description: 'Instant lead qualification and viewing bookings for a real estate brokerage.', image: '/images/system-realestate.webp' },
  { title: 'E-commerce Support Agent', category: 'E-commerce', result: 'Example system', description: 'Order tracking, returns, and product Q&A across email and live chat.', image: '/images/system-ecommerce.webp' },
  { title: 'Service Booking Flow', category: 'Home Services', result: 'Example system', description: 'Website chatbot that quotes, books, and dispatches jobs for an HVAC company.', image: '/images/system-services.webp' },
]

export const stats = [
  { value: 24, suffix: '/7', label: 'Availability, every day of the year' },
  { value: 6, suffix: '', label: 'Core AI systems, built around your workflow' },
  { value: 60, prefix: '<', suffix: 's', label: 'Target lead response time' },
  { value: 4, suffix: ' wks', label: 'Typical kickoff to live system' },
]

export const marqueeItems = ['OpenAI', 'WhatsApp Business', 'Twilio', 'HubSpot', 'Make', 'n8n', 'Zapier', 'Salesforce', 'Google Calendar', 'Stripe', 'Slack', 'Shopify', 'Notion', 'Gmail']

export const blogPosts = [
  { slug: 'ai-receptionist-for-dental-clinics-complete-guide', title: 'AI Receptionist for Dental Clinics: A Complete Guide', category: 'Healthcare', excerpt: 'How dental teams can respond faster, reduce front-desk pressure, and keep appointment enquiries moving.', readTime: '8 min read', sections: [{ heading: 'Where dental enquiries get lost', body: 'Calls, forms, reminders, and follow-ups often arrive while the front desk is serving patients. A carefully scoped AI receptionist can handle the first response and collect the details the team needs.' }, { heading: 'What the workflow should handle', body: 'The system should answer approved questions, capture patient intent, support booking requests, and escalate anything clinical, urgent, or outside the approved knowledge base.' }, { heading: 'A practical starting point', body: 'Start with one enquiry path, measure response time and booked appointments, then expand only after the team trusts the handoff.' }] },
  { slug: 'ai-chatbot-for-real-estate-agents-how-it-works', title: 'AI Chatbot for Real Estate Agents: How It Works', category: 'Real Estate', excerpt: 'A practical look at qualifying property enquiries and routing serious buyers without adding another admin queue.', readTime: '7 min read', sections: [{ heading: 'The first-response problem', body: 'Property enquiries arrive at all hours and often require the same first questions. A chatbot can collect budget, location, timing, and viewing intent before a human follows up.' }, { heading: 'Useful handoffs', body: 'The goal is not to replace the agent. It is to deliver a clean summary, next action, and contact record when a human needs to step in.' }] },
  { slug: 'ai-intake-assistant-for-law-firms-personal-injury', title: 'AI Intake Assistant for Personal Injury Law Firms', category: 'Legal', excerpt: 'How structured intake can reduce repetitive questions while keeping sensitive cases on a clear human-review path.', readTime: '6 min read', sections: [{ heading: 'Intake needs guardrails', body: 'Legal intake should use approved questions, clear disclaimers, secure handling, and immediate escalation for matters that require a qualified professional.' }, { heading: 'Measure the handoff', body: 'A useful system makes it easier to see which enquiries are complete, urgent, or ready for a consultation.' }] },
  { slug: 'ai-receptionist-for-auto-repair-shops-guide', title: 'AI Receptionist for Auto Repair Shops', category: 'Automotive', excerpt: 'A guide to missed calls, service questions, booking requests, and follow-up for busy repair teams.', readTime: '6 min read', sections: [{ heading: 'Calls arrive when teams are busy', body: 'Technicians cannot always answer the phone. An AI receptionist can capture the vehicle, requested service, timing, and callback details.' }, { heading: 'Keep the workflow simple', body: 'The first version should focus on approved FAQs, booking requests, and human escalation rather than trying to diagnose a vehicle.' }] },
  { slug: 'ai-tenant-assistant-for-property-management', title: 'AI Tenant Assistant for Property Management', category: 'Property Management', excerpt: 'How enquiry capture, routing, and approved answers can reduce repetitive property-management admin.', readTime: '7 min read', sections: [{ heading: 'Tenant questions are repetitive but important', body: 'An assistant can handle approved status questions, route maintenance requests, and collect the information a property team needs for the next step.' }, { heading: 'Design for escalation', body: 'Urgent maintenance, complaints, and sensitive matters should move to a human with the conversation context attached.' }] },
  { slug: 'ai-chatbot-for-gyms-and-fitness-studios', title: 'AI Chatbot for Gyms and Fitness Studios', category: 'Fitness', excerpt: 'Turn class, membership, and trial enquiries into clearer next steps for your team.', readTime: '5 min read', sections: [{ heading: 'Answer the questions people ask first', body: 'Opening hours, class types, trial options, pricing, and location are common starting points. A chatbot can provide approved answers and capture intent.' }, { heading: 'Move from chat to action', body: 'The best flow gives visitors one clear next step such as a trial booking, consultation, or human conversation.' }] },
  { slug: 'ai-receptionist-for-veterinary-clinics', title: 'AI Receptionist for Veterinary Clinics', category: 'Healthcare', excerpt: 'Support busy veterinary teams with structured enquiries, reminders, and clear escalation.', readTime: '6 min read', sections: [{ heading: 'Care teams need focus', body: 'A receptionist can collect basic booking and callback details while keeping clinical questions and urgent cases on a human path.' }, { heading: 'Trust comes first', body: 'The system should be explicit about what it can answer and when it must direct the owner to the clinic.' }] },
  { slug: 'ai-receptionist-for-restaurants', title: 'AI Receptionist for Restaurants', category: 'Hospitality', excerpt: 'Handle booking questions, opening hours, and common guest enquiries across busy service periods.', readTime: '5 min read', sections: [{ heading: 'Protect the guest experience', body: 'A conversational assistant can answer approved questions and capture booking intent when staff are focused on service.' }, { heading: 'Connect the next step', body: 'The workflow should route reservations, group enquiries, and special requests to the right team or booking system.' }] },
  { slug: 'ai-chatbot-for-coaches-and-consultants', title: 'AI Chatbot for Coaches and Consultants', category: 'Professional Services', excerpt: 'Use a focused chatbot to qualify fit, answer common questions, and support consultation bookings.', readTime: '5 min read', sections: [{ heading: 'Qualify without overcomplicating', body: 'A small number of thoughtful questions can help visitors understand fit and give the consultant useful context before the call.' }, { heading: 'Keep the voice human', body: 'The best assistant reflects the consultant’s tone and hands off whenever nuance or trust matters.' }] },
  { slug: 'ai-receptionist-for-architecture-and-engineering-firms-germany', title: 'AI Receptionist for Architecture and Engineering Firms', category: 'Architecture & Engineering', excerpt: 'A practical framework for routing project enquiries and collecting the details a senior team needs.', readTime: '6 min read', sections: [{ heading: 'Project enquiries need structure', body: 'Collecting project type, location, timeline, and contact details helps a specialist team decide what should happen next.' }, { heading: 'Respect regional requirements', body: 'Any workflow should be reviewed for language, privacy, and sector-specific requirements before launch.' }] },
  { slug: 'ai-chatbot-for-schools-and-education-providers', title: 'AI Chatbot for Schools and Education Providers', category: 'Education', excerpt: 'Help prospective students and families find approved answers without losing the human path.', readTime: '6 min read', sections: [{ heading: 'Make information easier to find', body: 'A chatbot can answer approved questions about programmes, admissions, schedules, and next steps across the day.' }, { heading: 'Keep sensitive matters human', body: 'Applications, safeguarding, complaints, and personal circumstances should be routed to the appropriate staff member.' }] },
  { slug: 'ai-receptionist-for-healthcare-practices', title: 'AI Receptionist for Healthcare Practices', category: 'Healthcare', excerpt: 'What healthcare practices should consider before adding AI to patient communications.', readTime: '7 min read', sections: [{ heading: 'Start with a safe workflow', body: 'Healthcare automation should begin with administrative tasks and approved information, not diagnosis or clinical decision-making.' }, { heading: 'Audit every handoff', body: 'A clear record of what was asked, what was answered, and where a human took over is essential for a trustworthy system.' }] },
]
