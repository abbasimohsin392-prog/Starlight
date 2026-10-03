'use server'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<'name' | 'email' | 'business' | 'message', string>>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_CONTACT_EMAIL = 'hello@starlightai.site'

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const business = String(formData.get('business') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const honeypot = String(formData.get('website') ?? '')

  if (honeypot) return { status: 'success', message: 'Thanks, we’ll be in touch shortly.' }

  const errors: ContactState['errors'] = {}
  if (name.length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (business.length < 2) errors.business = 'Tell us the name of your business.'
  if (message.length < 10) errors.message = 'A sentence or two about what you want to automate helps us prepare.'

  if (Object.keys(errors).length) {
    return { status: 'error', errors, message: 'Please fix the highlighted fields.' }
  }

  const apiKey = process.env.BREVO_API_KEY
  const recipient = process.env.CONTACT_TO_EMAIL || DEFAULT_CONTACT_EMAIL

  if (!apiKey) {
    console.error('[contact] BREVO_API_KEY is not configured')
    return { status: 'error', message: 'The form is temporarily unavailable. Please email us directly.' }
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Starlight AI website', email: DEFAULT_CONTACT_EMAIL },
        to: [{ email: recipient }],
        replyTo: { email, name },
        subject: 'New AI system enquiry from ' + name,
        textContent: [
          'Name: ' + name,
          'Work email: ' + email,
          'Business: ' + business,
          '',
          'What they would like to automate:',
          message,
        ].join('\n'),
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      const details = await response.text()
      console.error('[contact] Brevo rejected email', response.status, details.slice(0, 500))
      return { status: 'error', message: 'We could not send your request. Please email us directly.' }
    }
  } catch (error) {
    console.error('[contact] Email delivery failed', error)
    return { status: 'error', message: 'We could not send your request. Please email us directly.' }
  }

  return { status: 'success', message: 'Thanks, we’ll reply within one business day with next steps.' }
}
