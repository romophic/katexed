import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Katexed - Online LaTeX Editor';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #4f46e5, #9333ea)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
            }}
        >
             {/* Simple Sigma Symbol simulation since we can't easily import lucide icon into edge runtime without raw svg */}
             <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ color: 'white' }}>
                <path d="M18 7c0-1.1-.9-2-2-2H4l8 7-8 7h12c1.1 0 2-.9 2-2v-2" />
             </svg>
        </div>
        <h1 style={{ fontSize: '80px', fontWeight: 'bold', margin: 0, letterSpacing: '-2px' }}>Katexed</h1>
        <p style={{ fontSize: '32px', marginTop: '20px', opacity: 0.9 }}>Fast Online LaTeX Editor</p>
      </div>
    ),
    {
      ...size,
    }
  );
}
