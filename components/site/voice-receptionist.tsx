'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AudioLines, Bot, Check, LoaderCircle, Mic, MicOff, RotateCcw,
  Send, ShieldCheck, Sparkles, X,
} from 'lucide-react'
import { GEMINI_LIVE_MODEL, GEMINI_LIVE_VOICE, STARLIGHT_RECEPTIONIST_INSTRUCTIONS } from '@/lib/gemini-receptionist'

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error'
type TranscriptRole = 'visitor' | 'assistant'
type TranscriptMessage = { id: string; role: TranscriptRole; text: string }
type LiveTranscript = { role: TranscriptRole; text: string } | null
type GeminiPart = { text?: string; inlineData?: { data?: string; mimeType?: string } }
type GeminiMessage = {
  setupComplete?: unknown
  error?: { message?: string; status?: string }
  serverContent?: {
    modelTurn?: { parts?: GeminiPart[] }
    inputTranscription?: { text?: string; finished?: boolean }
    outputTranscription?: { text?: string; finished?: boolean }
    turnComplete?: boolean
    interrupted?: boolean
  }
}

const suggestions = [
  'What does Starlight AI do?',
  'Tell me about AI receptionists.',
  'How does pricing work?',
  'Can you automate WhatsApp enquiries?',
  'Can you review my website?',
]

