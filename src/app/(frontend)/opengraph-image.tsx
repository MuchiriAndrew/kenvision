import { ImageResponse } from 'next/og'

export const alt = 'Kenvision Techniks — training and technical solutions'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 76px', background: '#101817', color: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: '#075e4f', color: '#ffffff', fontSize: 31, fontWeight: 700 }}>K</div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: 27, fontWeight: 800, letterSpacing: -1 }}>KENVISION</span>
          <span style={{ marginTop: 5, color: '#c58b4e', fontSize: 13, fontWeight: 700, letterSpacing: 5 }}>TECHNIKS</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 880 }}>
        <div style={{ width: 88, height: 4, marginBottom: 32, background: '#c58b4e' }} />
        <span style={{ fontSize: 65, fontWeight: 700, lineHeight: 1.12, letterSpacing: -2 }}>Technology, expertise and training that build capability.</span>
        <span style={{ marginTop: 28, color: '#c9d1ce', fontSize: 24 }}>Professional training and technical solutions across East and Southern Africa.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#c9d1ce', fontSize: 17 }}>
        <span>kenvision.mkbuilds.live</span><span style={{ color: '#c58b4e' }}>·</span><span>Nairobi, Kenya</span>
      </div>
    </div>,
    size,
  )
}
