import { getGeminiApiKey } from '@/lib/gemini-api-key'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { STARLIGHT_RECEPTIONIST_INSTRUCTIONS } from '@/lib/gemini-receptionist'

type HistoryTurn = { role: 'user' | 'model'; text: string }

function jsonError(error: string, status: number) {
  return Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
    || request.headers.get('host')
    || new URL(request.url).host

  if (!origin) return jsonError('A same-site browser request is required.', 403)
  try {
    if (new URL(origin).host !== host) {
      return jsonError('This chat can only be started from the Starlight AI website.', 403)
    }
  } catch {
    return jsonError('Invalid request origin.', 403)
  }

  const apiKey = await getGeminiApiKey()
  if (!apiKey) {
    return jsonError('The AI chat is not configured: GEMINI_API_KEY is missing from the Cloudflare Worker secrets.', 503)
  }

  let body: { message?: unknown; history?: unknown }
  try {
    body = await request.json() as { message?: unknown; history?: unknown }
  } catch {
    return jsonError('Invalid JSON request body.', 400)
  }

  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!message) return jsonError('Type a message before sending.', 400)
  if (message.length > 1500) return jsonError('Messages must be 1,500 characters or fewer.', 400)

  const historyInput = Array.isArray(body.history) ? body.history : []
  const history: HistoryTurn[] = historyInput
    .slice(-12)
    .filter((turn): turn is { role: string; text: string } =>
      !!turn && typeof turn === 'object'
      && typeof (turn as { role?: unknown }).role === 'string'
      && typeof (turn as { text?: unknown }).text === 'string')
    .map((turn): HistoryTurn => ({
      role: turn.role === 'assistant' || turn.role === 'model' ? 'model' : 'user',
      text: turn.text.trim().slice(0, 1500),
    }))
    .filter((turn) => turn.text.length > 0)

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent', {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: STARLIGHT_RECEPTIONIST_INSTRUCTIONS }] },
        contents: [
          ...history.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] })),
          { role: 'user', parts: [{ text: message }] },
        ],
        generationConfig: { maxOutputTokens: 700 },
      }),
    })

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
      error?: { message?: string }
    }
    if (!response.ok) {
      const detail = data.error?.message ? ` Details: ${data.error.message}` : ''
      const error = response.status === 429
        ? 'Gemini reached its current usage limit. Try again later.'
        : `Gemini text request failed (HTTP ${response.status}). Check the key, model access, and quota.${detail}`
      return jsonError(error, response.status === 429 ? 429 : 502)
    }

    const reply = (data.candidates?.[0]?.content?.parts || []).map((part) => part.text || '').join('').trim()
    if (!reply) return jsonError('Gemini returned no text. Try sending your question again.', 502)

    return Response.json({ reply }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return jsonError('Could not reach the Gemini text API. Check Cloudflare network access and try again.', 502)
  }
}
