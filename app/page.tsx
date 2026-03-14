'use client';
import { useState, useRef, useEffect } from "react";
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import MoodOrb from '@/components/MoodOrb';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  previewUrl?: string | null;
  spotifyUrl?: string | null;
  uri?: string | null;
  uniqueId?: string;
}

const MOODS = [
  { label: "summer nostalgia", emoji: "🍊", color: "#f97316" },
  { label: "study focus", emoji: "📚", color: "#8b5cf6" },
  { label: "gym energy", emoji: "⚡", color: "#ef4444" },
  { label: "rainy day", emoji: "🌧", color: "#60a5fa" },
  { label: "late night", emoji: "🌙", color: "#312e81" },
  { label: "beach vibes", emoji: "🌊", color: "#fbbf24" },
  { label: "romantic", emoji: "💕", color: "#ec4899" },
  { label: "workout", emoji: "🔥", color: "#f97316" },
];

const EXAMPLE_TRACKS = [
  { id: 'ex1', title: "Golden Hour", artist: "JVKE", duration: "3:23", cover: "🌅" },
  { id: 'ex2', title: "Summertime Magic", artist: "Childish Gambino", duration: "3:44", cover: "✨" },
  { id: 'ex3', title: "Peaches", artist: "Justin Bieber", duration: "3:18", cover: "🍑" },
  { id: 'ex4', title: "Heat Waves", artist: "Glass Animals", duration: "3:59", cover: "🌊" },
  { id: 'ex5', title: "Stay", artist: "The Kid LAROI", duration: "2:21", cover: "💫" },
  { id: 'ex6', title: "Levitating", artist: "Dua Lipa", duration: "3:23", cover: "🪐" },
  { id: 'ex7', title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", cover: "💜" },
  { id: 'ex8', title: "Save Your Tears", artist: "The Weeknd", duration: "3:35", cover: "🌙" },
];

export default function MoodTunes() {
  const { data: session } = useSession();


useEffect(() => {
  console.log('🔍 SESSION DEBUG:');
  console.log('  - Session exists:', !!session);
  
  if (session) {
    console.log('  - User name:', session.user?.name);
    console.log('  - User email:', session.user?.email);
    console.log('  - Has accessToken:', !!session.accessToken);
    console.log('  - Token preview:', session.accessToken ? session.accessToken.substring(0, 20) + '...' : 'none');
    console.log('  - Expires at:', session.expiresAt ? new Date(session.expiresAt * 1000).toLocaleString() : 'unknown');
  } else {
    console.log('  - No session found - user needs to login');
  }
}, [session]);

  const [mood, setMood] = useState("");
  const [currentMood, setCurrentMood] = useState("");
  const [currentColor, setCurrentColor] = useState('#22c55e'); // Track color here
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlist, setPlaylist] = useState<Track[] | null>(null);
  const [playlistName, setPlaylistName] = useState("");
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [playlistKey, setPlaylistKey] = useState(0);

  const handleMoodClick = (label: string) => {
    const moodText = `feeling ${label} vibes`;
    setMood(moodText);
    setCurrentMood(moodText);
    setActiveMood(label);
    setCharCount(moodText.length);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMood(e.target.value);
    setCurrentMood(e.target.value);
    setCharCount(e.target.value.length);
    setActiveMood(null);
  };

  const handleGenerate = async () => {
  if (!mood.trim()) {
    alert('Please describe your mood first');
    return;
  }
  
  if (!session) {
    signIn('spotify', { callbackUrl: '/' });
    return;
  }
  
  setIsGenerating(true);
  
  try {
    console.log('Generating for mood:', mood);
    
    const response = await fetch('/api/search-spotify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mood })
    });

    const data = await response.json();
    console.log('API response:', data);

    if (!response.ok) {
      if (response.status === 401) {
        alert('Spotify session expired. Please log in again.');
        signIn('spotify', { callbackUrl: '/' });
        return;
      }
      throw new Error(data.error || 'Failed to search Spotify');
    }

    if (!data.tracks || data.tracks.length === 0) {
      console.log('No tracks found, using examples');
      setPlaylist(EXAMPLE_TRACKS);
      setPlaylistName(`🎵 ${mood.slice(0, 30)}... Mix`);
    } else {
      console.log(`Found ${data.tracks.length} tracks`);
      setPlaylist(data.tracks);
      setPlaylistName(`🎵 ${mood.slice(0, 30)}... Mix`);
    }
    
  } catch (error: any) {
    console.error('Generation error:', error);
    alert('Error searching Spotify. Using example tracks.');
    setPlaylist(EXAMPLE_TRACKS);
    setPlaylistName(`🎵 ${mood.slice(0, 30)}... Mix`);
  } finally {
    setIsGenerating(false);
  }
};

