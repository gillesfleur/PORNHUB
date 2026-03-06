import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Video } from '../types';

interface HeroCarouselProps {
  videos: Video[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full overflow-hidden bg-black group mb-8">
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-500 ease-out h-[300px] sm:h-[400px] lg:h-[500px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {videos.map((video) => (
          <div key={video.id} className="min-w-full relative h-full">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-12 lg:p-20">
              <div className="max-w-4xl space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    À la une
                  </span>
                  <span className="text-white/80 text-sm font-medium">
                    {video.duration} • {video.views} vues
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-lg leading-tight">
                  {video.title}
                </h1>
                
                <p className="text-primary text-lg sm:text-xl font-bold italic">
                  Avec {video.actor}
                </p>

                <div className="flex items-center gap-4 pt-4">
                  <button className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl">
                    <Play size={24} fill="currentColor" />
                    Regarder
                  </button>
                  <button className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold text-lg transition-all">
                    Plus d'infos
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators (Dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 transition-all rounded-full ${
              currentIndex === index ? 'w-8 bg-primary' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
