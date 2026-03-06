import React, { useEffect, useMemo } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdBanner } from '../components/AdBanner';
import { VideoCard } from '../components/VideoCard';
import { Pagination } from '../components/Pagination';
import { videos } from '../data/videos';
import { categories } from '../data/categories';
import { actors } from '../data/actors';
import { TrendingUp, Star, Award, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const TrendingPage: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Tendances - VibeTube';
  }, []);

  // Sort videos by views for trending effect
  const trendingVideos = useMemo(() => {
    return [...videos].sort((a, b) => {
      const viewsA = parseFloat(a.views.replace('K', '')) * (a.views.includes('K') ? 1000 : 1);
      const viewsB = parseFloat(b.views.replace('K', '')) * (b.views.includes('K') ? 1000 : 1);
      return viewsB - viewsA;
    });
  }, []);

  const top10 = trendingVideos.slice(0, 10);
  const remainingVideos = trendingVideos.slice(10);

  const totalPages = Math.ceil(remainingVideos.length / itemsPerPage);
  const paginatedVideos = remainingVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Trending categories (top 5)
  const trendingCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) => b.videoCount - a.videoCount)
      .slice(0, 5);
  }, []);

  // Trending actors (top 3)
  const trendingActors = actors.slice(0, 3);

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-500'; // Gold
      case 1: return 'text-slate-400';  // Silver
      case 2: return 'text-amber-700';  // Bronze
      default: return 'text-muted/40';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20"
    >
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="py-6">
          <Breadcrumb 
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Tendances' }
            ]} 
          />
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-main uppercase tracking-tighter mb-2 flex items-center gap-3">
            <TrendingUp size={36} className="text-primary" />
            Tendances
          </h1>
          <p className="text-muted font-medium">Les vidéos qui font le buzz en ce moment sur VibeTube.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-grow min-w-0">
            
            {/* Top 10 Section */}
            <section className="bg-surface/30 rounded-3xl border border-muted/10 overflow-hidden mb-12">
              <div className="p-6 border-b border-muted/10 bg-surface/50 flex items-center justify-between">
                <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                  <Award className="text-primary" size={24} />
                  Le Top 10 du moment
                </h2>
                <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">
                  Mise à jour : En direct
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-muted/10">
                {top10.map((video, index) => (
                  <div key={video.id} className="bg-surface/20 p-4 flex items-center gap-4 hover:bg-surface/40 transition-colors group">
                    <div className={`text-4xl sm:text-5xl font-black italic shrink-0 w-12 sm:w-16 text-center select-none ${getRankColor(index)}`}>
                      {index + 1}
                    </div>
                    <div className="flex-grow min-w-0">
                      <VideoCard video={video} variant="horizontal" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Ad Banner Middle */}
            <AdBanner size="leaderboard" position="trending-middle" className="mb-12" />

            {/* Also Trending Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                  Aussi en tendance
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                {paginatedVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination 
                    totalPages={totalPages} 
                    initialPage={currentPage} 
                    onPageChange={(page) => setCurrentPage(page)} 
                  />
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0 space-y-10">
            <div className="sticky top-24 space-y-10">
              
              {/* Trending Categories */}
              <div className="bg-surface/30 p-6 rounded-3xl border border-muted/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-6 flex items-center gap-2">
                  <Star size={16} className="text-primary" />
                  Catégories en tendance
                </h3>
                <div className="space-y-3">
                  {trendingCategories.map((cat, index) => (
                    <Link 
                      key={cat.id} 
                      to={`/category/${cat.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-surface transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-muted/40 w-4">{index + 1}</span>
                        <span className="text-sm font-bold text-main group-hover:text-primary transition-colors">{cat.name}</span>
                      </div>
                      <ChevronRight size={14} className="text-muted group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Ad Banner Sidebar */}
              <AdBanner size="rectangle" position="trending-sidebar" />

              {/* Trending Pornstars */}
              <div className="bg-surface/30 p-6 rounded-3xl border border-muted/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-6 flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  Pornstars en tendance
                </h3>
                <div className="space-y-4">
                  {trendingActors.map((actor) => (
                    <Link 
                      key={actor.id} 
                      to={`/pornstar/${actor.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-muted group-hover:border-primary transition-colors shrink-0">
                        <img 
                          src={actor.photo} 
                          alt={actor.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-main truncate group-hover:text-primary transition-colors">{actor.name}</h4>
                        <p className="text-[10px] text-muted font-medium uppercase tracking-wider">{actor.videoCount} Vidéos</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link 
                  to="/pornstars" 
                  className="mt-6 block text-center text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                >
                  Voir tout le classement
                </Link>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};
