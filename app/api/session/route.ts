export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MODEL = 'models/gemini-3.8-live'

const instructions = [
  "You are the friendly, professional AI receptionist for Starlight AI, an AI automation agency.",
  "Speak naturally, warmly, and concisely. Ask one question at a time and let the visitor interrupt you.",
  "Explain that Starlight AI designs AI receptionists, website chatbots, WhatsApp agents, customer support workflows, lead routing, and custom automations.",
  "If asked about pricing, explain that the website shows proposed starting points of $197/month, $397/month, and $597+/month. These are not final quotes; implementation and third-party usage may cost extra, and final scope must be confirmed with the team.",
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

  // Browser sessions should originate from the same site, never from a third-party page.
  if (!origin) {
    return jsonError('A same-site browser request is required to start a voice session.', 403)
  }
  try {
    if (new URL(origin).host !== host) {
      return jsonError('This voice session can only be started from the Starlight AI website.', 403)
    }
  } catch {
    return jsonError('Invalid request origin.', 403)
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) {
    return jsonError(
      'The live AI receptionist is not configured yet. Add GEMINI_API_KEY as a private server-side secret in your hosting settings.',
      503,
    )
  }

  try {
    const now = Date.now()
    const expiresAt = new Date(now + 15 * 60 * 1000).toISOString()
    const tokenResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/auth_tokens', {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        uses: 1,
        expireTime: expiresAt,
        newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
        liveConnectConstraints: {
          model: MODEL,
          config: {
            responseModalities: ['AUDIO'],
            systemInstruction: { parts: [{ text: instructions }] },
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Aoede' },
              },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
        },
      }),
    })

    const data = await tokenResponse.json() as { name?: string }
    if (!tokenResponse.ok || !data.name) {
      if (tokenResponse.status === 429) {
        return jsonError('Gemini is at its current usage limit. Please try again later or check your Google AI Studio quota.', 429)
      }
      if (tokenResponse.status === 401 || tokenResponse.status === 403) {
        return jsonError('Gemini rejected the server key. Check that GEMINI_API_KEY is valid and the Live API is enabled for this project.', 502)
      }
      return jsonError('Gemini could not create a voice session. Check API access and current model availability.', 502)
    }

    return Response.json(
      { token: data.name, model: MODEL, expiresAt },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return jsonError('Could not reach Gemini to create a voice session. Please try again.', 502)
  }
}
