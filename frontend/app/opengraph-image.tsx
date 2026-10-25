import { ImageResponse } from 'next/og';

export const alt = 'Alehu AI — smart child safety systems';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0B3D4A',
          color: '#F7F4EE',
          padding: 72,
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            border: '2px solid #0F7A6C',
            borderRadius: 32,
            padding: 48,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, letterSpacing: 6, color: '#E8A317', textTransform: 'uppercase' }}>
              Alehu AI P.L.C.
            </div>
            <div style={{ fontSize: 68, lineHeight: 1.05, marginTop: 24, maxWidth: 900 }}>
              Safety that protects freedom, not just location.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#E8F6F3' }}>
            <span>Wearable · Edge AI · Guardian alerts</span>
            <span>Addis Ababa</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
