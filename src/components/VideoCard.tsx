import React from 'react';
import { Video } from '../types';
import { Play, Eye, ThumbsUp, Clock, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export type VideoCardVariant = 'default' | 'compact' | 'horizontal' | 'sponsored';

interface VideoCardProps {
  video: Video;
  variant?: VideoCardVariant;
  showRating?: boolean;
  onRemove?: (id: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, variant = 'default', showRating = false, onRemove }) => {
  const isHD = video.tags.includes('HD');
  const slug = video.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const isSponsored = variant === 'sponsored';

  if (variant === 'horizontal') {
    return (
      <Link 
        to={`/video/${slug}`}
        className="group flex gap-4 cursor-pointer hover:bg-surface/40 p-2 rounded-xl transition-colors"
      >
        {/* Thumbnail Container */}
        <div className="relative w-[40%] h-[100px] flex-shrink-0 bg-muted rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-sm text-white text-[9px] font-black px-1 py-0.5 rounded">
            {video.duration}
          </div>
          
          {/* Hover Play Overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play size={20} className="text-white fill-white" />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-grow min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-main leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            <span className="text-[11px] font-bold text-primary hover:underline">
              {video.actor}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted font-medium">
            <span className="flex items-center gap-1">
              <Eye size={10} />
              {video.views}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp size={10} />
              {video.likes}
            </span>
            <span className="italic">il y a {video.date}</span>
          </div>
        </div>
      </Link>
    );
  }

  const isCompact = variant === 'compact';

  return (
    <Link 
      to={`/video/${slug}`}
      className={`group block cursor-pointer transition-all duration-300 ${
        isSponsored ? 'bg-primary/[0.05] border border-primary/20 rounded-2xl p-1' : ''
      }`}
    >
      {/* Thumbnail Container */}
      <div className={`relative aspect-video bg-muted rounded-xl overflow-hidden mb-2 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/10 transition-all duration-500 ${
        isSponsored ? 'border border-primary/10' : ''
      }`}>
        {/* Main Image */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          referrerPolicy="no-referrer"
        />
        
        {/* Permanent Badges */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 z-10">
          {video.duration}
        </div>

        {isSponsored ? (
          <div className="absolute top-2 left-2 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded shadow-lg z-10 flex items-center gap-1">
            <Info size={10} />
            SPONSORISÉ
          </div>
        ) : isHD && (
          <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg z-10">
            HD
          </div>
        )}

        {showRating && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg z-10 flex items-center gap-1">
            {video.likes} <ThumbsUp size={10} fill="currentColor" />
          </div>
        )}

        {onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(video.id);
            }}
            className="absolute top-2 right-2 z-30 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-all shadow-lg group/remove"
            title="Supprimer des favoris"
          >
            <X size={14} className="group-hover/remove:scale-110 transition-transform" />
          </button>
        )}

        {/* Hover Overlay (Delayed 300ms) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 flex items-center justify-center z-20">
          {/* Play Icon */}
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500 delay-150">
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
          </div>

          {!isCompact && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-200">
              <div className="flex items-center justify-between text-[10px] font-bold text-white/90">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={10} className="text-primary" />
                    {video.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {video.date}
                  </span>
                </div>
                {isHD && <span className="text-primary">Qualité 4K</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className={`space-y-1 px-1 ${isCompact ? 'pb-1' : 'pb-2'}`}>
        {/* Title (L1) */}
        <h3 className={`font-bold text-main leading-snug group-hover:text-primary transition-colors duration-300 ${
          isCompact ? 'text-xs line-clamp-1' : 'text-sm line-clamp-2'
        }`}>
          {video.title}
        </h3>
        
        {/* Stats (L2) */}
        <div className="flex items-center gap-3 text-[10px] text-muted font-medium">
          <span className="flex items-center gap-1">
            <Eye size={11} className="opacity-70" />
            {video.views} {isCompact ? '' : 'vues'}
          </span>
          {!isCompact && (
            <span className="flex items-center gap-1">
              <ThumbsUp size={11} className="opacity-70" />
              {video.likes}
            </span>
          )}
        </div>

        {/* Actor & Date (L3) - Hidden in Compact */}
        {!isCompact && (
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="font-bold text-primary hover:underline cursor-pointer">
              {video.actor}
            </span>
            <span className="text-muted/60 italic">
              il y a {video.date}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
