import { getGeminiApiKey } from '@/lib/gemini-api-key'
import { requestGeminiWithRetry } from '@/lib/gemini-text-retry.mjs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { STARLIGHT_RECEPTIONIST_INSTRUCTIONS } from '@/lib/gemini-receptionist'

type HistoryTurn = { role: 'user' | 'model'; text: string }

function jsonError(error: string, status: number, retryAfter?: string | null) {
  return Response.json({ error }, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...(retryAfter ? { 'Retry-After': retryAfter } : {}),
    },
  })
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
    const response = await requestGeminiWithRetry('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent', {
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
      const messageFromProvider = data.error?.message || ''
      const retryAfter = response.headers.get('Retry-After')
      if (response.status === 429) {
        const permanentQuota = /(?:daily|current|project|free[- ]tier)?\s*quota.{0,60}(?:exceed|exhaust|limit)|(?:exceed|exhaust).{0,60}(?:current|project|daily|free[- ]tier)?\s*quota|insufficient\s+quota|billing\s+(?:limit|account)|payment\s+required/i.test(messageFromProvider)
        return jsonError(
          permanentQuota
            ? 'Gemini has reached the project quota or billing limit. Check the Google AI project quota and billing settings.'
            : 'Gemini is receiving too many requests right now. Please try again shortly.',
          429,
          retryAfter,
        )
      }
      if (response.status === 503) {
        return jsonError('Gemini is temporarily busy. The request was retried, but the service is still unavailable. Please try again shortly.', 503, retryAfter)
      }
      if (response.status === 401 || response.status === 403) {
        return jsonError('Gemini rejected the server key or project permissions. Check GEMINI_API_KEY and model access in Google AI Studio.', 502)
      }
      if (response.status === 404) {
        return jsonError('The configured Gemini text model is unavailable to this project. Check model access before changing models.', 502)
      }
      if (response.status === 400 || response.status === 422) {
        return jsonError('Gemini rejected the text request. Check the request format and message, then try again.', 502)
      }
      return jsonError(`Gemini text request failed (HTTP ${response.status}). Please try again or check the server configuration.`, 502)
    }

    const reply = (data.candidates?.[0]?.content?.parts || []).map((part) => part.text || '').join('').trim()
    if (!reply) return jsonError('Gemini returned no text. Try sending your question again.', 502)

    return Response.json({ reply }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return jsonError('Could not reach Gemini after the retry attempts. Check the connection and try again shortly.', 503)
  }
}
