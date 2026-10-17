// Client implementation of the live voice receptionist. See docs/ai-receptionist-demo.md for server setup.
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AudioLines,
  Bot,
  Check,
  LoaderCircle,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error'
type TranscriptMessage = {
  id: string
  role: 'visitor' | 'assistant'
  text: string
}
type RealtimeEvent = {
  type?: string
  transcript?: string
  delta?: string
  error?: { message?: string }
}

const suggestions = [
  'What does Starlight AI do?',
  'Tell me about AI receptionists.',
  'How does pricing work?',
  'Can you automate WhatsApp enquiries?',
]

function waitForIceGatheringComplete(peer: RTCPeerConnection) {
  if (peer.iceGatheringState === 'complete') return Promise.resolve()

  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      peer.removeEventListener('icegatheringstatechange', onStateChange)
      reject(new Error('The voice connection took too long to prepare. Please try again.'))
    }, 10000)

    function onStateChange() {
      if (peer.iceGatheringState !== 'complete') return
      window.clearTimeout(timeout)
      peer.removeEventListener('icegatheringstatechange', onStateChange)
      resolve()
    }

    peer.addEventListener('icegatheringstatechange', onStateChange)
    onStateChange()
  })
}

export function VoiceReceptionist() {
  const [status, setStatus] = useState<ConnectionStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('Ready when you are')
  const [errorMessage, setErrorMessage] = useState('')
  const [muted, setMuted] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<TranscriptMessage[]>([])
  const [liveTranscript, setLiveTranscript] = useState('')
  const peerRef = useRef<RTCPeerConnection | null>(null)
  const channelRef = useRef<RTCDataChannel | null>(null)
  const microphoneRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const messageIdRef = useRef(0)
  const assistantDraftRef = useRef('')
  const transcriptEndRef = useRef<HTMLDivElement | null>(null)

  const appendMessage = useCallback((role: TranscriptMessage['role'], value: string) => {
    const text = value.trim()
    if (!text) return
    const id = String(Date.now()) + '-' + String(++messageIdRef.current)
    setMessages((current) => {
      const last = current[current.length - 1]
      if (last && last.role === role && last.text === text) return current
      return [...current, { id, role, text }].slice(-40)
    })
  }, [])

  const cleanupSession = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.onopen = null
      channelRef.current.onmessage = null
      channelRef.current.close()
      channelRef.current = null
    }
    if (peerRef.current) {
      peerRef.current.ontrack = null
      peerRef.current.onconnectionstatechange = null
      peerRef.current.close()
      peerRef.current = null
    }
    microphoneRef.current?.getTracks().forEach((track) => track.stop())
    microphoneRef.current = null
    if (audioRef.current) audioRef.current.srcObject = null
    assistantDraftRef.current = ''
    setLiveTranscript('')
  }, [])

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

  const startSession = useCallback(async () => {
    cleanupSession()
    setStatus('connecting')
    setStatusMessage('Allow microphone access to connect')
    setErrorMessage('')
    setMuted(false)

    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.RTCPeerConnection) {
        throw new Error('Live voice is not supported in this browser. Try a recent version of Chrome or Edge.')
      }

      const peer = new RTCPeerConnection()
      peerRef.current = peer

      peer.onconnectionstatechange = () => {
        if (peer.connectionState === 'failed') {
          setStatus('error')
          setErrorMessage('The voice connection was interrupted. Please start a new session.')
          setStatusMessage('Connection interrupted')
        }
      }

      peer.ontrack = (event) => {
        const audio = audioRef.current
        if (!audio) return
        audio.srcObject = event.streams[0] || new MediaStream([event.track])
        void audio.play().catch(() => {
          setStatusMessage('Connected — use your browser audio controls if you cannot hear the assistant')
        })
      }

      const microphone = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })
      microphoneRef.current = microphone
      microphone.getAudioTracks().forEach((track) => peer.addTrack(track, microphone))

      const channel = peer.createDataChannel('oai-events')
      channelRef.current = channel

      channel.onopen = () => {
        setStatus('connected')
        setStatusMessage('Connected — speak naturally or type below')
        channel.send(JSON.stringify({
          type: 'response.create',
          response: {
            instructions: 'Greet the visitor warmly in one or two sentences as Starlight AI’s demo receptionist. Invite them to ask about the agency’s AI services. Remind them naturally that this is a demo if relevant.',
          },
        }))
      }

      channel.onmessage = (event: MessageEvent<string>) => {
        let payload: RealtimeEvent
        try {
          payload = JSON.parse(event.data) as RealtimeEvent
        } catch {
          return
        }

        const type = payload.type || ''
        if (type === 'conversation.item.input_audio_transcription.completed') {
          appendMessage('visitor', payload.transcript || '')
        } else if (
          type === 'response.output_audio_transcript.delta' ||
          type === 'response.audio_transcript.delta'
        ) {
          assistantDraftRef.current += payload.delta || ''
          setLiveTranscript(assistantDraftRef.current)
        } else if (
          type === 'response.output_audio_transcript.done' ||
          type === 'response.audio_transcript.done'
        ) {
          const finalText = payload.transcript || assistantDraftRef.current
          appendMessage('assistant', finalText)
          assistantDraftRef.current = ''
          setLiveTranscript('')
          setStatusMessage('Connected — speak naturally or type below')
        } else if (type === 'input_audio_buffer.speech_started') {
          setStatusMessage('Listening — go ahead')
        } else if (type === 'input_audio_buffer.speech_stopped') {
          setStatusMessage('Thinking…')
        } else if (type === 'error') {
          setErrorMessage(payload.error?.message || 'The voice service returned an error. Please try again.')
        }
      }

      const offer = await peer.createOffer()
      await peer.setLocalDescription(offer)
      await waitForIceGatheringComplete(peer)

      const sdp = peer.localDescription?.sdp
      if (!sdp) throw new Error('The browser could not prepare a microphone connection.')

      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sdp }),
      })

      if (!response.ok) {
        const responseText = await response.text()
        let message = 'The voice session could not be started. Please try again.'
        try {
          const details = JSON.parse(responseText) as { error?: string }
          if (details.error) message = details.error
        } catch {
          // Keep the public-facing fallback message if the server response is not JSON.
        }
        throw new Error(message)
      }

      const answer = await response.text()
      await peer.setRemoteDescription({ type: 'answer', sdp: answer })
    } catch (error) {
      cleanupSession()
      setStatus('error')
      setStatusMessage('Voice session unavailable')
      setErrorMessage(error instanceof Error ? error.message : 'Could not start the voice assistant.')
    }
  }, [appendMessage, cleanupSession])

  const sendText = useCallback((value: string) => {
    const text = value.trim()
    const channel = channelRef.current
    if (!text || status !== 'connected' || !channel || channel.readyState !== 'open') return

    appendMessage('visitor', text)
    channel.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }],
      },
    }))
    channel.send(JSON.stringify({ type: 'response.create' }))
    setStatusMessage('Thinking…')
    setDraft('')
  }, [appendMessage, status])

  const toggleMute = useCallback(() => {
    const nextMuted = !muted
    microphoneRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted
    })
    setMuted(nextMuted)
    setStatusMessage(nextMuted ? 'Microphone muted' : 'Connected — speak naturally or type below')
  }, [muted])

  const resetTranscript = useCallback(() => {
    setMessages([])
    setLiveTranscript('')
    assistantDraftRef.current = ''
  }, [])

  const connected = status === 'connected'
  const connecting = status === 'connecting'

  return (
    <section className="overflow-hidden rounded-[2rem] border border-border bg-surface/70 shadow-[0_0_70px_-34px_var(--glow)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Bot className="size-5" />
          </span>
          <div>
            <p className="font-semibold">Starlight AI Receptionist</p>
            <p className="text-xs text-muted-foreground">Live voice conversation demo</p>
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
          <p className="mt-4 font-display text-2xl font-bold tracking-tight">
            {connected ? 'I’m listening.' : connecting ? 'Connecting…' : 'Talk to our AI.'}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground" aria-live="polite">
            {statusMessage}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {!connected ? (
              <button type="button" onClick={startSession} disabled={connecting} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60">
                {connecting ? <LoaderCircle className="size-4 animate-spin" /> : <Mic className="size-4" />}
                {connecting ? 'Connecting' : status === 'error' ? 'Try again' : 'Start voice chat'}
              </button>
            ) : (
              <>
                <button type="button" onClick={toggleMute} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:border-primary/60">
                  {muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                  {muted ? 'Unmute mic' : 'Mute mic'}
                </button>
                <button type="button" onClick={endSession} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-500">
                  <X className="size-4" /> End chat
                </button>
              </>
            )}
          </div>

          {errorMessage && (
            <div role="alert" className="mt-5 max-w-sm rounded-2xl border border-red-500/25 bg-red-500/5 p-4 text-left text-sm leading-relaxed text-muted-foreground">
              {errorMessage}
            </div>
          )}

          <div className="mt-7 flex items-start gap-2 text-left text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>Microphone access starts only when you click Start. Don’t share passwords or sensitive personal information.</p>
          </div>
        </div>

        <div className="flex min-h-[460px] flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 md:px-6">
            <div>
              <p className="font-semibold">Conversation</p>
              <p className="text-xs text-muted-foreground">Voice replies appear here as text when available.</p>
            </div>
            <button type="button" onClick={resetTranscript} disabled={messages.length === 0 && !liveTranscript} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40" aria-label="Clear conversation transcript">
              <RotateCcw className="size-3.5" /> Clear
            </button>
          </div>

          <div className="min-h-[260px] flex-1 space-y-4 overflow-y-auto px-5 py-5 md:px-6" role="log" aria-live="polite" aria-label="Voice assistant transcript">
            {messages.length === 0 && !liveTranscript && (
              <div className="flex h-full min-h-[230px] flex-col items-center justify-center text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background text-primary">
                  <Sparkles className="size-5" />
                </span>
                <p className="mt-4 font-semibold">Your conversation starts here</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">Start the voice chat, allow microphone access, then speak normally. You can also type a question.</p>
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
              <div className="flex justify-start">
                <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-primary/30 bg-background px-4 py-3 text-sm leading-relaxed">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">Speaking…</p>
                  {liveTranscript}
                </div>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>

          <div className="border-t border-border p-5 md:p-6">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => sendText(suggestion)} disabled={!connected} className="rounded-full border border-border px-3 py-2 text-left text-xs transition-colors hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40">
                  {suggestion}
                </button>
              ))}
            </div>
            <form onSubmit={(event) => { event.preventDefault(); sendText(draft) }} className="flex items-center gap-2 rounded-2xl border border-border bg-background p-2 pl-4 focus-within:border-primary/60">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={700} disabled={!connected} placeholder={connected ? 'Type a message…' : 'Start voice chat to send a message'} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed" aria-label="Message the AI receptionist" />
              <button type="submit" disabled={!connected || !draft.trim()} aria-label="Send message" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40">
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 border-t border-border px-5 py-4 text-xs leading-relaxed text-muted-foreground md:px-7">
        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>This is an illustrative demo, not a deployed business receptionist. It does not book meetings, contact staff, connect to WhatsApp or a CRM, or save this transcript to Starlight AI’s database. Audio is sent to the live voice provider to generate responses.</p>
      </div>
      <audio ref={audioRef} autoPlay playsInline className="sr-only" aria-label="AI receptionist voice response" />
    </section>
  )
}
