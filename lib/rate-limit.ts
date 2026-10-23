import { getCloudflareContext } from '@opennextjs/cloudflare'

type RateLimitBinding = {
  limit(input: { key: string }): Promise<{ success: boolean }>
}

type AiEndpoint = 'voice-session' | 'text-chat'

const bindingNames: Record<AiEndpoint, string> = {
  'voice-session': 'AI_SESSION_RATE_LIMITER',
  'text-chat': 'AI_TEXT_RATE_LIMITER',
}


/**
 * Apply Cloudflare's per-IP rate limit before invoking the paid AI provider.
 * Rate-limit state is managed by Cloudflare rather than an in-memory variable.
 * Cloudflare evaluates limits per location, so this mitigates abuse rather
 * than creating a strict global quota.
 */
export async function enforceAiRateLimit(
  request: Request,
  endpoint: AiEndpoint,
): Promise<Response | null> {
  const clientIp =
    request.headers.get('cf-connecting-ip')?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()

  if (!clientIp) {
    console.error('[ai-rate-limit] Client IP unavailable; refusing an unmetered AI request.')
    return Response.json(
      { error: 'The AI demo is temporarily unavailable. Please try again shortly.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  try {
    const { env } = await getCloudflareContext({ async: true })
    const bindingName = bindingNames[endpoint]
    const binding = (env as unknown as Record<string, unknown>)[bindingName] as RateLimitBinding | undefined
    if (!binding || typeof binding.limit !== 'function') {
      throw new Error(`Missing Cloudflare binding: ${bindingName}`)
    }

    const result = await binding.limit({ key: clientIp })
    if (!result.success) {
      return Response.json(
        { error: `Too many ${endpoint === 'voice-session' ? 'voice session' : 'text chat'} requests. Please wait a minute and try again.` },
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-store',
            'Retry-After': '60',
          },
        },
      )
    }

    return null
  } catch (error) {
    console.error('[ai-rate-limit] Cloudflare rate-limit check failed.', {
      endpoint,
      errorName: error instanceof Error ? error.name : 'UnknownError',
    })
    return Response.json(
      { error: 'The AI demo is temporarily unavailable while request protection is checked. Please try again shortly.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
