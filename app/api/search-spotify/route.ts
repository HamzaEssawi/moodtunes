import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session exists:', !!session);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { query } = await request.json();
    console.log('Search query:', query);

    // Simple search term
    const searchTerm = query.split(' ').slice(0, 3).join(' ');
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      }
    );

    console.log('Spotify response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('Spotify error:', error);
      return NextResponse.json(
        { error: 'Spotify search failed' },
        { status: response.status }
      );
    }

    const data = await response.json();

    const tracks = data.tracks?.items?.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      duration: formatDuration(track.duration_ms),
      cover: track.album.images[0]?.url || null,
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls.spotify,
    })) || [];

    console.log(`Found ${tracks.length} tracks`);
    return NextResponse.json({ tracks });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}