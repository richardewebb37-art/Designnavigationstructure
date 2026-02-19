import { useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [opacity, setOpacity] = useState(0);
  const audioRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Fade in
    const fadeIn = setTimeout(() => {
      setOpacity(1);
    }, 100);

    // Fade out
    const fadeOut = setTimeout(() => {
      setOpacity(0);
    }, 2500);

    // Complete
    const complete = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.fade(audioRef.current.volume(), 0, 500);
      }
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(fadeOut);
      clearTimeout(complete);
      
      if (audioRef.current) {
        audioRef.current.unload();
      }
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Radial gradient pulse */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
        
        {/* Rotating rings */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-yellow-400/20 rounded-full"
          style={{
            animation: 'spin 20s linear infinite',
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border-2 border-blue-500/20 rounded-full"
          style={{
            animation: 'spin 25s linear infinite reverse',
          }}
        />
      </div>

      {/* Logo content */}
      <div
        className="relative z-10 text-center"
        style={{
          opacity: opacity,
          transition: 'opacity 1.5s ease-in-out',
        }}
      >
        {/* AlterOne Studio Logo */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Glow effect behind logo */}
            <div 
              className="absolute inset-0 blur-2xl opacity-50"
              style={{
                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, rgba(59, 130, 246, 0.4) 50%, transparent 70%)',
              }}
            />
            
            {/* Logo text */}
            <div className="relative">
              <h1 
                className="text-8xl font-black tracking-tighter mb-2"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #3b82f6 50%, #2563eb 75%, #fbbf24 100%)',
                  backgroundSize: '200% 200%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradientShift 4s ease infinite',
                  textShadow: '0 0 40px rgba(251, 191, 36, 0.5)',
                }}
              >
                AlterOne
              </h1>
              <p 
                className="text-3xl font-bold tracking-widest uppercase"
                style={{
                  background: 'linear-gradient(90deg, #fbbf24, #3b82f6)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Studio
              </p>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="flex items-center justify-center gap-3 text-yellow-400/80">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-400"></div>
          <p className="text-sm font-bold tracking-widest uppercase">
            Creating Worlds
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-400"></div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.25; }
        }
        
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
