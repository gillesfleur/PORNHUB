import React, { useMemo } from 'react';
import { videos } from '../data/videos';
import { VideoCard } from './VideoCard';
import { AdBanner } from './AdBanner';
import { ArrowRight } from 'lucide-react';
import { Video } from '../types';

interface SuggestedVideosProps {
  currentVideoId: string;
  category: string;
  tags: string[];
}

export const SuggestedVideos: React.FC<SuggestedVideosProps> = ({ currentVideoId, category, tags }) => {
  // Logic to find related videos
  const suggestions = useMemo(() => {
    // 1. Filter out current video
    const otherVideos = videos.filter(v => v.id !== currentVideoId);
    
    // 2. Score videos based on category and tags
    const scored = otherVideos.map(v => {
      let score = 0;
      if (v.category === category) score += 5;
      
      const commonTags = v.tags.filter(tag => tags.includes(tag));
      score += commonTags.length * 2;
      
      return { video: v, score };
    });
    
    // 3. Sort by score and take top ones
    const sorted = scored.sort((a, b) => b.score - a.score);
    
    // 4. If not enough, fill with random ones
    const topSuggestions = sorted.map(s => s.video);
    
    if (topSuggestions.length < 10) {
      const remaining = otherVideos.filter(v => !topSuggestions.find(ts => ts.id === v.id));
      const shuffled = [...remaining].sort(() => 0.5 - Math.random());
      return [...topSuggestions, ...shuffled].slice(0, 15);
    }
    
    return topSuggestions.slice(0, 15);
  }, [currentVideoId, category, tags]);

  const desktopSuggestions = suggestions.slice(0, 10);
  const mobileSuggestions = suggestions.slice(0, 6);

  return (
    <>
      {/* DESKTOP SIDEBAR VERSION */}
      <div className="hidden lg:flex flex-col gap-4">
        <h3 className="text-lg font-black text-main flex items-center gap-2">
          Vidéos suggérées
          <div className="h-px flex-grow bg-muted/10" />
        </h3>
        
        <div className="space-y-3 max-h-[1200px] overflow-y-auto pr-2 custom-scrollbar">
          {desktopSuggestions.map((video, index) => (
            <React.Fragment key={video.id}>
              <VideoCard video={video} variant="horizontal" />
              {index === 2 && (
                <div className="py-2">
                  <AdBanner size="rectangle" position="video-sidebar-middle" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* MOBILE BOTTOM VERSION */}
      <div className="lg:hidden space-y-6 mt-8">
        <h3 className="text-xl font-black text-main flex items-center gap-2">
          Vidéos suggérées
          <div className="h-px flex-grow bg-muted/10" />
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {mobileSuggestions.map((video, index) => (
            <React.Fragment key={video.id}>
              {index === 2 && (
                <div className="col-span-2 py-2">
                  <AdBanner size="mobile-banner" position="video-mobile-middle" />
                </div>
              )}
              <VideoCard video={video} />
            </React.Fragment>
          ))}
        </div>

        <button className="w-full py-4 bg-surface border border-muted/20 rounded-2xl text-main font-bold flex items-center justify-center gap-2 hover:bg-muted/10 transition-colors">
          Voir plus de suggestions
          <ArrowRight size={18} className="text-primary" />
        </button>
      </div>
    </>
  );
};
