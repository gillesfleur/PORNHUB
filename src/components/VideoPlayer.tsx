import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Maximize, Settings, Loader2, Info, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  thumbnail: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ thumbnail }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [canSkipAd, setCanSkipAd] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startVideo = () => {
    setIsAdPlaying(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
    }, 1500);
  };

  const handlePlay = () => {
    setIsAdPlaying(true);
    setAdCountdown(5);
    setCanSkipAd(false);
  };

  useEffect(() => {
    if (isAdPlaying && adCountdown > 0) {
      timerRef.current = setInterval(() => {
        setAdCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            startVideo();
            return 0;
          }
          if (prev <= 3) setCanSkipAd(true);
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAdPlaying]);

  // Update canSkipAd based on countdown
  useEffect(() => {
    if (adCountdown <= 2 && isAdPlaying) {
      setCanSkipAd(true);
    }
  }, [adCountdown, isAdPlaying]);

  const handleSkipAd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timerRef.current) clearInterval(timerRef.current);
    startVideo();
  };

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden group">
      {/* Placeholder Image */}
      {!isPlaying && !isLoading && !isAdPlaying && (
        <img 
          src={thumbnail} 
          alt="Video Thumbnail" 
          className="w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Ad Overlay */}
      <AnimatePresence>
        {isAdPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-[#0a1128] flex flex-col items-center justify-center"
          >
            {/* AD Badge */}
            <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg z-50">
              AD
            </div>

            {/* Info Badge with Tooltip */}
            <div className="absolute bottom-4 left-4 group/info z-50">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white cursor-help hover:bg-white/20 transition-colors">
                <Info size={14} />
              </div>
              <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-black/90 text-[10px] text-white rounded-lg opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none border border-white/10">
                Cette publicité finance le contenu gratuit
              </div>
            </div>

            {/* Countdown Text */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-6" />
              <h2 className="text-white font-black text-xl sm:text-2xl tracking-tight">
                Publicité — Votre vidéo commencera dans <span className="text-primary">{adCountdown}</span> secondes
              </h2>
              <p className="text-muted text-sm font-medium">Sponsorisé par VibeTube Premium</p>
            </div>

            {/* Skip Button */}
            {canSkipAd && (
              <motion.button 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onClick={handleSkipAd}
                className="absolute bottom-12 right-0 bg-black/80 hover:bg-black text-white px-6 py-3 flex items-center gap-2 font-black text-sm border-l-4 border-primary transition-all group/skip"
              >
                Passer la publicité
                <ChevronRight size={18} className="group-hover/skip:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
          <Loader2 size={64} className="text-primary animate-spin mb-4" />
          <span className="text-white font-bold text-xl tracking-widest animate-pulse">
            LECTURE EN COURS...
          </span>
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && !isAdPlaying && (
        <button 
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center z-10 group/btn"
        >
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-primary/20 group-hover/btn:border-primary/40">
            <Play size={48} className="text-white fill-white ml-2" />
          </div>
        </button>
      )}

      {/* Mock Video Content (when playing) */}
      {isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-2 bg-primary animate-bounce" 
                  style={{ animationDelay: `${i * 0.1}s`, height: `${20 + Math.random() * 40}px` }}
                />
              ))}
            </div>
            <p className="text-muted text-sm font-mono">STREAMING_BUFFER_ACTIVE</p>
          </div>
        </div>
      )}

      {/* Controls Bar (Simulated) */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 z-30 ${
        (isPlaying || isLoading) ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
      }`}>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/20 rounded-full mb-4 relative cursor-pointer">
          <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: '30%' }} />
          <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="text-white hover:text-primary transition-colors">
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button className="text-white hover:text-primary transition-colors">
              <Volume2 size={20} />
            </button>
            <span className="text-white text-xs font-medium font-mono">
              03:24 / 12:34
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-primary font-black text-xs border border-primary px-1 rounded hover:bg-primary hover:text-white transition-all">
              HD
            </button>
            <button className="text-white hover:text-primary transition-colors">
              <Settings size={20} />
            </button>
            <button className="text-white hover:text-primary transition-colors">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
