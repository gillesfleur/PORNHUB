import React, { useState, useMemo, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdBanner } from '../components/AdBanner';
import { VideoCard } from '../components/VideoCard';
import { Pagination } from '../components/Pagination';
import { videos } from '../data/videos';
import { ArrowUpDown, Zap, TrendingUp, Calendar, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Period = 'today' | 'week' | 'month' | 'all';
type DurationFilter = 'all' | '0-10' | '10-30' | '30+';
type SortOption = 'likes' | 'views' | 'recent';

export const TopRatedPage: React.FC = () => {
  const [period, setPeriod] = useState<Period>('all');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
  const [hdOnly, setHdOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('likes');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Vidéos les mieux notées - VibeTube';
  }, []);

  const filteredVideos = useMemo(() => {
    let result = [...videos];

    // Simulated Period Filter
    if (period === 'today') result = result.slice(0, 10);
    else if (period === 'week') result = result.slice(0, 20);
    else if (period === 'month') result = result.slice(0, 30);

    // Quality Filter
    if (hdOnly) {
      result = result.filter(v => v.tags.includes('HD'));
    }

    // Duration Filter
    if (durationFilter !== 'all') {
      result = result.filter(v => {
        const minutes = parseInt(v.duration.split(':')[0]);
        if (durationFilter === '0-10') return minutes <= 10;
        if (durationFilter === '10-30') return minutes > 10 && minutes <= 30;
        if (durationFilter === '30+') return minutes > 30;
        return true;
      });
    }

    // Sorting
    switch (sortBy) {
      case 'likes':
        result.sort((a, b) => {
          const likesA = parseInt(a.likes.replace('%', ''));
          const likesB = parseInt(b.likes.replace('%', ''));
          return likesB - likesA;
        });
        break;
      case 'views':
        result.sort((a, b) => {
          const viewsA = parseFloat(a.views.replace('K', '')) * (a.views.includes('K') ? 1000 : 1);
          const viewsB = parseFloat(b.views.replace('K', '')) * (b.views.includes('K') ? 1000 : 1);
          return viewsB - viewsA;
        });
        break;
      case 'recent':
        result.sort((a, b) => parseInt(b.date) - parseInt(a.date));
        break;
    }

    return result;
  }, [period, durationFilter, hdOnly, sortBy]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              { label: 'Vidéos les mieux notées' }
            ]} 
          />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-main uppercase tracking-tighter mb-4 flex items-center gap-3">
            <span className="text-primary">⭐</span> Vidéos les mieux notées
          </h1>
          <AdBanner size="leaderboard" position="top-rated-top" className="mb-8" />
        </div>

        {/* Period Navigation */}
        <div className="flex items-center gap-2 bg-surface/50 border border-muted/10 p-1.5 rounded-2xl mb-8 w-fit overflow-x-auto max-w-full">
          {[
            { id: 'today', label: "Aujourd'hui" },
            { id: 'week', label: 'Cette semaine' },
            { id: 'month', label: 'Ce mois' },
            { id: 'all', label: 'Toujours' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as Period)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                period === p.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-muted hover:text-main hover:bg-background'
              }`}
            >
              <Calendar size={14} />
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-grow min-w-0">
            {/* Filters & Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface/50 p-4 rounded-2xl border border-muted/10 mb-8">
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-muted" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-background border border-muted/20 rounded-xl py-2 px-4 text-xs font-bold text-main focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="likes">Mieux notées</option>
                    <option value="views">Plus de vues</option>
                    <option value="recent">Plus récentes</option>
                  </select>
                </div>

                {/* HD Toggle */}
                <button 
                  onClick={() => setHdOnly(!hdOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                    hdOnly 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-background border-muted/20 text-muted hover:border-primary/50 hover:text-main'
                  }`}
                >
                  <Zap size={14} className={hdOnly ? 'fill-white' : ''} />
                  HD UNIQUEMENT
                </button>
              </div>

              {/* Duration Filters */}
              <div className="flex items-center gap-2 bg-background border border-muted/20 rounded-xl p-1 w-full sm:w-auto overflow-x-auto">
                {[
                  { id: 'all', label: 'Toutes' },
                  { id: '0-10', label: '0-10 min' },
                  { id: '10-30', label: '10-30 min' },
                  { id: '30+', label: '30+ min' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setDurationFilter(filter.id as DurationFilter)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                      durationFilter === filter.id 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-muted hover:text-main'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Grid with Native Ad */}
            <AnimatePresence mode="wait">
              {paginatedVideos.length > 0 ? (
                <motion.div 
                  key={`${period}-${sortBy}-${durationFilter}-${hdOnly}-${currentPage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8"
                >
                  {paginatedVideos.map((video, index) => (
                    <React.Fragment key={video.id}>
                      <VideoCard video={video} showRating={true} />
                      {/* Insert Native Ad after 4th video */}
                      {index === 3 && (
                        <div className="sm:col-span-2 lg:col-span-1">
                          <AdBanner size="native" position="top-rated-grid" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-muted/30">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-xl font-black text-main mb-2 uppercase tracking-tighter">Aucune vidéo trouvée</h3>
                  <p className="text-muted">Essayez d'ajuster vos filtres ou changez de période.</p>
                  <button 
                    onClick={() => {
                      setPeriod('all');
                      setDurationFilter('all');
                      setHdOnly(false);
                      setSortBy('likes');
                    }}
                    className="mt-6 text-primary font-bold hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </AnimatePresence>

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
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0 space-y-8">
            <div className="sticky top-24 space-y-8">
              <div className="bg-surface/30 p-6 rounded-3xl border border-muted/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-6 flex items-center gap-2">
                  <Star size={16} className="text-primary" />
                  Sponsorisé
                </h3>
                <AdBanner size="rectangle" position="top-rated-sidebar" />
              </div>

              <div className="bg-surface/30 p-6 rounded-3xl border border-muted/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-6 flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  Tendances
                </h3>
                <div className="space-y-4">
                  {videos.slice(0, 4).map(v => (
                    <VideoCard key={v.id} video={v} variant="compact" />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};
