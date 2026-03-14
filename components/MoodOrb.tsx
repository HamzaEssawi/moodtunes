'use client';
import { useEffect, useState } from 'react';

interface MoodOrbProps {
  mood: string;
  isActive: boolean;
  onColorChange?: (color: string) => void;
}

export default function MoodOrb({ mood, isActive, onColorChange }: MoodOrbProps) {
  const [color, setColor] = useState('#22c55e');
  const [glowSize, setGlowSize] = useState(1);

  // Analyze mood to determine color
  useEffect(() => {
    if (!mood) {
      setColor('#22c55e');
      if (onColorChange) onColorChange('#22c55e');
      return;
    }
    
    const moodLower = mood.toLowerCase();
    let newColor = '#22c55e';
    
    if (moodLower.includes('happy') || moodLower.includes('joy') || moodLower.includes('summer') || moodLower.includes('beach')) {
      newColor = '#fbbf24';
    } 
    else if (moodLower.includes('sad') || moodLower.includes('melancholy') || moodLower.includes('rain') || moodLower.includes('blue')) {
      newColor = '#60a5fa';
    } 
    else if (moodLower.includes('angry') || moodLower.includes('intense') || moodLower.includes('gym') || moodLower.includes('workout')) {
      newColor = '#ef4444';
    } 
    else if (moodLower.includes('calm') || moodLower.includes('relax') || moodLower.includes('peace') || moodLower.includes('chill')) {
      newColor = '#34d399';
    } 
    else if (moodLower.includes('focus') || moodLower.includes('study') || moodLower.includes('work') || moodLower.includes('productive')) {
      newColor = '#8b5cf6';
    } 
    else if (moodLower.includes('romantic') || moodLower.includes('love') || moodLower.includes('date')) {
      newColor = '#ec4899';
    }
    else if (moodLower.includes('night') || moodLower.includes('late') || moodLower.includes('dark')) {
      newColor = '#312e81';
    }
    else if (moodLower.includes('energetic') || moodLower.includes('pump') || moodLower.includes('hyped')) {
      newColor = '#f97316';
    }
    
    setColor(newColor);
    if (onColorChange) onColorChange(newColor);
  }, [mood, onColorChange]);

  // Pulse animation when active
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setGlowSize(prev => prev === 1 ? 1.2 : 1);
      }, 800);
      return () => clearInterval(interval);
    } else {
      setGlowSize(1);
    }
  }, [isActive]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Main Orb Container */}
      <div 
        className="relative flex items-center justify-center"
        style={{ width: '160px', height: '160px' }}
      >
        {/* Outer glow rings */}
        <div 
          className="absolute rounded-full transition-all duration-500"
          style={{
            width: '180px',
            height: '180px',
            background: `${color}30`,
            filter: 'blur(20px)',
            transform: `scale(${glowSize})`,
          }}
        />
        
        <div 
          className="absolute rounded-full transition-all duration-700"
          style={{
            width: '200px',
            height: '200px',
            background: `${color}20`,
            filter: 'blur(30px)',
            transform: `scale(${glowSize * 1.1})`,
          }}
        />

        {/* Main Orb */}
        <div 
          className="relative rounded-full shadow-2xl transition-all duration-300"
          style={{
            width: '120px',
            height: '120px',
            background: `radial-gradient(circle at 30% 30%, ${color}, ${color}dd, #1a1a1a)`,
            boxShadow: `0 20px 40px -10px ${color}`,
            transform: `scale(${glowSize})`,
          }}
        >
          {/* Inner highlight */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '40px',
              height: '40px',
              background: 'white',
              top: '20px',
              left: '20px',
              filter: 'blur(8px)',
              opacity: 0.4,
            }}
          />
          
          {/* Surface texture (tiny dots) */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: '4px',
                  height: '4px',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Energy rings when active */}
        {isActive && (
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border-2"
                style={{
                  width: '140px',
                  height: '140px',
                  borderColor: color,
                  opacity: 0.3 - i * 0.1,
                  animation: `ripple ${1.5 + i * 0.5}s infinite`,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Mood text - Enhanced */}
      {mood && (
        <div className="mt-8 relative">
          {/* Decorative sparkles */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex gap-1">
            <span className="text-xs animate-ping opacity-50" style={{ color }}>✦</span>
            <span className="text-xs animate-ping animation-delay-200 opacity-50" style={{ color }}>✦</span>
            <span className="text-xs animate-ping animation-delay-400 opacity-50" style={{ color }}>✦</span>
          </div>
          
          {/* Main text container */}
          <div 
            className="relative px-6 py-3 rounded-2xl shadow-xl backdrop-blur-md border-2 transition-all duration-500 hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${color}15, ${color}05)`,
              borderColor: `${color}40`,
              boxShadow: `0 10px 30px -10px ${color}80`
            }}
          >
            {/* Inner glow */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-20"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
              }}
            />
            
            {/* Quote mark */}
            <span className="absolute -top-2 -left-1 text-3xl opacity-20" style={{ color }}>"</span>
            
            {/* Mood text */}
            <p 
              className="relative text-base font-medium italic tracking-wide text-center"
              style={{ 
                color: '#1f2937',
                textShadow: `0 2px 10px ${color}40`
              }}
            >
              {mood.length > 35 ? mood.slice(0, 35) + '...' : mood}
            </p>
            
            {/* Quote mark */}
            <span className="absolute -bottom-4 -right-1 text-3xl opacity-20" style={{ color }}>"</span>
            
            {/* Small mood indicator dots */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            </div>
          </div>
          
          {/* Mood energy indicator */}
          <div className="mt-2 flex justify-center gap-1">
            <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            <div className="w-1 h-1 rounded-full animate-pulse animation-delay-200" style={{ backgroundColor: color }} />
            <div className="w-1 h-1 rounded-full animate-pulse animation-delay-400" style={{ backgroundColor: color }} />
            <span className="text-xs ml-2 opacity-50" style={{ color }}>live mood</span>
          </div>
        </div>
      )}
    </div>
  );
}