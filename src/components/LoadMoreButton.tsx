import React, { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  clickCount: number;
  maxClicks?: number;
  targetUrl?: string;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ 
  onLoadMore, 
  clickCount, 
  maxClicks = 3,
  targetUrl = "/popular"
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (clickCount >= maxClicks) return;
    
    setIsLoading(true);
    // Simulate loading for 800ms
    setTimeout(() => {
      onLoadMore();
      setIsLoading(false);
    }, 800);
  };

  if (clickCount >= maxClicks) {
    return (
      <div className="flex justify-center mt-8">
        <a 
          href={targetUrl}
          className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all group"
        >
          Voir toutes les vidéos
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-muted text-main font-bold hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[240px] justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Chargement...
          </>
        ) : (
          'Charger plus de vidéos'
        )}
      </button>
    </div>
  );
};
