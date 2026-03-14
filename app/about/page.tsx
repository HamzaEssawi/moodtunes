'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        
        :root {
          --green-deep: #15803d;
          --green-mid: #22c55e;
          --green-light: #dcfce7;
          --green-pale: #f0fdf4;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, var(--green-pale), white);
        }
        
        .card {
          background: white;
          border: 1px solid var(--green-light);
          border-radius: 24px;
          padding: 2rem;
          transition: transform 0.2s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(34,197,94,0.15);
        }
        
        .team-member {
          text-align: center;
          padding: 1.5rem;
          border-radius: 16px;
          background: var(--green-pale);
        }
        
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--green-deep), var(--green-mid));
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          font-weight: bold;
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
          marginBottom: '2rem'
        }}>
          About MoodTunes
        </h1>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--green-deep)', marginBottom: '1rem' }}>Our Story</h2>
          <p style={{ lineHeight: '1.8', color: '#4b5563' }}>
            MoodTunes was born from a simple idea: music should match how you feel. 
            Founded in 2025, we've helped over 100,000 people discover the perfect 
            soundtrack for every moment using cutting-edge AI technology.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card">
            <h3 style={{ color: 'var(--green-deep)', marginBottom: '0.5rem' }}>🎯 Our Mission</h3>
            <p style={{ color: '#4b5563' }}>To connect people with music that truly resonates with their emotions.</p>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--green-deep)', marginBottom: '0.5rem' }}>🌟 Our Vision</h3>
            <p style={{ color: '#4b5563' }}>A world where everyone can find the perfect song for every feeling.</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--green-deep)', marginBottom: '1.5rem' }}>Meet the Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {['AS', 'JD', 'MK'].map((initials, i) => (
              <div key={i} className="team-member">
                <div className="avatar">{initials}</div>
                <h4 style={{ margin: '0.5rem 0 0.2rem' }}>Team Member</h4>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>Founder</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, var(--green-deep), var(--green-mid))',
          borderRadius: '24px',
          padding: '2rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Join Our Journey</h3>
          <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>Be part of the music revolution</p>
          <Link href="/" style={{
            background: 'white',
            color: 'var(--green-deep)',
            padding: '0.75rem 2rem',
            borderRadius: '100px',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}