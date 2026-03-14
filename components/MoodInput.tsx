'use client';
import { useState } from 'react';
import { FiSend, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface MoodInputProps {
  onSubmit: (mood: string) => void;
  isLoading: boolean;
}

const moodSuggestions = [
  { text: "feeling nostalgic about summer road trips 🚗", icon: "🌅" },
  { text: "need focus music with jazz influences 🎷", icon: "📚" },
  { text: "anxious but ready to conquer the day 💪", icon: "⚡" },
  { text: "rainy day contemplation ☔", icon: "🌧️" },
  { text: "late night coding session 💻", icon: "🌙" },
  { text: "beach vacation sunset feels 🌅", icon: "🏖️" },
  { text: "romantic dinner preparation 💕", icon: "🍷" },
  { text: "gym workout motivation 🏋️", icon: "🔥" },
];

export default function MoodInput({ onSubmit, isLoading }: MoodInputProps) {
  const [mood, setMood] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mood.trim()) {
      onSubmit(mood);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        className="relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-green-200 rounded-full blur-xl opacity-50 animate-pulse" />
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-green-300 rounded-full blur-xl opacity-50 animate-pulse" />
        
        <div className={`relative transition-all duration-300 ${
          isFocused ? 'scale-105' : 'scale-100'
        }`}>
          <textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe your mood... (e.g., 'feeling nostalgic about summer road trips')"
            className="w-full px-8 py-6 bg-white/90 backdrop-blur-md border-2 rounded-2xl focus:outline-none transition-all resize-none text-gray-800 placeholder-gray-400"
            style={{
              borderColor: isFocused ? '#10b981' : '#d1fae5',
              boxShadow: isFocused ? '0 20px 40px -15px #10b981' : '0 10px 30px -15px #a7f3d0',
            }}
            rows={4}
            disabled={isLoading}
          />
          
          {/* Character count with green theme */}
          <div className="absolute bottom-4 right-4 text-sm text-green-600 font-medium">
            {mood.length}/200
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading || !mood.trim()}
          className="absolute -bottom-5 right-8 px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <FiZap className="text-yellow-300" />
              <span>Generate</span>
              <FiSend />
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Mood suggestions with green pills */}
      <div className="mt-8">
        <p className="text-sm text-green-700 mb-3 flex items-center gap-2">
          <FiZap className="text-green-500" />
          Try these moods:
        </p>
        <div className="flex flex-wrap gap-2">
          {moodSuggestions.map((suggestion, i) => (
            <motion.button
              key={i}
              onClick={() => setMood(suggestion.text)}
              className="group relative px-4 py-2 bg-white/70 backdrop-blur-sm border border-green-200 rounded-full hover:bg-green-50 transition-all overflow-hidden"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="relative z-10 text-sm text-gray-700 group-hover:text-green-700">
                {suggestion.icon} {suggestion.text.split(' ').slice(0, 3).join(' ')}...
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-50"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Decorative wave */}
      <div className="mt-12 opacity-30">
        <svg viewBox="0 0 1200 120" className="w-full h-12 text-green-300 fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28 70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,208.13,26.26 109.22,2.19,217.86-20.77,315.37-53.66V0Z" opacity=".3" />
          <path d="M0,0V15.81C13,21.25,27.93,25.88,44.28,29.56c100,21.38,207.52,12.58,306.5-5.53 97-17.76,190.68-51.7,288.49-60.44 124.37-11.12,243.7,27.27,360.73,64.39V0Z" opacity=".5" />
        </svg>
      </div>
    </div>
  );
}