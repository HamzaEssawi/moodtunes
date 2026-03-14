import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Spotify' },
        { status: 401 }
      );
    }

    const { songs } = await request.json();

    if (!Array.isArray(songs)) {
      return NextResponse.json(
        { error: 'Invalid songs data' },
        { status: 400 }
      );
    }

    // Search for each song on Spotify
    const searchResults = await Promise.all(
      songs.map(async (song: { title: string; artist: string }) => {
        try {
          const query = encodeURIComponent(`track:${song.title} artist:${song.artist}`);
          const response = await fetch(
            `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
            {
              headers: {
                'Authorization': `Bearer ${session.accessToken}`
              }
            }
          );

          if (!response.ok) return null;

          const data = await response.json();
          if (data.tracks?.items?.length > 0) {
            const track = data.tracks.items[0];
            return {
              ...song,
              spotifyUri: track.uri,
              spotifyId: track.id,
              previewUrl: track.preview_url,
              externalUrl: track.external_urls.spotify,
              albumImage: track.album.images[0]?.url,
              duration: formatDuration(track.duration_ms)
            };
          }
          return null;
        } catch (error) {
          console.error(`Error searching for ${song.title}:`, error);
          return null;
        }
      })
    );

    // Filter out failed searches
    const foundSongs = searchResults.filter(Boolean);

    return NextResponse.json({ songs: foundSongs });

  } catch (error) {
    console.error('Error searching tracks:', error);
    return NextResponse.json(
      { error: 'Failed to search tracks' },
      { status: 500 }
    );
  }
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}