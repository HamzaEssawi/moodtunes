'use client';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        
        :root {
          --green-deep: #15803d;
          --green-light: #dcfce7;
        }
        
        .section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border-radius: 16px;
          background: #f9fafb;
        }
        
        .section h2 {
          color: var(--green-deep);
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
          Privacy Policy
        </h1>
        
        <p style={{ color: '#666', marginBottom: '2rem' }}>Last updated: March 2026</p>

        <div className="section">
          <h2>📊 Data We Collect</h2>
          <ul style={{ lineHeight: '1.8', color: '#4b5563' }}>
            <li>Spotify profile information (email, name, profile picture) when you log in</li>
            <li>Mood descriptions you enter (used only for generating playlists, not stored)</li>
            <li>Playlist data you choose to save to your Spotify account</li>
          </ul>
        </div>

        <div className="section">
          <h2>🔒 How We Use Your Data</h2>
          <ul style={{ lineHeight: '1.8', color: '#4b5563' }}>
            <li>To authenticate you with Spotify</li>
            <li>To generate personalized playlists based on your mood</li>
            <li>To save playlists to your Spotify account when requested</li>
            <li>Never sell your personal information</li>
          </ul>
        </div>

        <div className="section">
          <h2>🔄 Your Rights</h2>
          <p style={{ lineHeight: '1.8', color: '#4b5563' }}>
            You can revoke MoodTunes access to your Spotify account at any time 
            from your Spotify account settings. All mood descriptions are processed 
            in real-time and not stored permanently.
          </p>
        </div>

        <div className="section">
          <h2>📧 Contact</h2>
          <p style={{ lineHeight: '1.8', color: '#4b5563' }}>
            Questions about privacy? Email us at privacy@moodtunes.app
          </p>
        </div>

        <p style={{ 
          marginTop: '2rem', 
          padding: '1rem',
          background: 'var(--green-light)',
          borderRadius: '12px',
          color: 'var(--green-deep)',
          textAlign: 'center'
        }}>
          By using MoodTunes, you agree to this Privacy Policy.
        </p>
      </div>
    </div>
  );
}