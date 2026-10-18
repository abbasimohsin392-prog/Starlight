export type GeminiRetryOptions = {
  fetchImpl?: typeof fetch
  sleepImpl?: (milliseconds: number) => Promise<void>
  random?: () => number
  now?: () => number
  maxAttempts?: number
  baseDelayMs?: number
  maxDelayMs?: number
  maxRetryAfterMs?: number
}

export function requestGeminiWithRetry(
  input: RequestInfo | URL,
  init: RequestInit,
  options?: GeminiRetryOptions,
): Promise<Response>
