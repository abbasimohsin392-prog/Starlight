import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Starlight AI | AI Automation Agency'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: 'radial-gradient(circle at 80% 20%, rgba(91,108,255,0.35), transparent 45%), #0b0b12',
        color: 'white',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <svg width="72" height="72" viewBox="0 0 64 64" fill="none">
          <path
            d="M44 18c-3-3.5-8-5.5-13.5-5.5C21 12.5 15 17.5 15 24.5c0 6.5 5 9.5 13 11.5l6 1.5c6 1.5 8.5 3 8.5 6 0 3.5-3.5 6-9.5 6-5 0-9.5-2-12.5-5.5"
            stroke="#6d7cff"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path d="M50 8l1.6 4.4L56 14l-4.4 1.6L50 20l-1.6-4.4L44 14l4.4-1.6L50 8z" fill="#7dd3fc" />
        </svg>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Starlight AI</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4, maxWidth: 1000 }}>
          Your business, running on autopilot.
        </div>
        <div style={{ fontSize: 30, color: '#a3a7c2', maxWidth: 900 }}>
          AI receptionists, chatbots, WhatsApp agents & custom automation, live 24/7.
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#6d7cff' }}>
        <span>starlightai.site</span>
        <span>AI Automation Agency</span>
      </div>
    </div>,
    size,
  )
}
