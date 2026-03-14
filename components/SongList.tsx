'use client';
import { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause, FiExternalLink, FiCheck, FiPlus, FiMusic } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Song {
  title: string;
  artist: string;
  reason: string;
  spotifyUri?: string;
  spotifyId?: string;
  previewUrl?: string | null;
  externalUrl?: string;
  albumImage?: string;
}

interface SongListProps {
  songs: Song[];
  onCreatePlaylist: (selectedSongs: Song[]) => void;
  isAuthenticated: boolean;
}

export default function SongList({ songs, onCreatePlaylist, isAuthenticated }: SongListProps) {
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePreview = (song: Song) => {
    if (!song.previewUrl) return;
    
    if (playingPreview === song.spotifyId) {
      // Stop current preview
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingPreview(null);
    } else {
      // Stop any existing playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Create and play new audio
      const audio = new Audio(song.previewUrl);
      audioRef.current = audio;
      
      audio.play().catch(error => {
        console.error('Error playing preview:', error);
        setPlayingPreview(null);
      });
      
      setPlayingPreview(song.spotifyId || null);
      
      audio.onended = () => {
        setPlayingPreview(null);
        audioRef.current = null;
      };
    }
  };

  const toggleSelect = (songId: string) => {
    const newSelected = new Set(selectedSongs);
    if (newSelected.has(songId)) {
      newSelected.delete(songId);
    } else {
      newSelected.add(songId);
    }
    setSelectedSongs(newSelected);
  };

  const selectAll = () => {
    if (selectedSongs.size === songs.length) {
      setSelectedSongs(new Set());
    } else {
      setSelectedSongs(new Set(songs.map(s => s.spotifyId).filter(Boolean) as string[]));
    }
  };

  const handleCreatePlaylist = () => {
    const selected = songs.filter(s => s.spotifyId && selectedSongs.has(s.spotifyId));
    onCreatePlaylist(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12"
    >
      {/* Header with selection controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Your Mood Playlist</h2>
          <p className="text-green-600 text-sm mt-1">
            {songs.length} songs generated • {selectedSongs.size} selected
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={selectAll}
            className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-xl hover:bg-green-50 transition-all flex items-center gap-2"
          >
            <FiCheck />
            {selectedSongs.size === songs.length ? 'Deselect All' : 'Select All'}
          </button>
          
          <button
            onClick={handleCreatePlaylist}
            disabled={!isAuthenticated || selectedSongs.size === 0}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            <FiPlus />
            Create Playlist ({selectedSongs.size})
          </button>
        </div>
      </div>

      {/* Songs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {songs.map((song, index) => (
            <motion.div
              key={song.spotifyId || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative bg-white/70 backdrop-blur-sm rounded-xl border-2 transition-all overflow-hidden ${
                selectedSongs.has(song.spotifyId || '')
                  ? 'border-green-500 shadow-lg shadow-green-200'
                  : 'border-green-100 hover:border-green-300 hover:shadow-md'
              }`}
            >
              {/* Selection indicator */}
              <div className="absolute top-3 left-3 z-10">
                <button
                  onClick={() => song.spotifyId && toggleSelect(song.spotifyId)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedSongs.has(song.spotifyId || '')
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-green-300 hover:border-green-500'
                  }`}
                >
                  {selectedSongs.has(song.spotifyId || '') && '✓'}
                </button>
              </div>

              {/* Album art or gradient placeholder */}
              <div className="h-32 bg-gradient-to-br from-green-400 to-green-600 relative overflow-hidden">
                {song.albumImage ? (
                  <img 
                    src={song.albumImage} 
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiMusic className="w-12 h-12 text-white/30" />
                  </div>
                )}
                
                {/* Preview button overlay */}
                {song.previewUrl && (
                  <button
                    onClick={() => togglePreview(song)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      {playingPreview === song.spotifyId ? (
                        <FiPause className="w-6 h-6 text-green-600" />
                      ) : (
                        <FiPlay className="w-6 h-6 text-green-600 ml-1" />
                      )}
                    </div>
                  </button>
                )}
              </div>

              {/* Song info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{song.title}</h3>
                    <p className="text-sm text-green-600">{song.artist}</p>
                  </div>
                  
                  {song.externalUrl && (
                    <a
                      href={song.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <FiExternalLink />
                    </a>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-2 italic">
                  "{song.reason}"
                </p>

                {/* Preview progress bar (when playing) */}
                {playingPreview === song.spotifyId && (
                  <motion.div
                    className="mt-2 h-0.5 bg-green-200 rounded-full overflow-hidden"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 30, ease: 'linear' }}
                  >
                    <div className="h-full bg-green-500" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}