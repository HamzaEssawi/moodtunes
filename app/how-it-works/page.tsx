'use client';
import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Describe Your Mood',
      description: 'Type how you feel in natural language. Be as specific or as vague as you want.',
      example: '"feeling nostalgic about summer road trips"',
      icon: '📝'
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our AI analyzes your text for emotional tone, energy level, and contextual cues.',
      example: 'Energy: Medium-High • Vibe: Nostalgic • Genre: Indie Pop',
      icon: '🤖'
    },
    {
      number: '03',
      title: 'Song Generation',
      description: 'We generate 10 songs that perfectly match your mood, with explanations for each choice.',
      example: 'Golden Hour - JVKE (captures that warm sunset feeling)',
      icon: '🎵'
    },
    {
      number: '04',
      title: 'Save to Spotify',
      description: 'Preview songs, select your favorites, and save them as a playlist with one click.',
      example: 'Playlist appears instantly in your Spotify library',
      icon: '💾'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        
        :root {
          --green-deep: #15803d;
          --green-mid: #22c55e;
          --green-light: #dcfce7;
        }
        
        .step-card {
          display: flex;
          gap: 2rem;
          padding: 2rem;
          border-radius: 24px;
          background: white;
          border: 1px solid var(--green-light);
          transition: all 0.3s;
          margin-bottom: 1.5rem;
        }
        
        .step-card:hover {
          box-shadow: 0 12px 24px rgba(34,197,94,0.1);
          transform: translateX(10px);
        }
        
        .step-number {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: bold;
          color: var(--green-light);
          line-height: 1;
          min-width: 80px;
        }
        
        .example-box {
          background: var(--green-light);
          padding: 1rem;
          border-radius: 12px;
          margin-top: 1rem;
          font-family: monospace;
          color: var(--green-deep);
        }
        
        .icon-circle {
          width: 48px;
          height: 48px;
          background: var(--green-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
      `}</style>

      {/* Simple Nav */}
      <nav style={{ 
        padding: '1rem 2rem', 
        borderBottom: '1px solid var(--green-light)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ 
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.4rem',
          fontStyle: 'italic',
          color: 'var(--green-deep)',
          textDecoration: 'none'
        }}>
          MoodTunes
        </Link>
        <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>
          ← Back
        </Link>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 style={{ 
          fontFamily: "'Playfair Display', serif",
          fontSize: '3rem',
          fontStyle: 'italic',
          color: 'var(--green-deep)',
          marginBottom: '1rem'
        }}>
          How It Works
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
          Four simple steps to your perfect mood-based playlist
        </p>

        {steps.map((step) => (
          <div key={step.number} className="step-card">
            <div className="step-number">{step.number}</div>
            <div style={{ flex: 1 }}>
              <div className="icon-circle">{step.icon}</div>
              <h2 style={{ color: 'var(--green-deep)', marginBottom: '0.5rem' }}>{step.title}</h2>
              <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '1rem' }}>
                {step.description}
              </p>
              <div className="example-box">
                <strong>Example:</strong> {step.example}
              </div>
            </div>
          </div>
        ))}

        <div style={{ 
          marginTop: '3rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, var(--green-light), white)',
          borderRadius: '24px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'var(--green-deep)', marginBottom: '1rem' }}>Ready to try it?</h3>
          <Link href="/" style={{
            background: 'var(--green-deep)',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '100px',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Generate Your First Playlist
          </Link>
        </div>
      </div>
    </div>
  );
}