export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { GEMINI_LIVE_MODEL, GEMINI_LIVE_VOICE, STARLIGHT_RECEPTIONIST_INSTRUCTIONS } from '@/lib/gemini-receptionist'

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
          model: GEMINI_LIVE_MODEL,
          config: {
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: GEMINI_LIVE_VOICE },
                },
              },
            },
            systemInstruction: { parts: [{ text: STARLIGHT_RECEPTIONIST_INSTRUCTIONS }] },
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
      { token: data.name, model: GEMINI_LIVE_MODEL, expiresAt },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return jsonError('Could not reach Gemini to create a voice session. Please try again.', 502)
  }
}
