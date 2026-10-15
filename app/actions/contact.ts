'use server'

import { getCloudflareContext } from '@opennextjs/cloudflare'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<'name' | 'email' | 'business' | 'message', string>>
}

type ContactEnv = {
  BREVO_API_KEY?: string
  BREVO_FROM_EMAIL?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FAILURE_MESSAGE =
  'We could not send your request right now. Please email hello@starlightai.site and we’ll follow up.'

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const business = String(formData.get('business') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const honeypot = String(formData.get('website') ?? '')

  if (honeypot) return { status: 'success', message: 'Thanks, we’ll be in touch shortly.' }

  const errors: ContactState['errors'] = {}
  if (name.length < 2) errors.name = 'Please enter your name.'
  else if (name.length > 120) errors.name = 'Please keep your name under 120 characters.'
  if (!EMAIL_RE.test(email) || email.length > 254) errors.email = 'Please enter a valid email address.'
  if (business.length < 2) errors.business = 'Tell us the name of your business.'
  else if (business.length > 200) errors.business = 'Please keep your business name under 200 characters.'
  if (message.length < 10) errors.message = 'A sentence or two about what you want to automate helps us prepare.'
  else if (message.length > 5000) errors.message = 'Please keep your message under 5,000 characters.'

  if (Object.keys(errors).length) {
    return { status: 'error', errors, message: 'Please fix the highlighted fields.' }
  }

  const { env } = getCloudflareContext()
  const { BREVO_API_KEY, BREVO_FROM_EMAIL } = env as unknown as ContactEnv
  const apiKey = BREVO_API_KEY?.trim()
  const fromEmail = BREVO_FROM_EMAIL?.trim()

  if (!apiKey || !fromEmail || !EMAIL_RE.test(fromEmail)) {
    console.error('[contact] Brevo notification is missing a valid API key or verified sender configuration.')
    return { status: 'error', message: FAILURE_MESSAGE }
  }

  const textContent = [
    'New Starlight AI website enquiry',
    '',
    'Name: ' + name,
    'Email: ' + email,
    'Business: ' + business,
    '',
    'What they want to automate:',
    message,
  ].join('\n')

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Starlight AI Website', email: fromEmail },
        to: [{ email: 'hello@starlightai.site' }],
        replyTo: { email },
        subject: 'New Starlight AI website enquiry',
        textContent,
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) {
      console.error('[contact] Brevo rejected website enquiry', { status: response.status })
      return { status: 'error', message: FAILURE_MESSAGE }
    }
  } catch (error) {
    console.error('[contact] Brevo request failed', {
      errorName: error instanceof Error ? error.name : 'UnknownError',
    })
    return { status: 'error', message: FAILURE_MESSAGE }
  }

  return {
    status: 'success',
    message: 'Thanks, your request has been sent. We’ll reply within one business day.',
  }
}