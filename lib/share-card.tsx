import { ImageResponse } from 'next/og'

export const shareCardSize = { width: 1200, height: 630 } as const
export const shareCardContentType = 'image/png'

export function createShareCard() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
          padding: '58px 68px',
          color: '#f8f8ff',
          background: 'linear-gradient(135deg, #08080f 0%, #111126 55%, #071629 100%)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            right: -80,
            top: -170,
            width: 650,
            height: 650,
            borderRadius: 325,
            background: 'radial-gradient(circle, rgba(70,92,255,0.35) 0%, rgba(44,45,130,0.12) 45%, rgba(8,8,15,0) 72%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            right: 86,
            top: 115,
            width: 305,
            height: 305,
            borderRadius: 44,
            border: '1px solid rgba(139,155,255,0.23)',
            transform: 'rotate(14deg)',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            right: 132,
            top: 160,
            width: 210,
            height: 210,
            borderRadius: 32,
            border: '1px solid rgba(139,155,255,0.28)',
            transform: 'rotate(-12deg)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 700, letterSpacing: -1 }}>
              <span>Starlight </span><span style={{ color: '#8da2ff' }}>AI</span>
            </div>
            <div style={{ display: 'flex', border: '1px solid rgba(141,162,255,0.4)', background: 'rgba(67,83,180,0.12)', color: '#b8c5ff', borderRadius: 999, padding: '8px 14px', fontSize: 12, letterSpacing: 2 }}>
              AI AUTOMATION STUDIO
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 755, gap: 18 }}>
            <div style={{ fontSize: 57, lineHeight: 1.08, fontWeight: 700, letterSpacing: -2 }}>
              Less busywork. More time for real growth.
            </div>
            <div style={{ fontSize: 22, lineHeight: 1.45, color: '#b3b5cc' }}>
              Practical AI workflows for customer enquiries and follow-up.
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {['AI receptionists', 'Website chatbots', 'WhatsApp agents'].map((item) => (
                <div key={item} style={{ display: 'flex', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.04)', color: '#e7e8f5', padding: '10px 14px', fontSize: 14 }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#9fa7c9', fontSize: 18 }}>
            <div style={{ width: 26, height: 2, background: '#8da2ff' }} />
            starlightai.site
          </div>
        </div>
      </div>
    ),
    shareCardSize,
  )
}
