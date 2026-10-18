import test from 'node:test'
import assert from 'node:assert/strict'
import { requestGeminiWithRetry } from '../lib/gemini-text-retry.mjs'

function jsonResponse(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

function sequenceFetch(sequence, calls) {
  return async () => {
    calls.count++
    const next = sequence.shift()
    if (next instanceof Error) throw next
    return next
  }
}

const success = () => jsonResponse(200, {
  candidates: [{ content: { parts: [{ text: 'Hello from Gemini.' }] } }],
})

test('retries one HTTP 503 then returns a successful response', async () => {
  const calls = { count: 0 }
  const delays = []
  const response = await requestGeminiWithRetry('https://gemini.invalid', {}, {
    fetchImpl: sequenceFetch([jsonResponse(503, { error: { message: 'High demand' } }), success()], calls),
    sleepImpl: async (ms) => delays.push(ms),
    random: () => 0.5,
  })
  assert.equal(response.status, 200)
  assert.equal(calls.count, 2)
  assert.deepEqual(delays, [300])
  assert.equal((await response.json()).candidates[0].content.parts[0].text, 'Hello from Gemini.')
})

test('stops after three total HTTP 503 attempts', async () => {
  const calls = { count: 0 }
  const delays = []
  const response = await requestGeminiWithRetry('https://gemini.invalid', {}, {
    fetchImpl: sequenceFetch([
      jsonResponse(503, { error: { message: 'Service unavailable' } }),
      jsonResponse(503, { error: { message: 'Service unavailable' } }),
      jsonResponse(503, { error: { message: 'Service unavailable' } }),
    ], calls),
    sleepImpl: async (ms) => delays.push(ms),
    random: () => 0.5,
  })
  assert.equal(response.status, 503)
  assert.equal(calls.count, 3)
  assert.deepEqual(delays, [300, 600])
})

test('honors Retry-After for a transient HTTP 429', async () => {
  const calls = { count: 0 }
  const delays = []
  const response = await requestGeminiWithRetry('https://gemini.invalid', {}, {
    fetchImpl: sequenceFetch([
      jsonResponse(429, { error: { message: 'Rate limit exceeded' } }, { 'Retry-After': '1' }),
      success(),
    ], calls),
    sleepImpl: async (ms) => delays.push(ms),
  })
  assert.equal(response.status, 200)
  assert.equal(calls.count, 2)
  assert.deepEqual(delays, [1000])
})

test('does not retry permanent project quota errors', async () => {
  const calls = { count: 0 }
  const delays = []
  const response = await requestGeminiWithRetry('https://gemini.invalid', {}, {
    fetchImpl: sequenceFetch([
      jsonResponse(429, { error: { message: 'You exceeded your current quota.' } }),
      success(),
    ], calls),
    sleepImpl: async (ms) => delays.push(ms),
  })
  assert.equal(response.status, 429)
  assert.equal(calls.count, 1)
  assert.deepEqual(delays, [])
})

test('does not retry authentication, permission, unsupported-model, or malformed-request errors', async () => {
  for (const status of [400, 401, 403, 404, 422]) {
    const calls = { count: 0 }
    const response = await requestGeminiWithRetry('https://gemini.invalid', {}, {
      fetchImpl: sequenceFetch([jsonResponse(status, { error: { message: 'Permanent failure' } }), success()], calls),
      sleepImpl: async () => assert.fail('permanent errors must not sleep or retry'),
    })
    assert.equal(response.status, status)
    assert.equal(calls.count, 1)
  }
})

test('retries a transient network failure and then succeeds', async () => {
  const calls = { count: 0 }
  const delays = []
  const response = await requestGeminiWithRetry('https://gemini.invalid', {}, {
    fetchImpl: sequenceFetch([new TypeError('network failure'), success()], calls),
    sleepImpl: async (ms) => delays.push(ms),
    random: () => 0.5,
  })
  assert.equal(response.status, 200)
  assert.equal(calls.count, 2)
  assert.deepEqual(delays, [300])
})

test('does not retry a 503 when the provider message identifies an unsupported model', async () => {
  const calls = { count: 0 }
  const response = await requestGeminiWithRetry('https://gemini.invalid', {}, {
    fetchImpl: sequenceFetch([jsonResponse(503, { error: { message: 'Unsupported model for this project' } }), success()], calls),
    sleepImpl: async () => assert.fail('unsupported model is permanent even if status is 503'),
  })
  assert.equal(response.status, 503)
  assert.equal(calls.count, 1)
})

test('does not retry an HTTP 429 without transient-rate-limit evidence', async () => {
  const calls = { count: 0 }
  const response = await requestGeminiWithRetry('https://gemini.invalid', {}, {
    fetchImpl: sequenceFetch([jsonResponse(429, { error: { message: 'Quota exceeded for this project' } }), success()], calls),
    sleepImpl: async () => assert.fail('quota errors must not retry'),
  })
  assert.equal(response.status, 429)
  assert.equal(calls.count, 1)
})

test('does not retry after the overall request signal is aborted', async () => {
  const controller = new AbortController()
  const calls = { count: 0 }
  const delays = []
  const pending = requestGeminiWithRetry('https://gemini.invalid', { signal: controller.signal }, {
    fetchImpl: async (_input, init) => {
      calls.count++
      return await new Promise((_resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true })
      })
    },
    sleepImpl: async (ms) => delays.push(ms),
  })
  controller.abort(new DOMException('Request timed out.', 'TimeoutError'))
  await assert.rejects(pending, { name: 'TimeoutError' })
  assert.equal(calls.count, 1)
  assert.deepEqual(delays, [])
})
