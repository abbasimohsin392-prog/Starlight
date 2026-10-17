import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * Read Gemini credentials from the active Cloudflare Worker bindings first,
 * then fall back to process.env for supported local/dev environments.
 * The key is only consumed by server-side route handlers.
 */
export function getGeminiApiKey(): string | undefined {
  try {
    const bindings = getCloudflareContext().env as unknown as Record<string, unknown>
    const value = bindings.GEMINI_API_KEY || bindings.GOOGLE_API_KEY
    if (typeof value === 'string' && value.trim()) return value.trim()
  } catch {
    // Cloudflare context is unavailable in some local tooling; try process.env below.
  }

  const value = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}
