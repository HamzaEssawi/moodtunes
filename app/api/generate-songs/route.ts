import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { mood } = await request.json();

    if (!mood) {
      return NextResponse.json(
        { error: 'Mood description is required' },
        { status: 400 }
      );
    }

    const prompt = `
      Based on this mood description: "${mood}"
      
      Generate 8 real songs that perfectly match this mood.
      
      Return as JSON array with this exact format:
      [
        {
          "title": "Song Title",
          "artist": "Artist Name",
          "reason": "One sentence explaining why this song matches the mood",
          "cover": "A single emoji that represents the song's vibe"
        }
      ]
      
      Requirements:
      - Choose real, popular songs that exist on Spotify
      - Mix of different eras and genres
      - Each song should genuinely match the emotional tone
      - Cover emojis should match the song's energy (🌅 for chill, 🔥 for hype, etc.)
      
      Return ONLY the JSON array, no other text.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a music expert with deep knowledge of songs and their emotional qualities. You respond only with valid JSON." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No response from OpenAI');
    
    // Parse the JSON response
    let songs;
    try {
      const cleanedContent = content.replace(/```json|```/g, '').trim();
      songs = JSON.parse(cleanedContent);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Error in generate-songs:', error);
    return NextResponse.json(
      { error: 'Failed to generate songs. Please try again.' },
      { status: 500 }
    );
  }
}