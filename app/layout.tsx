import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ColorProvider } from '@/context/ColorContext';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MoodTunes - AI Music Generator',
  description: 'Generate Spotify playlists based on your mood using AI',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ColorProvider>
          <Providers>
            {children}
          </Providers>
        </ColorProvider>
      </body>
    </html>
  );
}