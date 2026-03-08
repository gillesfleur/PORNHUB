import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Video } from '../types';
import { VideoCard } from './VideoCard';

interface TrendingRowProps {
  videos: Video[];
}

export const TrendingRow: React.FC<TrendingRowProps> = ({ videos }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-primary">🔥</span> Tendances du moment
        </h2>
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-surface border border-muted hover:bg-muted/20 text-main transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-surface border border-muted hover:bg-muted/20 text-main transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Left Shadow Indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity md:hidden" />
        
        {/* Right Shadow Indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none md:hidden" />

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory no-scrollbar touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="min-w-[200px] md:min-w-[260px] snap-start"
            >
              <VideoCard video={video} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
