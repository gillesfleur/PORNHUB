import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeroCarousel } from '../components/HeroCarousel';
import { TrendingRow } from '../components/TrendingRow';
import { PopularCategories } from '../components/PopularCategories';
import { PopularPornstars } from '../components/PopularPornstars';
import { AdBanner } from '../components/AdBanner';
import { VideoCard } from '../components/VideoCard';
import { LoadMoreButton } from '../components/LoadMoreButton';
import { VideoCardSkeleton, PornstarCardSkeleton, CategoryCardSkeleton } from '../components/Skeletons';
import { Clock, AlertCircle } from 'lucide-react';
import { videos } from '../data/videos';
import { categories } from '../data/categories';
import { actors } from '../data/actors';
import { motion, AnimatePresence } from 'motion/react';

import { SEO } from '../components/SEO';

export const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMorePopularLoading, setIsMorePopularLoading] = useState(false);
  const [isMoreRecentLoading, setIsMoreRecentLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ show: boolean; message: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    if (location.state?.message) {
      setToast({ show: true, message: location.state.message });
      setTimeout(() => setToast(null), 3000);
      navigate(location.pathname, { replace: true, state: {} });
    }

    return () => clearTimeout(timer);
  }, [location.state, location.pathname, navigate]);

  // Featured videos for Hero (first 5)
  const featuredVideos = videos.slice(0, 5);
  // Trending videos (next 8)
  const trendingVideos = videos.slice(5, 13);
  // Popular categories (first 8)
  const popularCategories = categories.slice(0, 8);
  // Popular actors (first 6)
  const popularActors = actors.slice(0, 6);

  // State for Popular Videos
  const [popularList, setPopularList] = React.useState(videos.slice(0, 12));
  const [popularClicks, setPopularClicks] = React.useState(0);

  // State for Recent Videos
  const sortedRecent = [...videos].sort((a, b) => {
    const valA = parseInt(a.date);
    const valB = parseInt(b.date);
    return valA - valB;
  });
  const [recentList, setRecentList] = React.useState(sortedRecent.slice(0, 8));
  const [recentClicks, setRecentClicks] = React.useState(0);

  const handleLoadMorePopular = () => {
    setIsMorePopularLoading(true);
    setTimeout(() => {
      const nextVideos = Array.from({ length: 8 }).map((_, i) => {
        const index = (popularList.length + i) % videos.length;
        return { ...videos[index], id: `pop-${popularList.length + i}` };
      });
      setPopularList([...popularList, ...nextVideos]);
      setPopularClicks(prev => prev + 1);
      setIsMorePopularLoading(false);
    }, 800);
  };

  const handleLoadMoreRecent = () => {
    setIsMoreRecentLoading(true);
    setTimeout(() => {
      const nextVideos = Array.from({ length: 8 }).map((_, i) => {
        const index = (recentList.length + i) % videos.length;
        return { ...videos[index], id: `rec-${recentList.length + i}` };
      });
      setRecentList([...recentList, ...nextVideos]);
      setRecentClicks(prev => prev + 1);
      setIsMoreRecentLoading(false);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-grow"
    >
      <SEO 
        title="Accueil - Le meilleur du contenu adulte" 
        description="Découvrez les meilleures vidéos gratuites en HD sur VibeTube. Des milliers de catégories et de pornstars à explorer." 
      />
      {/* Hero Section - Full Width */}
      <HeroCarousel videos={featuredVideos} />

      {/* Ad Placement 1: Under Hero */}
      <div className="container mx-auto px-4 py-4">
        <AdBanner size="leaderboard" position="under-hero" className="hidden md:flex" />
        <AdBanner size="mobile-banner" position="under-hero-mobile" className="flex md:hidden" />
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Ad Placement 2: Trending Section with Sidebar Ad */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="w-full lg:w-[70%]">
            <TrendingRow videos={trendingVideos} />
          </div>
          <div className="w-full lg:w-[30%] flex flex-col items-center justify-start">
            <AdBanner size="rectangle" position="trending-sidebar" className="hidden lg:flex sticky top-24" />
            <AdBanner size="mobile-banner" position="trending-bottom-mobile" className="flex lg:hidden mt-4" />
          </div>
        </div>

        {/* Redirect Toast */}
        <AnimatePresence>
          {toast?.show && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
            >
              <AlertCircle size={20} />
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popular Categories Section */}
        {isLoading ? (
          <div className="mb-12">
            <div className="h-8 bg-surface rounded w-48 mb-6 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {[...Array(8)].map((_, i) => <CategoryCardSkeleton key={i} />)}
            </div>
          </div>
        ) : (
          <PopularCategories categories={popularCategories} />
        )}

        {/* Popular Pornstars Section */}
        {isLoading ? (
          <div className="mb-12">
            <div className="h-8 bg-surface rounded w-48 mb-6 animate-pulse" />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => <PornstarCardSkeleton key={i} />)}
            </div>
          </div>
        ) : (
          <PopularPornstars actors={popularActors} />
        )}

        {/* Ad Placement 3: Top Ad Banner */}
        <AdBanner size="leaderboard" position="top-popular" className="hidden md:flex mb-12" />
        <AdBanner size="mobile-banner" position="top-popular-mobile" className="flex md:hidden mb-12" />

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Vidéos populaires</h2>
          <div className="flex gap-2">
            <button className="text-xs font-bold bg-surface hover:bg-muted/20 px-3 py-1 rounded transition-colors border border-muted">Plus récentes</button>
            <button className="text-xs font-bold bg-primary text-white px-3 py-1 rounded transition-colors">Tendance</button>
          </div>
        </div>

        {/* Video Grid with Native Ad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
          {isLoading ? (
            [...Array(12)].map((_, i) => <VideoCardSkeleton key={i} />)
          ) : (
            <>
              {popularList.slice(0, 4).map((video, idx) => (
                <VideoCard key={video.id} video={video} index={idx} />
              ))}
              
              <VideoCard 
                variant="sponsored"
                video={{
                  id: 'sponsored-1',
                  title: 'Découvrez notre nouveau contenu exclusif partenaire',
                  duration: 'AD',
                  views: 'Sponsorisé',
                  likes: '100%',
                  date: 'Maintenant',
                  category: 'Sponsorisé',
                  tags: ['HD'],
                  thumbnail: 'https://picsum.photos/seed/ads/320/180',
                  actor: 'Partenaire Premium',
                  actorId: '0'
                }} 
              />
              
              {popularList.slice(4).map((video, idx) => (
                <VideoCard key={video.id} video={video} index={idx + 4} />
              ))}

              {isMorePopularLoading && (
                [...Array(8)].map((_, i) => <VideoCardSkeleton key={`skeleton-pop-${i}`} />)
              )}
            </>
          )}
        </div>

        {/* Load More Popular */}
        {!isLoading && (
          <LoadMoreButton 
            onLoadMore={handleLoadMorePopular} 
            clickCount={popularClicks} 
            targetUrl="/popular"
            isLoadingExternal={isMorePopularLoading}
          />
        )}

        {/* Ad Placement Middle */}
        <div className="mt-12">
          <AdBanner size="leaderboard" position="between-popular-recent" className="hidden md:flex mb-12" />
          <AdBanner size="mobile-banner" position="between-popular-recent-mobile" className="flex md:hidden mb-12" />
        </div>

        {/* Recent Videos Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Clock className="text-primary" size={24} />
              Ajoutées récemment
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
            {isLoading ? (
              [...Array(8)].map((_, i) => <VideoCardSkeleton key={i} />)
            ) : (
              <>
                {recentList.map((video, idx) => (
                  <VideoCard key={video.id} video={video} index={idx} />
                ))}
                {isMoreRecentLoading && (
                  [...Array(8)].map((_, i) => <VideoCardSkeleton key={`skeleton-rec-${i}`} />)
                )}
              </>
            )}
          </div>

          {/* Load More Recent */}
          {!isLoading && (
            <LoadMoreButton 
              onLoadMore={handleLoadMoreRecent} 
              clickCount={recentClicks} 
              targetUrl="/recent"
              isLoadingExternal={isMoreRecentLoading}
            />
          )}
        </section>

        {/* Ad Placement Above Footer */}
        <div className="w-full flex justify-center py-12 border-t border-muted/20">
          <AdBanner size="rectangle" position="above-footer" />
        </div>
      </div>
    </motion.div>
  );
};
