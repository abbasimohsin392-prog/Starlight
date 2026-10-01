'use server'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<'name' | 'email' | 'business' | 'message', string>>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  // Wire this to your CRM / email provider (e.g. Resend) when ready.
  console.log('[contact] new inquiry', { name, email, business, message: message.slice(0, 500) })

  return { status: 'success', message: 'Thanks, we’ll reply within one business day with next steps.' }
}
