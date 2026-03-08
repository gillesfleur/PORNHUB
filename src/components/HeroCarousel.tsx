import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Video } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeroCarouselProps {
  videos: Video[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <section className="relative w-full overflow-hidden bg-black group mb-8 h-[300px] sm:h-[400px] lg:h-[500px]">
      {/* Slides Container */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) > 50;
            if (swipe) {
              if (offset.x > 0) {
                prevSlide();
              } else {
                nextSlide();
              }
            }
          }}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        >
          <div className="relative w-full h-full">
            <img
              src={videos[currentIndex].thumbnail}
              alt={videos[currentIndex].title}
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
                    {videos[currentIndex].duration} • {videos[currentIndex].views} vues
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-lg leading-tight line-clamp-2">
                  {videos[currentIndex].title}
                </h1>
                
                <p className="text-primary text-lg sm:text-xl font-bold italic">
                  Avec {videos[currentIndex].actor}
                </p>

                <div className="flex items-center gap-4 pt-4">
                  <button className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-base sm:text-lg transition-all transform hover:scale-105 shadow-xl min-h-[44px]">
                    <Play size={20} className="sm:w-6 sm:h-6" fill="currentColor" />
                    Regarder
                  </button>
                  <button className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold text-lg transition-all min-h-[44px]">
                    Plus d'infos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center min-w-[44px] min-h-[44px] z-20"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center min-w-[44px] min-h-[44px] z-20"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators (Dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-1.5 transition-all rounded-full min-w-[12px] min-h-[12px] flex items-center justify-center ${
              currentIndex === index ? 'w-8 bg-primary' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
