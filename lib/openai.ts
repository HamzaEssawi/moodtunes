// lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface Song {
  title: string;
  artist: string;
  reason: string;
  spotifyUri?: string;
  spotifyId?: string;
  previewUrl?: string | null;
  externalUrl?: string;
  albumImage?: string;
}

export async function generateSongsFromMood(mood: string): Promise<Song[]> {
  const prompt = `
    Based on this mood description: "${mood}"
    
    Generate 10 songs that perfectly match this mood.
    For each song, provide:
    - title: The song title
    - artist: The artist name
    - reason: One sentence explaining why this song matches the mood
    
    Return as JSON array:
    [{ "title": "Song Name", "artist": "Artist Name", "reason": "Explanation..." }]
    
    Choose diverse songs from different eras and genres that collectively capture the mood.
    Make sure songs are real and popular enough to exist on Spotify.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a music expert who understands the emotional qualities of songs." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No response from OpenAI');
    
    const result = JSON.parse(content);
    // Handle both array format and object with songs property
    const songs = Array.isArray(result) ? result : result.songs || [];
    return songs;
  } catch (error) {
    console.error('Error generating songs:', error);
    throw new Error('Failed to generate songs');
  }
}