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

    const { name, description, trackUris } = await request.json();

    if (!name || !trackUris || !Array.isArray(trackUris)) {
      return NextResponse.json(
        { error: 'Invalid playlist data' },
        { status: 400 }
      );
    }

    // Get user's Spotify ID
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get Spotify user');
    }

    const userData = await userResponse.json();

    // Create playlist
    const createResponse = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description,
        public: false
      })
    });

    if (!createResponse.ok) {
      throw new Error('Failed to create playlist');
    }

    const playlist = await createResponse.json();

    // Add tracks to playlist (if any)
    if (trackUris.length > 0) {
      await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: trackUris
        })
      });
    }

    return NextResponse.json({ 
      success: true, 
      playlist: {
        id: playlist.id,
        name: playlist.name,
        external_urls: playlist.external_urls
      }
    });

  } catch (error) {
    console.error('Error creating playlist:', error);
    return NextResponse.json(
      { error: 'Failed to create playlist' },
      { status: 500 }
    );
  }
}