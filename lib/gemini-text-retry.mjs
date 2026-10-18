const defaultSleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

function retryAfterMilliseconds(value, now) {
  if (!value) return null
  const seconds = Number(value)
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds * 1000)
  const date = Date.parse(value)
  return Number.isFinite(date) ? Math.max(0, date - now()) : null
}

function isPermanentQuota(message) {
  return /(?:daily|current|project|free[- ]tier)?\s*quota.{0,60}(?:exceed|exhaust|limit)|(?:exceed|exhaust).{0,60}(?:current|project|daily|free[- ]tier)?\s*quota|insufficient\s+quota|billing\s+(?:limit|account)|payment\s+required/i.test(message)
}

function isTransientRateLimit(message) {
  return /rate\s*limit|too many requests|high demand|temporarily overloaded|try again later/i.test(message)
}

function isPermanentErrorMessage(message) {
  return /invalid\s+(?:api\s+)?key|unauthori[sz]ed|permission\s+denied|forbidden|invalid\s+argument|malformed|unsupported\s+model|model.{0,30}(?:not found|not supported|unsupported)|(?:not found|not supported).{0,30}model/i.test(message)
}

function shouldRetry(response, message, retryAfterMs) {
  if (isPermanentErrorMessage(message)) return false
  if (response.status === 503) return true
  if (response.status !== 429) return false
  if (retryAfterMs !== null) return !isPermanentQuota(message)
  return !isPermanentQuota(message) && isTransientRateLimit(message)
}

function backoffDelay(retryNumber, baseDelayMs, maxDelayMs, random) {
  const exponential = baseDelayMs * (2 ** (retryNumber - 1))
  const jittered = exponential * (0.5 + Math.max(0, Math.min(1, random())))
  return Math.min(maxDelayMs, Math.round(jittered))
}

/** Make at most three total attempts for transient Gemini overload/rate-limit/network failures. */
export async function requestGeminiWithRetry(input, init, options = {}) {
  const fetchImpl = options.fetchImpl ?? fetch
  const sleepImpl = options.sleepImpl ?? defaultSleep
  const random = options.random ?? Math.random
  const now = options.now ?? Date.now
  const maxAttempts = Math.max(1, Math.min(3, options.maxAttempts ?? 3))
  const baseDelayMs = options.baseDelayMs ?? 300
  const maxDelayMs = options.maxDelayMs ?? 3000
  const maxRetryAfterMs = options.maxRetryAfterMs ?? 10_000

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response
    try {
      response = await fetchImpl(input, init)
    } catch (error) {
      if (attempt >= maxAttempts) throw error
      await sleepImpl(backoffDelay(attempt, baseDelayMs, maxDelayMs, random))
      continue
    }

    if (attempt >= maxAttempts) return response

    let message = ''
    if (response.status === 429 || response.status === 503) {
      try {
        const body = await response.clone().json()
        message = body.error?.message || ''
      } catch {
        // Use response status and Retry-After when the provider's error body is not JSON.
      }
    }

    const retryAfterMs = retryAfterMilliseconds(response.headers.get('Retry-After'), now)
    if (!shouldRetry(response, message, retryAfterMs)) return response
    if (retryAfterMs !== null && retryAfterMs > maxRetryAfterMs) return response

    const delay = retryAfterMs ?? backoffDelay(attempt, baseDelayMs, maxDelayMs, random)
    await sleepImpl(delay)
  }

  throw new Error('Gemini text request failed after the configured retry attempts.')
}
