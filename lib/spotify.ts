// lib/spotify.ts
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

let spotifyApiInstance: SpotifyApi | null = null;

export function initSpotify(accessToken: string) {
  spotifyApiInstance = SpotifyApi.withAccessToken(
    process.env.SPOTIFY_CLIENT_ID!,
    {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: '', // Will be refreshed automatically
    }
  );
  return spotifyApiInstance;
}

export async function searchSongs(songs: { title: string; artist: string }[], accessToken: string) {
  const api = initSpotify(accessToken);
  if (!api) throw new Error('Failed to initialize Spotify');

  const results = await Promise.all(
    songs.map(async (song) => {
      try {
        // Search with both track and artist for better results
        const searchQuery = `track:${song.title} artist:${song.artist}`;
        const result = await api.search(searchQuery, ['track'], undefined, 1);
        
        if (result.tracks.items.length > 0) {
          const track = result.tracks.items[0];
          return {
            ...song,
            spotifyUri: track.uri,
            spotifyId: track.id,
            previewUrl: track.preview_url,
            externalUrl: track.external_urls.spotify,
            albumImage: track.album.images[0]?.url,
          };
        }
        
        // Try a more general search if specific search fails
        const fallbackResult = await api.search(song.title, ['track'], undefined, 1);
        if (fallbackResult.tracks.items.length > 0) {
          const track = fallbackResult.tracks.items[0];
          return {
            ...song,
            spotifyUri: track.uri,
            spotifyId: track.id,
            previewUrl: track.preview_url,
            externalUrl: track.external_urls.spotify,
            albumImage: track.album.images[0]?.url,
          };
        }
        
        return null;
      } catch (error) {
        console.error(`Error searching for ${song.title}:`, error);
        return null;
      }
    })
  );

  return results.filter(Boolean);
}

export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description: string,
  trackUris: string[]
) {
  try {
    const api = initSpotify(accessToken);
    if (!api) throw new Error('Failed to initialize Spotify');

    // Create playlist
    const playlist = await api.playlists.createPlaylist(userId, {
      name,
      description,
      public: true
    });

    // Add tracks in batches (Spotify limit is 100 per request)
    if (trackUris.length > 0) {
      await api.playlists.addItemsToPlaylist(playlist.id, trackUris);
    }

    return playlist;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
}

export async function getCurrentUser(accessToken: string) {
  const api = initSpotify(accessToken);
  if (!api) throw new Error('Failed to initialize Spotify');
  
  return await api.currentUser.profile();
}