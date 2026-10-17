import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * Resolve the Gemini credential from the active Cloudflare Worker bindings.
 * process.env remains a fallback for local development and compatible runtimes.
 */
export function getGeminiApiKey(): string | undefined {
  try {
    const bindings = getCloudflareContext().env as unknown as Record<string, unknown>
    const boundValue = bindings.GEMINI_API_KEY || bindings.GOOGLE_API_KEY
    if (typeof boundValue === 'string' && boundValue.trim()) return boundValue.trim()
  } catch {
    // Outside a Cloudflare request context, fall back to process.env.
  }

  const value = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}