const handleRefresh = async () => {
  if (!mood.trim() && !currentMood) {
    console.log('No mood to refresh');
    return;
  }
  
  setIsGenerating(true);
  
  try {
    const searchMood = mood || currentMood;
    console.log('Refreshing with mood:', searchMood);
    
    const response = await fetch('/api/search-spotify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchMood })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        alert('Session expired. Please login again.');
        signIn('spotify', { callbackUrl: '/' });
        return;
      }
      throw new Error(data.error || 'Failed to refresh');
    }

    if (data.tracks && data.tracks.length > 0) {
      // Create new array with timestamp to force update
      const newTracks = data.tracks.map((track: any, index: number) => ({
        ...track,
        uniqueId: `${track.id}-${Date.now()}-${index}`
      }));
      
      setPlaylist(newTracks);
      setPlaylistKey(prev => prev + 1);
      
      // 👇 PUT THE REFRESH ANIMATION CODE HERE
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
      // 👆
      
      // Force re-mount of playlist section
      setPlaylistKey(prev => prev + 1);
      
    } else {
      // Shuffle example tracks
      const shuffled = [...EXAMPLE_TRACKS]
        .sort(() => Math.random() - 0.5)
        .map((track, index) => ({
          ...track,
          uniqueId: `example-${Date.now()}-${index}`
        }));
      setPlaylist(shuffled);
      
      // 👇 AND HERE FOR FALLBACK
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
      // 👆
      
      setPlaylistKey(prev => prev + 1);
    }
    
  } catch (error) {
    console.error('Refresh error:', error);
    // Shuffle example tracks
    const shuffled = [...EXAMPLE_TRACKS]
      .sort(() => Math.random() - 0.5)
      .map((track, index) => ({
        ...track,
        uniqueId: `example-${Date.now()}-${index}`
      }));
    setPlaylist(shuffled);
    
    // 👇 AND HERE FOR ERROR CASE
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
    // 👆
    
    setPlaylistKey(prev => prev + 1);
    
  } finally {
    setIsGenerating(false);
  }
};

  const handleLogin = () => {
    signIn('spotify', { callbackUrl: '/' });
  };

  const playPreview = (track: any, index: number) => {
    if (!track.previewUrl) return;
    
    if (currentPlaying === index) {
      setCurrentPlaying(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(track.previewUrl);
      audioRef.current = audio;
      audio.play();
      setCurrentPlaying(index);
      audio.onended = () => {
        setCurrentPlaying(null);
        audioRef.current = null;
      };
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Add this useEffect to update scrollbar color dynamically
useEffect(() => {
  // Create or update style element for scrollbar
  let styleEl = document.getElementById('dynamic-scrollbar');
  
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dynamic-scrollbar';
    document.head.appendChild(styleEl);
  }
  
  // Update the style content with current color
  styleEl.innerHTML = `
    ::-webkit-scrollbar-thumb {
      background: ${currentColor} !important;
      border-radius: 10px;
      transition: background 0.3s ease;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: ${currentColor}dd !important;
    }
    * {
      scrollbar-color: ${currentColor} #f1f1f1 !important;
    }
  `;
  
  // Cleanup on unmount
  return () => {
    const styleToRemove = document.getElementById('dynamic-scrollbar');
    if (styleToRemove) {
      styleToRemove.remove();
    }
  };
}, [currentColor]); // Re-run whenever currentColor changes

  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

  * { box-sizing: border-box; }

  :root {
    --green-deep: #15803d;
    --green-mid: #22c55e;
    --green-light: #dcfce7;
    --green-pale: #f0fdf4;
    --green-muted: #86efac;
    --white: #ffffff;
    --gray-soft: #f8fafc;
    --gray-text: #374151;
    --gray-muted: #9ca3af;
    --border: #e5e7eb;
  }

  body { 
    margin: 0; 
    background: var(--white); 
  }

  /* Base scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-style: italic;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo-dot {
    width: 8px;
    height: 8px;
    background: var(--green-mid);
    border-radius: 50%;
    display: inline-block;
  }

  .gradient-text {
    background: linear-gradient(135deg, #15803d, #22c55e, #86efac);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-link {
    color: #4b5563;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;
    cursor: pointer;
  }

  .nav-link:hover {
    color: #15803d;
  }

  .privacy-link {
    color: #9ca3af;
    text-decoration: none;
    font-size: 0.8rem;
    transition: color 0.2s;
  }

  .privacy-link:hover {
    color: #15803d;
  }

  .btn-spotify {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #1db954;
    color: white;
    border: none;
    border-radius: 100px;
    padding: 0.5rem 1.2rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .btn-spotify:hover {
    background: #1aa34a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(29,185,84,0.3);
  }

  .hero {
    background: linear-gradient(160deg, var(--green-pale) 0%, var(--white) 60%);
    padding: 3rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%);
    border-radius: 50%;
    top: -200px;
    right: -200px;
    z-index: 0;
  }

  .hero-glow-2 {
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(134,239,172,0.15) 0%, transparent 70%);
    border-radius: 50%;
    bottom: -200px;
    left: -200px;
    z-index: 0;
  }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border-radius: 100px;
    padding: 0.3rem 0.9rem;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.03em;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-style: italic;
    color: #111827;
    line-height: 1.1;
    margin: 1rem 0;
    position: relative;
    z-index: 1;
  }

  .hero-title span {
    transition: color 0.3s ease;
  }

  .hero-subtitle {
    color: var(--gray-muted);
    font-size: 1.05rem;
    font-weight: 400;
    margin: 1.5rem auto 2rem;
    max-width: 480px;
    position: relative;
    z-index: 1;
  }

  .input-card {
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    max-width: 680px;
    margin: 2rem auto;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
    transition: all 0.2s;
    position: relative;
    z-index: 2;
  }

  .input-card:focus-within {
    box-shadow: 0 4px 24px rgba(34,197,94,0.12), 0 1px 3px rgba(0,0,0,0.04);
  }

  .mood-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    font-family: inherit;
    font-size: 1rem;
    color: var(--gray-text);
    background: transparent;
    line-height: 1.6;
    min-height: 80px;
  }

  .mood-textarea::placeholder {
    color: #d1d5db;
  }

  .input-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid;
    transition: border-color 0.3s ease;
  }

  .char-count {
    font-size: 0.78rem;
    color: var(--gray-muted);
  }

  .btn-generate {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    border: none;
    border-radius: 100px;
    padding: 0.65rem 1.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .btn-generate:hover:not(:disabled) {
    filter: brightness(0.9);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }

  .btn-generate:disabled {
    background: #d1d5db !important;
    cursor: not-allowed;
  }

  .btn-generate.loading {
    background: var(--green-mid);
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .mood-chips-section {
    max-width: 680px;
    margin: 1.5rem auto 0;
    position: relative;
    z-index: 1;
  }

  .chips-label {
    font-size: 0.8rem;
    color: var(--gray-muted);
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .mood-chip {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: white;
    border: 1.5px solid var(--border);
    border-radius: 100px;
    padding: 0.4rem 0.9rem;
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--gray-text);
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }

  .mood-chip:hover {
    border-color: var(--green-mid);
    color: var(--green-deep);
    background: var(--green-pale);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(34,197,94,0.15);
  }

  .mood-chip.active {
    transition: all 0.3s ease;
  }

  .section {
    max-width: 760px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  .section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-style: italic;
    color: #111827;
    margin: 0;
  }

  .playlist-meta {
    font-size: 0.82rem;
    color: var(--gray-muted);
  }

  .playlist-card {
    background: var(--green-pale);
    border: 1.5px solid var(--green-light);
    border-radius: 20px;
    overflow: hidden;
  }

  .playlist-header-bar {
    padding: 1.5rem;
    color: white;
    transition: background 0.3s ease;
  }

  .playlist-header-bar h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 600;
    opacity: 0.85;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    font-size: 0.75rem;
  }

  .playlist-name {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 1.3rem;
    margin: 0;
    opacity: 0.95;
  }

  .track-list {
    padding: 0.5rem;
  }

  .track-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .track-item:hover {
    background: var(--green-light);
  }

  .track-item.playing {
    background: var(--green-light);
  }

  .track-num {
    width: 20px;
    text-align: center;
    font-size: 0.82rem;
    color: var(--gray-muted);
    flex-shrink: 0;
  }

  .track-cover {
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  }

  .track-info {
    flex: 1;
    min-width: 0;
  }

  .track-title {
    font-size: 0.9rem;
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .track-artist {
    font-size: 0.8rem;
    color: var(--gray-muted);
  }

  .track-duration {
    font-size: 0.8rem;
    color: var(--gray-muted);
    flex-shrink: 0;
  }

  .play-icon {
    color: var(--green-deep);
    font-size: 1rem;
  }

  .save-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: white;
    border: 1.5px solid;
    border-radius: 100px;
    padding: 0.6rem 1.4rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
    margin: 1.5rem auto 0;
  }

  .save-btn:hover {
    color: white !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  }

  .login-prompt {
    background: linear-gradient(135deg, var(--green-pale) 0%, white 100%);
    border: 1.5px solid var(--green-light);
    border-radius: 24px;
    padding: 3.5rem 2rem;
    text-align: center;
    margin: 4rem auto;
    max-width: 520px;
  }

  .login-icon {
    width: 64px;
    height: 64px;
    background: var(--green-light);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    font-size: 1.8rem;
  }

  .login-title {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 1.6rem;
    color: #111827;
    margin: 0 0 0.75rem;
  }

  .login-sub {
    color: var(--gray-muted);
    font-size: 0.95rem;
    margin: 0 0 2rem;
    line-height: 1.6;
  }

  .footer {
    border-top: 1px solid var(--border);
    padding: 2rem;
    text-align: center;
  }

  .footer-text {
    font-size: 0.82rem;
    color: var(--gray-muted);
    margin: 0 0 0.4rem;
  }

  .footer-powered {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.78rem;
    color: #d1d5db;
  }

  .footer-dot {
    width: 3px;
    height: 3px;
    background: #d1d5db;
    border-radius: 50%;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-in {
    animation: fadeIn 0.4s ease forwards;
  }

  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
    50% { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
  }

  .track-item.playing .track-cover {
    animation: pulse-green 1.5s ease infinite;
  }

  .animation-delay-200 {
    animation-delay: 200ms;
  }

  .animation-delay-400 {
    animation-delay: 400ms;
  }

  @keyframes ping {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  .animate-ping {
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  @keyframes ripple {
    0% { transform: scale(1); opacity: 0.3; }
    100% { transform: scale(1.5); opacity: 0; }
  }

.refresh-btn {
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  transform: rotate(180deg);
  transition: transform 0.5s ease;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.refresh-btn:active svg {
  animation: spin 0.5s ease;
}

@keyframes refreshFlash {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.98); }
  100% { opacity: 1; transform: scale(1); }
}

.playlist-card.refreshing {
  animation: refreshFlash 0.5s ease;
}

`}</style>

      {/* NAV */}
      <nav className="nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div className="logo">
            <span className="logo-dot" />
            <span className="gradient-text">
              MoodTunes
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/how-it-works" className="nav-link">
              How it works
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/privacy" className="privacy-link">
            Privacy
          </Link>
          
          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ 
                width: 36, 
                height: 36, 
                borderRadius: "50%", 
                background: "linear-gradient(135deg, #15803d, #22c55e)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: "0.9rem", 
                color: "white", 
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(34,197,94,0.3)'
              }}>
                {session.user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          ) : (
            <button className="btn-spotify" onClick={handleLogin}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Login with Spotify
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-glow-2" />
        
        <div 
          className="hero-eyebrow"
          style={{ 
            backgroundColor: `${currentColor}20`,
            color: currentColor 
          }}
        >
          <span>🎵</span>
          AI-powered mood playlists
        </div>
        
        <h1 className="hero-title">
          Music that <span style={{ color: currentColor }}>feels</span><br/>like you do
        </h1>
        
        <p className="hero-subtitle">
          Describe how you feel in your own words — we'll create the perfect Spotify playlist for the moment.
        </p>

        {/* INPUT CARD */}
<div 
  className="input-card"
  style={{
    border: '1.5px solid transparent',
    background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, ${currentColor}, ${currentColor}dd, ${currentColor}99) border-box`,
  }}
>
  <textarea
    ref={textareaRef}
    className="mood-textarea"
    value={mood}
    onChange={handleTextChange}
    placeholder="Describe your mood... (e.g., 'feeling nostalgic about summer road trips, windows down, no worries')"
    maxLength={280}
    rows={3}
  />
  
  {/* Updated footer with color-changing border */}
  <div 
    className="input-footer"
    style={{ borderTopColor: `${currentColor}40` }}
  >
    <span className="char-count">{charCount}/280</span>
    <button
      className={`btn-generate ${isGenerating ? "loading" : ""}`}
      onClick={session ? handleGenerate : handleLogin}
      disabled={isGenerating}
      style={{
        background: `linear-gradient(135deg, ${currentColor}, ${currentColor}dd)`,
      }}
    >
      {isGenerating ? (
        <>
          <div className="spinner" />
          Crafting playlist...
        </>
      ) : session ? (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Generate playlist
        </>
      ) : (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Connect Spotify
        </>
      )}
    </button>
  </div>
</div>

        {/* MOOD CHIPS */}
        <div className="mood-chips-section">
          <p className="chips-label">Try these moods</p>
          <div className="chips-row">
            {MOODS.map((m) => (
              <button
                key={m.label}
                className={`mood-chip ${activeMood === m.label ? "active" : ""}`}
                onClick={() => handleMoodClick(m.label)}
                style={activeMood === m.label ? { 
                  borderColor: currentColor,
                  backgroundColor: `${currentColor}20`,
                  color: currentColor 
                } : {}}
              >
                <span>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PLAYLIST RESULT */}
{playlist && (
  <section 
    key={playlistKey}  // 👈 ADD THIS LINE
    className="section animate-in"
  >
    {/* Mood Orb moved above playlist */}
    <div className="mb-8 flex justify-center">
      <MoodOrb 
        mood={currentMood} 
        isActive={isGenerating}
        onColorChange={setCurrentColor}
      />
    </div>
    
    <div className="section-header">
      <h2 className="section-title">Your playlist</h2>
      <div className="flex items-center gap-3">
        <span className="playlist-meta">{playlist.length} tracks · ~28 min</span>
        {/* REFRESH BUTTON */}
        <button
          onClick={handleRefresh}
          disabled={isGenerating}
          className="refresh-btn"
          style={{
            background: 'white',
            border: `1.5px solid ${currentColor}`,
            color: currentColor,
            borderRadius: '100px',
            padding: '0.4rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = currentColor;
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = currentColor;
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor"/>
          </svg>
          Refresh
        </button>
      </div>
    </div>
    
    <div 
  className={`playlist-card ${isRefreshing ? 'refreshing' : ''}`}
>
      <div 
        className="playlist-header-bar"
        style={{
          background: `linear-gradient(135deg, ${currentColor}, ${currentColor}dd)`,
        }}
      >
        <h3>Generated for your mood</h3>
        <p className="playlist-name">"{playlistName}"</p>
      </div>
      <div className="track-list">
        {playlist.map((track, i) => (
          <div
            key={track.uniqueId || i}  // Use uniqueId if available, fallback to index
            className={`track-item ${currentPlaying === i ? "playing" : ""}`}
            onClick={() => playPreview(track, i)}
          >
            <span className="track-num">
              {currentPlaying === i ? (
                <span className="play-icon">▶</span>
              ) : (
                i + 1
              )}
            </span>
            <div className="track-cover">
              {track.cover ? (
                <img 
                  src={track.cover} 
                  alt={track.title}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerHTML = '🎵';
                      e.currentTarget.parentElement.style.display = 'flex';
                      e.currentTarget.parentElement.style.alignItems = 'center';
                      e.currentTarget.parentElement.style.justifyContent = 'center';
                    }
                  }}
                />
              ) : (
                <span>🎵</span>
              )}
            </div>
            <div className="track-info">
              <div className="track-title">{track.title}</div>
              <div className="track-artist">{track.artist}</div>
            </div>
            <span className="track-duration">{track.duration}</span>
          </div>
        ))}
      </div>
    </div>
    
    {session && (
      <div style={{ textAlign: "center" }}>
        <button 
          className="save-btn"
          style={{
            borderColor: currentColor,
            color: currentColor
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = currentColor;
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = currentColor;
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Save to Spotify
        </button>
      </div>
    )}
  </section>
)}

      {/* LOGIN PROMPT if not logged in and no playlist */}
      {!session && !playlist && (
        <section style={{ padding: "2rem" }}>
          <div className="login-prompt">
            <div className="login-icon">🎧</div>
            <h2 className="login-title">Ready to vibe?</h2>
            <p className="login-sub">
              Connect your Spotify account to generate personalized playlists and save them directly to your library.
            </p>
            <button className="btn-spotify" onClick={handleLogin} style={{ margin: "0 auto" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Login with Spotify
            </button>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-text">© 2026 MoodTunes · AI Music Generator</p>
        <div className="footer-powered">
          <span>Powered by OpenAI</span>
          <div className="footer-dot" />
          <span>Spotify API</span>
          <div className="footer-dot" />
          <span>Next.js</span>
        </div>
      </footer>
    </div>
  );
}