function extractUrlForClient(text: string): string | null {
  const explicit = text.match(/https?:\/\/[^\s<>"']+/i)?.[0]
  if (explicit) return explicit.replace(/[),.;!?]+$/, '')

  const bare = text.match(/(?:^|[\s(])((?:www\.)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::\d{1,5})?(?:\/[^\s<>"')]+)?)/i)?.[1]
  return bare ? bare.replace(/[),.;!?]+$/, '') : null
}

function floatToPcm16Base64(input: Float32Array, inputRate: number, targetRate = 16000) {
  const ratio = inputRate / targetRate
  const length = Math.floor(input.length / ratio)
  const pcm = new Int16Array(length)

  for (let i = 0; i < length; i++) {
    const start = Math.floor(i * ratio)
    const end = Math.max(start + 1, Math.floor((i + 1) * ratio))
    let total = 0
    let count = 0
    for (let j = start; j < Math.min(end, input.length); j++) {
      total += input[j]
      count++
    }
    const sample = Math.max(-1, Math.min(1, total / Math.max(1, count)))
    pcm[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff
  }

  const bytes = new Uint8Array(pcm.buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return window.btoa(binary)
}

function pcm16Base64ToFloat(base64: string) {
  const binary = window.atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const view = new DataView(bytes.buffer)
  const samples = new Float32Array(Math.floor(bytes.byteLength / 2))
  for (let i = 0; i < samples.length; i++) samples[i] = view.getInt16(i * 2, true) / 32768
  return samples
}

export function VoiceReceptionist() {
  const [status, setStatus] = useState<ConnectionStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('Ready when you are')
  const [errorMessage, setErrorMessage] = useState('')
  const [textOnlyMode, setTextOnlyMode] = useState(false)
  const [textRequestPending, setTextRequestPending] = useState(false)
  const [muted, setMuted] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<TranscriptMessage[]>([])
  const [liveTranscript, setLiveTranscript] = useState<LiveTranscript>(null)

  const socketRef = useRef<WebSocket | null>(null)
  const microphoneRef = useRef<MediaStream | null>(null)
  const captureContextRef = useRef<AudioContext | null>(null)
  const captureSourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const captureProcessorRef = useRef<ScriptProcessorNode | null>(null)
  const captureGainRef = useRef<GainNode | null>(null)
  const playbackContextRef = useRef<AudioContext | null>(null)
  const playbackQueueTimeRef = useRef(0)
  const playbackSourcesRef = useRef(new Set<AudioBufferSourceNode>())
  const readyRef = useRef(false)
  const mutedRef = useRef(false)
  const endingRef = useRef(false)
  const inputDraftRef = useRef('')
  const outputDraftRef = useRef('')
  const messageIdRef = useRef(0)
  const transcriptEndRef = useRef<HTMLDivElement | null>(null)

  const appendMessage = useCallback((role: TranscriptRole, value: string) => {
    const text = value.trim()
    if (!text) return
    const id = String(Date.now()) + '-' + String(++messageIdRef.current)
    setMessages((current) => [...current, { id, role, text }].slice(-40))
  }, [])

  const stopPlayback = useCallback(() => {
    playbackSourcesRef.current.forEach((source) => {
      try { source.stop() } catch { /* Source may already be finished. */ }
      try { source.disconnect() } catch { /* Safe cleanup. */ }
    })
    playbackSourcesRef.current.clear()
    playbackQueueTimeRef.current = playbackContextRef.current?.currentTime || 0
  }, [])

  const cleanupSession = useCallback(() => {
    readyRef.current = false
    endingRef.current = true

    if (socketRef.current) {
      const socket = socketRef.current
      socket.onopen = null
      socket.onmessage = null
      socket.onerror = null
      socket.onclose = null
      socket.close()
      socketRef.current = null
    }

    captureProcessorRef.current?.disconnect()
    captureSourceRef.current?.disconnect()
    captureGainRef.current?.disconnect()
    captureProcessorRef.current = null
    captureSourceRef.current = null
    captureGainRef.current = null
    microphoneRef.current?.getTracks().forEach((track) => track.stop())
    microphoneRef.current = null

    if (captureContextRef.current) {
      void captureContextRef.current.close().catch(() => undefined)
      captureContextRef.current = null
    }
    stopPlayback()
    if (playbackContextRef.current) {
      void playbackContextRef.current.close().catch(() => undefined)
      playbackContextRef.current = null
    }

    inputDraftRef.current = ''
    outputDraftRef.current = ''
    setLiveTranscript(null)
    mutedRef.current = false
    endingRef.current = false
  }, [stopPlayback])

  useEffect(() => () => cleanupSession(), [cleanupSession])
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, liveTranscript])

  const endSession = useCallback(() => {
    cleanupSession()
    setMuted(false)
    setStatus('idle')
    setStatusMessage('Conversation ended')
    setErrorMessage('')
  }, [cleanupSession])

  const playPcmChunk = useCallback((base64: string) => {
    const context = playbackContextRef.current
    if (!context || context.state === 'closed') return

    const samples = pcm16Base64ToFloat(base64)
    if (!samples.length) return

    const buffer = context.createBuffer(1, samples.length, 24000)
    buffer.copyToChannel(samples, 0)
    const source = context.createBufferSource()
    source.buffer = buffer
    source.connect(context.destination)
    source.onended = () => {
      playbackSourcesRef.current.delete(source)
      source.disconnect()
    }

    const startAt = Math.max(context.currentTime + 0.015, playbackQueueTimeRef.current)
    source.start(startAt)
    playbackQueueTimeRef.current = startAt + buffer.duration
    playbackSourcesRef.current.add(source)
  }, [])

  const startSession = useCallback(async (mode: 'voice' | 'text' = 'voice') => {
    const withMicrophone = mode === 'voice'
    const textOnly = mode === 'text'
    cleanupSession()
    endingRef.current = false
    setStatus('connecting')
    setStatusMessage(withMicrophone ? 'Requesting microphone and starting Starlight AI…' : 'Starting Starlight AI text chat…')
    setErrorMessage('')
    setTextOnlyMode(textOnly)
    setTextRequestPending(false)
    setMuted(false)
    let microphoneAccessFailed = false

    // The text diagnostic intentionally bypasses mic, Web Audio, ephemeral tokens, and WebSockets.
    // It uses the server-side generateContent endpoint so audio-mode limits cannot mask text API issues.
    if (textOnly) {
      readyRef.current = true
      setStatus('connected')
      setStatusMessage('Text chat ready: type a question below')
      appendMessage('assistant', 'Text-only test is ready. Ask me about Starlight AI to try the assistant.')
      return
    }

    try {
      if (!window.WebSocket) {
        throw new Error('WebSocket is not supported in this browser. Try the latest Chrome or Edge.')
      }
      if (withMicrophone && !window.AudioContext) {
        throw new Error('Audio is not supported in this browser. Try the latest Chrome or Edge.')
      }

      if (withMicrophone) {
        if (!navigator.mediaDevices?.getUserMedia) {
          microphoneAccessFailed = true
          throw new Error('Microphone access is not available in this browser.')
        }

        let microphone: MediaStream
        try {
          microphone = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          })
        } catch (error) {
          microphoneAccessFailed = true
          throw error
        }
        microphoneRef.current = microphone

        const captureContext = new AudioContext()
        captureContextRef.current = captureContext
        await captureContext.resume()
        const source = captureContext.createMediaStreamSource(microphone)
        const processor = captureContext.createScriptProcessor(2048, 1, 1)
        const silentGain = captureContext.createGain()
        silentGain.gain.value = 0
        captureSourceRef.current = source
        captureProcessorRef.current = processor
        captureGainRef.current = silentGain

        processor.onaudioprocess = (event) => {
          const socket = socketRef.current
          if (!readyRef.current || mutedRef.current || !socket || socket.readyState !== WebSocket.OPEN) return
          const base64 = floatToPcm16Base64(event.inputBuffer.getChannelData(0), event.inputBuffer.sampleRate)
          socket.send(JSON.stringify({
            realtimeInput: { audio: { data: base64, mimeType: 'audio/pcm;rate=16000' } },
          }))
        }
        source.connect(processor)
        processor.connect(silentGain)
        silentGain.connect(captureContext.destination)
      }

      if (withMicrophone) {
        const playbackContext = new AudioContext({ sampleRate: 24000 })
        playbackContextRef.current = playbackContext
        await playbackContext.resume()
        playbackQueueTimeRef.current = playbackContext.currentTime
      }

      const tokenResponse = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
        cache: 'no-store',
      })
      if (!tokenResponse.ok) {
        const data = await tokenResponse.json().catch(() => ({})) as { error?: string }
        throw new Error(data.error || 'Could not start the voice assistant. Please try again.')
      }

      const tokenData = await tokenResponse.json() as { token?: string }
      if (!tokenData.token) throw new Error('The assistant could not start a secure session.')

      const socketUrl = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=' + tokenData.token
      const socket = new WebSocket(socketUrl)
      socketRef.current = socket

      socket.onopen = () => {
        socket.send(JSON.stringify({
          setup: {
            model: GEMINI_LIVE_MODEL,
            generationConfig: withMicrophone ? {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: GEMINI_LIVE_VOICE },
                },
              },
            } : {
              responseModalities: ['TEXT'],
            },
            systemInstruction: { parts: [{ text: STARLIGHT_RECEPTIONIST_INSTRUCTIONS }] },
            ...(withMicrophone ? {
              inputAudioTranscription: {},
              outputAudioTranscription: {},
            } : {}),
          },
        }))
      }

      socket.onmessage = (event) => {
        void (async () => {
          try {
            let raw: string
            if (typeof event.data === 'string') raw = event.data
            else if (event.data instanceof Blob) raw = await event.data.text()
            else if (event.data instanceof ArrayBuffer) raw = new TextDecoder().decode(event.data)
            else return

            const payload = JSON.parse(raw) as GeminiMessage
            if (payload.error) {
              setErrorMessage(payload.error.message || 'The assistant returned a voice-session error.')
              if (!readyRef.current) {
                setStatus('error')
                setStatusMessage('Voice session unavailable')
              }
              return
            }

            if (payload.setupComplete) {
              readyRef.current = true
              setStatus('connected')
              setStatusMessage(withMicrophone ? 'Connected. Speak naturally or type below' : 'Text test connected. Type a message below')
              socket.send(JSON.stringify({
                clientContent: {
                  turns: [{
                    role: 'user',
                    parts: [{ text: 'Welcome the visitor warmly and concisely as Starlight AI’s demo receptionist. Invite them to ask about the agency’s AI services.' }],
                  }],
                  turnComplete: true,
                },
              }))
            }

            const content = payload.serverContent
            if (!content) return

            if (content.inputTranscription?.text) {
              inputDraftRef.current += content.inputTranscription.text
              setLiveTranscript({ role: 'visitor', text: inputDraftRef.current })
            }
            if (content.outputTranscription?.text) {
              outputDraftRef.current += content.outputTranscription.text
              setLiveTranscript({ role: 'assistant', text: outputDraftRef.current })
            }
            for (const part of content.modelTurn?.parts || []) {
              if (!textOnly && part.inlineData?.data) playPcmChunk(part.inlineData.data)
              if (part.text && !content.outputTranscription?.text) {
                outputDraftRef.current += part.text
                setLiveTranscript({ role: 'assistant', text: outputDraftRef.current })
              }
            }

            if (content.interrupted) {
              stopPlayback()
              if (outputDraftRef.current.trim()) appendMessage('assistant', outputDraftRef.current)
              outputDraftRef.current = ''
              setLiveTranscript(null)
              setStatusMessage('Listening. Go ahead.')
            }

            if (content.turnComplete) {
              if (inputDraftRef.current.trim()) appendMessage('visitor', inputDraftRef.current)
              if (outputDraftRef.current.trim()) appendMessage('assistant', outputDraftRef.current)
              inputDraftRef.current = ''
              outputDraftRef.current = ''
              setLiveTranscript(null)
              setStatusMessage(withMicrophone ? 'Connected. Speak naturally or type below' : 'Text test connected. Type a message below')
            }
          } catch {
            setErrorMessage('A voice response could not be processed. Please end the chat and reconnect.')
          }
        })()
      }

      socket.onerror = () => {
        setStatus('error')
        setStatusMessage('Voice connection error')
        setErrorMessage(textOnly ? 'Could not connect to the assistant. Please try again or use the text-only test.' : 'Could not connect to the voice assistant. Check your connection and try again.')
      }
      socket.onclose = () => {
        if (endingRef.current) return
        readyRef.current = false
        setStatus('error')
        setStatusMessage('Voice session ended')
        setErrorMessage(textOnly ? 'The assistant text session closed before it was ready. Please try again.' : 'The voice session closed. Start a new chat to continue.')
      }
    } catch (error) {
      cleanupSession()
      setStatus('error')
      setStatusMessage('Voice session unavailable')
      if (microphoneAccessFailed) {
        const errorName = error instanceof DOMException ? error.name : ''
        setErrorMessage(
          errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError'
            ? 'Microphone access was denied by your browser or operating system. Allow it in site settings, or choose the text-only test below to test Gemini independently.'
            : (error instanceof Error ? error.message : 'Microphone unavailable.') + ' You can continue with text only to test Gemini.',
        )
      } else {
        setErrorMessage(error instanceof Error ? error.message : 'Could not start the voice assistant.')
      }
    }
  }, [appendMessage, cleanupSession, playPcmChunk, stopPlayback])

  const sendText = useCallback(async (value: string) => {
    const text = value.trim()
    if (!text || status !== 'connected' || !readyRef.current || textRequestPending) return

    const websiteUrl = extractUrlForClient(text)
    if (websiteUrl) {
      appendMessage('visitor', text)
      setDraft('')
      setErrorMessage('')
      setTextRequestPending(true)
      setStatusMessage('Reviewing the public homepage…')

      try {
        const response = await fetch('/api/website-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: websiteUrl }),
          cache: 'no-store',
        })
        const data = await response.json().catch(() => ({})) as { reply?: string; error?: string; url?: string }
        if (!response.ok) throw new Error(data.error || 'The website review could not be completed.')
        if (!data.reply) throw new Error('The website reviewer returned no findings. Please try again.')

        if (textOnlyMode) {
          appendMessage('assistant', data.reply)
          setStatusMessage('Website review complete. Ask another question anytime.')
        } else {
          const socket = socketRef.current
          if (socket && socket.readyState === WebSocket.OPEN) {
            const auditContext = [
              'A public homepage review has completed for the visitor.',
              'Reviewed URL: ' + (data.url || websiteUrl),
              'Use the following review to give the visitor a warm, concise spoken explanation. Prioritize two practical opportunities.',
              'Be transparent that this is a first-pass review of one accessible public HTML page. Do not claim full-site crawling, analytics, performance tests, mobile-layout testing, search-ranking checks, or verified form behavior.',
              'Website review findings:',
              data.reply,
            ].join('\n\n')
            socket.send(JSON.stringify({
              clientContent: {
                turns: [{ role: 'user', parts: [{ text: auditContext }] }],
                turnComplete: true,
              },
            }))
            setStatusMessage('Website review ready. Explaining the findings…')
          } else {
            appendMessage('assistant', data.reply)
            setStatusMessage('Website review complete.')
          }
        }
      } catch (error) {
        const detail = error instanceof Error ? error.message : 'Could not review that website. Please try again.'
        setErrorMessage('')
        appendMessage(
          'assistant',
          'I couldn’t complete the website review on this attempt. ' + detail + ' The demo can review public webpages when the scan succeeds; this does not mean external websites are unsupported. Please try again in a moment.',
        )
        setStatusMessage('Website review could not be completed. You can retry.')
      } finally {
        setTextRequestPending(false)
      }
      return
    }

    if (textOnlyMode) {
      const history = messages.slice(-12).map((message) => ({
        role: message.role,
        text: message.text,
      }))
      appendMessage('visitor', text)
      setDraft('')
      setErrorMessage('')
      setStatusMessage('Asking Starlight AI…')
      setTextRequestPending(true)

      try {
        const response = await fetch('/api/receptionist-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history }),
          cache: 'no-store',
        })
        const data = await response.json().catch(() => ({})) as { reply?: string; error?: string }
        if (!response.ok) throw new Error(data.error || `Assistant request failed (HTTP ${response.status}).`)
        if (!data.reply) throw new Error('The assistant returned an empty reply. Please try again.')
        appendMessage('assistant', data.reply)
        setStatusMessage('Text chat ready: type another question')
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Could not reach the assistant.')
        setStatusMessage('Text chat request failed. You can retry.')
      } finally {
        setTextRequestPending(false)
      }
      return
    }

    const socket = socketRef.current
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setErrorMessage('The voice connection is not ready. End the chat and reconnect.')
      return
    }
    appendMessage('visitor', text)
    socket.send(JSON.stringify({
      clientContent: {
        turns: [{ role: 'user', parts: [{ text }] }],
        turnComplete: true,
      },
    }))
    setStatusMessage('Thinking…')
    setDraft('')
  }, [appendMessage, messages, status, textOnlyMode, textRequestPending])
  const toggleMute = useCallback(() => {
    const nextMuted = !mutedRef.current
    mutedRef.current = nextMuted
    setMuted(nextMuted)
    setStatusMessage(nextMuted ? 'Microphone muted' : 'Connected. Speak naturally or type below')
  }, [])

  const resetTranscript = useCallback(() => {
    setMessages([])
    setLiveTranscript(null)
    inputDraftRef.current = ''
    outputDraftRef.current = ''
  }, [])

  const connected = status === 'connected'
  const connecting = status === 'connecting'

  return (
    <section className="overflow-hidden rounded-[2rem] border border-border bg-surface/70 shadow-[0_0_70px_-34px_var(--glow)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary"><Bot className="size-5" /></span>
          <div>
            <p className="font-semibold">Starlight AI Receptionist</p>
            <p className="text-xs text-muted-foreground">Starlight AI voice assistant demo</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground">
          <span className={'size-2 rounded-full ' + (connected ? 'bg-emerald-500' : connecting ? 'animate-pulse bg-amber-500' : 'bg-muted-foreground/50')} />
          {connected ? 'Live' : connecting ? 'Connecting' : status === 'error' ? 'Needs attention' : 'Not connected'}
        </div>
      </div>

      <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
        <div className="flex flex-col items-center justify-center border-b border-border px-6 py-9 text-center lg:border-b-0 lg:border-r md:px-10">
          <div className="relative flex size-44 items-center justify-center">
            {connected && <span aria-hidden className="absolute inset-2 rounded-full border border-primary/40 motion-safe:animate-ping" />}
            <div className={'relative flex size-32 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary shadow-[0_0_70px_-24px_var(--glow)] ' + (connected ? 'motion-safe:animate-pulse' : '')}>
              <AudioLines className="size-12" strokeWidth={1.5} />
            </div>
          </div>
          <p className="mt-4 font-display text-2xl font-bold tracking-tight">{connected ? (textOnlyMode ? 'Type to talk.' : 'I’m listening.') : connecting ? 'Connecting…' : 'Talk to our AI.'}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground" aria-live="polite">{statusMessage}</p>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {!connected ? (
              <button type="button" onClick={() => startSession('voice')} disabled={connecting} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60">
                {connecting ? <LoaderCircle className="size-4 animate-spin" /> : <Mic className="size-4" />}
                {connecting ? 'Connecting' : status === 'error' ? 'Try again' : 'Start voice chat'}
              </button>
            ) : (
              <>
                {!textOnlyMode && (
                  <button type="button" onClick={toggleMute} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:border-primary/60">
                    {muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}{muted ? 'Unmute mic' : 'Mute mic'}
                  </button>
                )}
                <button type="button" onClick={endSession} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-500"><X className="size-4" /> End chat</button>
              </>
            )}
            {!connected && (
              <button type="button" onClick={() => startSession('text')} disabled={connecting} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-primary/40 px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:cursor-wait disabled:opacity-60">
                <Send className="size-4" /> Test text chat
              </button>
            )}
          </div>

          {errorMessage && <div role="alert" className="mt-5 max-w-sm rounded-2xl border border-red-500/25 bg-red-500/5 p-4 text-left text-sm leading-relaxed text-muted-foreground">{errorMessage}</div>}
          <div className="mt-7 flex items-start gap-2 text-left text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>Microphone access starts only when you click Start. Don’t share passwords or sensitive personal information.</p>
          </div>
        </div>

        <div className="flex min-h-[460px] flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 md:px-6">
            <div><p className="font-semibold">Conversation</p><p className="text-xs text-muted-foreground">{textOnlyMode ? 'Text-only assistant test. No microphone required.' : 'Voice replies appear here as text when available.'}</p></div>
            <button type="button" onClick={resetTranscript} disabled={messages.length === 0 && !liveTranscript} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40" aria-label="Clear conversation transcript"><RotateCcw className="size-3.5" /> Clear</button>
          </div>

          <div className="min-h-[260px] flex-1 space-y-4 overflow-y-auto px-5 py-5 md:px-6" role="log" aria-live="polite" aria-label="Voice assistant transcript">
            {messages.length === 0 && !liveTranscript && (
              <div className="flex h-full min-h-[230px] flex-col items-center justify-center text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background text-primary"><Sparkles className="size-5" /></span>
                <p className="mt-4 font-semibold">Your conversation starts here</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">Start voice chat with microphone access, or choose Test text chat to try the assistant without a microphone.</p>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={message.role === 'visitor' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={message.role === 'visitor' ? 'max-w-[92%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground' : 'max-w-[92%] rounded-2xl rounded-bl-sm border border-border bg-background px-4 py-3 text-sm leading-relaxed'}>
                  {message.role === 'assistant' && <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">Starlight AI</p>}
                  {message.text}
                </div>
              </div>
            ))}
            {liveTranscript && (
              <div className={liveTranscript.role === 'visitor' ? 'flex justify-end' : 'flex justify-start'}>
                <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-primary/30 bg-background px-4 py-3 text-sm leading-relaxed">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">{liveTranscript.role === 'visitor' ? 'Hearing you…' : 'Speaking…'}</p>
                  {liveTranscript.text}
                </div>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>

          <div className="border-t border-border p-5 md:p-6">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => sendText(suggestion)} disabled={!connected} className="rounded-full border border-border px-3 py-2 text-left text-xs transition-colors hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40">{suggestion}</button>)}
            </div>
            <form onSubmit={(event) => { event.preventDefault(); sendText(draft) }} className="flex items-center gap-2 rounded-2xl border border-border bg-background p-2 pl-4 focus-within:border-primary/60">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={700} disabled={!connected || textRequestPending} placeholder={connected ? (textOnlyMode ? 'Type a message to test the assistant…' : 'Type a message…') : 'Start voice chat to send a message'} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed" aria-label="Message the AI receptionist" />
              <button type="submit" disabled={!connected || !draft.trim() || textRequestPending} aria-label="Send message" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"><Send className="size-4" /></button>
            </form>
            <p className="mt-3 px-1 text-xs leading-relaxed text-muted-foreground">Website review: ask for a review, then paste a public URL here. We inspect one accessible homepage, not the entire site.</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 border-t border-border px-5 py-4 text-xs leading-relaxed text-muted-foreground md:px-7">
        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>This is an illustrative demo, not a deployed business receptionist. It does not book meetings, contact staff, connect to WhatsApp or a CRM, or save the transcript or website snapshot to Starlight AI’s database. Website review inspects one accessible public page; its URL and extracted page text are processed by our AI provider to generate recommendations.</p>
      </div>
    </section>
  )
}
