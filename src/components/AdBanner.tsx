import React from 'react';

type AdSize = 'leaderboard' | 'banner' | 'mobile-banner' | 'rectangle' | 'skyscraper' | 'native';

interface AdBannerProps {
  size: AdSize;
  position: string;
  className?: string;
}

const sizeClasses: Record<AdSize, string> = {
  leaderboard: 'w-full max-w-[728px] h-[90px]',
  banner: 'w-full max-w-[468px] h-[60px]',
  'mobile-banner': 'w-[320px] h-[50px]',
  rectangle: 'w-[300px] h-[250px]',
  skyscraper: 'w-[160px] h-[600px]',
  native: 'w-full h-auto min-h-[100px]',
};

export const AdBanner: React.FC<AdBannerProps> = ({ size, position, className = '' }) => {
  if (size === 'native') {
    return (
      <div className={`relative flex flex-col bg-surface/40 border-2 border-dashed border-muted/50 rounded-xl overflow-hidden p-4 group ${className}`}>
        <div className="absolute top-2 right-2 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20">
          SPONSORISÉ
        </div>
        <div className="aspect-video bg-muted/30 rounded-lg mb-3 flex items-center justify-center">
          <span className="text-muted text-[10px] font-bold uppercase tracking-widest">Contenu Partenaire</span>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted/30 rounded w-3/4" />
          <div className="h-3 bg-muted/20 rounded w-1/2" />
        </div>
        <div className="mt-4 pt-4 border-t border-muted/20 flex justify-between items-center">
          <span className="text-[10px] text-muted font-bold uppercase">Publicité Native</span>
          <button className="text-[10px] font-bold text-primary hover:underline">En savoir plus</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]} bg-surface/60 border-2 border-dashed border-muted/60 flex flex-col items-center justify-center rounded-lg overflow-hidden group hover:bg-surface/80 transition-colors`}>
        <span className="absolute top-1 right-2 text-[8px] font-black text-muted/40 tracking-tighter">AD</span>
        
        <div className="text-center px-4">
          <p className="text-[10px] font-black text-muted/60 uppercase tracking-[0.2em] mb-1">Publicité</p>
          <p className="text-[9px] font-bold text-muted/40 uppercase">
            {size} — {position}
          </p>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-muted/30" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-muted/30" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-muted/30" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-muted/30" />
      </div>
    </div>
  );
};
