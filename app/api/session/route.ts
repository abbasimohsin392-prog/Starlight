export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_SDP_SIZE = 64 * 1024

const instructions = [
  "You are the friendly, professional AI receptionist for Starlight AI, an AI automation agency.",
  "Speak naturally, warmly, and concisely. Ask one question at a time and let the visitor interrupt you.",
  "Explain that Starlight AI designs AI receptionists, website chatbots, WhatsApp agents, customer support workflows, lead routing, and custom automations.",
  "If asked about pricing, explain that the website shows proposed starting points of $197/month, $397/month, and $597+/month. They are not a final quote; implementation and third-party usage may cost extra, and final scope must be confirmed with the team.",
  "This is a public demonstration. You are not connected to a real calendar, CRM, WhatsApp account, property listing system, or human inbox. Never claim to have booked an appointment, submitted a lead, contacted a person, or changed a real system.",
  "If a visitor wants a meeting, direct them to the Book a Call or Contact link on the website. Do not ask for payment details, passwords, medical information, or other sensitive information. Do not say that you saved their details.",
  "When asked, clearly disclose that you are an AI assistant. If you do not know a business-specific answer, say so and suggest contacting the Starlight AI team.",
].join(' ')

function jsonError(error: string, status: number) {
  return Response.json(
    { error },
    { status, headers: { 'Cache-Control': 'no-store' } },
  )
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
    || request.headers.get('host')
    || new URL(request.url).host

  if (origin) {
    try {
      if (new URL(origin).host !== host) {
        return jsonError('This voice session can only be started from the Starlight AI website.', 403)
      }
    } catch {
      return jsonError('Invalid request origin.', 403)
    }
  }

  if (!process.env.OPENAI_API_KEY) {
    return jsonError(
      'The live AI receptionist is not configured yet. The site owner needs to add OPENAI_API_KEY as a private server-side secret.',
      503,
    )
  }

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_SDP_SIZE) {
    return jsonError('The connection request is too large.', 413)
  }

  let body: { sdp?: unknown }
  try {
    body = await request.json() as { sdp?: unknown }
  } catch {
    return jsonError('A valid voice-session offer is required.', 400)
  }

  if (typeof body.sdp !== 'string' || !body.sdp.trim()) {
    return jsonError('A valid voice-session offer is required.', 400)
  }
  if (body.sdp.length > MAX_SDP_SIZE) {
    return jsonError('The connection request is too large.', 413)
  }

  const form = new FormData()
  form.set('sdp', body.sdp)
  form.set('session', JSON.stringify({
    type: 'realtime',
    model: 'gpt-realtime',
    instructions,
    audio: {
      input: {
        transcription: { model: 'gpt-4o-mini-transcribe' },
        turn_detection: { type: 'server_vad' },
      },
      output: { voice: 'marin' },
    },
  }))

  try {
    const upstream = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.OPENAI_API_KEY },
      body: form,
      cache: 'no-store',
    })

    const answer = await upstream.text()
    if (!upstream.ok) {
      const status = upstream.status === 429 ? 429 : 502
      return jsonError(
        upstream.status === 429
          ? 'The live voice service is busy or its usage limit has been reached. Please try again later.'
          : 'The live voice service could not start. Please check the server API key, model access, and usage limits.',
        status,
      )
    }

    return new Response(answer, {
      status: 200,
      headers: {
        'Content-Type': 'application/sdp',
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return jsonError('Could not reach the live voice service. Please try again.', 502)
  }
}
