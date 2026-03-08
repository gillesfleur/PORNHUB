import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdBanner } from '../components/AdBanner';
import { VideoCard } from '../components/VideoCard';
import { Pagination } from '../components/Pagination';
import { categories } from '../data/categories';
import { videos } from '../data/videos';
import { Filter, ArrowUpDown, Clock, Zap, Star, TrendingUp, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FilterSidebar, MobileFilterDrawer } from '../components/FilterSidebar';

type SortOption = 'popular' | 'recent' | 'top-rated' | 'longest' | 'shortest';
type DurationFilter = 'all' | '0-10' | '10-30' | '30+';

import { SEO } from '../components/SEO';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
  const [hdOnly, setHdOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const itemsPerPage = 12;

  const category = categories.find(c => c.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (category) {
      // SEO component handles title
    }
  }, [category]);

  const filteredVideos = useMemo(() => {
    if (!category) return [];

    let result = videos.filter(v => v.category.toLowerCase() === category.name.toLowerCase());

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
      case 'popular':
        result.sort((a, b) => {
          const viewsA = parseFloat(a.views.replace('K', '')) * (a.views.includes('K') ? 1000 : 1);
          const viewsB = parseFloat(b.views.replace('K', '')) * (b.views.includes('K') ? 1000 : 1);
          return viewsB - viewsA;
        });
        break;
      case 'recent':
        result.sort((a, b) => parseInt(a.date) - parseInt(b.date));
        break;
      case 'top-rated':
        result.sort((a, b) => parseInt(b.likes) - parseInt(a.likes));
        break;
      case 'longest':
        result.sort((a, b) => {
          const [minA, secA] = a.duration.split(':').map(Number);
          const [minB, secB] = b.duration.split(':').map(Number);
          return (minB * 60 + secB) - (minA * 60 + secA);
        });
        break;
      case 'shortest':
        result.sort((a, b) => {
          const [minA, secA] = a.duration.split(':').map(Number);
          const [minB, secB] = b.duration.split(':').map(Number);
          return (minA * 60 + secA) - (minB * 60 + secB);
        });
        break;
    }

    return result;
  }, [category, sortBy, durationFilter, hdOnly]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-4xl font-black text-main mb-4 uppercase tracking-tighter">Catégorie introuvable</h1>
        <p className="text-muted mb-8">La catégorie que vous recherchez n'existe pas ou a été supprimée.</p>
        <Link to="/categories" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all shadow-lg shadow-primary/20">
          Voir toutes les catégories
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20"
    >
      <SEO 
        title={category.name} 
        description={`Découvrez les meilleures vidéos de la catégorie ${category.name} sur VibeTube.`} 
      />
      {/* Category Header Banner */}
      <div className="relative h-48 sm:h-64 bg-zinc-900 overflow-hidden">
        {category.image ? (
          <img 
            src={category.image} 
            alt={category.name} 
            className="w-full h-full object-cover opacity-40 blur-sm scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-900/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-2xl mb-2"
          >
            {category.name}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-sm sm:text-base max-w-2xl font-medium italic"
          >
            {category.description || `Découvrez les meilleures vidéos de la catégorie ${category.name}.`}
          </motion.p>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 bg-primary text-white text-xs font-black px-4 py-1.5 rounded-full shadow-xl"
          >
            {category.videoCount.toLocaleString()} VIDÉOS
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="py-4">
          <Breadcrumb 
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Catégories', href: '/categories' },
              { label: category.name }
            ]} 
          />
        </div>

        {/* Ad Banner Top */}
        <AdBanner size="leaderboard" position="category-top" className="mb-8" />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar (Desktop) */}
          <FilterSidebar 
            currentCategory={category.name} 
            onApply={() => {}} 
            onReset={() => {}} 
          />

          {/* Main Content */}
          <div className="flex-grow">
            {/* Filters & Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface/50 p-4 rounded-2xl border border-muted/10 mb-8">
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                {/* Mobile Filter Button */}
                <button 
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                  <SlidersHorizontal size={14} />
                  Filtres
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-muted" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-background border border-muted/20 rounded-xl py-2 px-4 text-xs font-bold text-main focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="popular">Plus populaires</option>
                    <option value="recent">Plus récentes</option>
                    <option value="top-rated">Mieux notées</option>
                    <option value="longest">Plus longues</option>
                    <option value="shortest">Plus courtes</option>
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

            {/* Video Grid */}
            <AnimatePresence mode="wait">
              {paginatedVideos.length > 0 ? (
                <motion.div 
                  key={`${sortBy}-${durationFilter}-${hdOnly}-${currentPage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8"
                >
                  {paginatedVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-muted/30"
                >
                  <div className="text-6xl mb-4">🎬</div>
                  <h3 className="text-xl font-black text-main mb-2 uppercase tracking-tighter">Aucune vidéo trouvée</h3>
                  <p className="text-muted">Essayez d'ajuster vos filtres pour voir plus de contenu.</p>
                  <button 
                    onClick={() => {
                      setDurationFilter('all');
                      setHdOnly(false);
                      setSortBy('popular');
                    }}
                    className="mt-6 text-primary font-bold hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination 
                totalPages={totalPages} 
                initialPage={currentPage} 
                onPageChange={(page) => setCurrentPage(page)} 
              />
            )}
          </div>

          {/* Sidebar Ad */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-surface/30 p-4 rounded-2xl border border-muted/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
                  <Star size={14} className="text-primary" />
                  Sponsorisé
                </h3>
                <AdBanner size="rectangle" position="category-sidebar" />
              </div>
              
              <div className="bg-surface/30 p-4 rounded-2xl border border-muted/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
                  <TrendingUp size={14} className="text-primary" />
                  Populaire
                </h3>
                <div className="space-y-4">
                  {videos.slice(0, 3).map(v => (
                    <VideoCard key={v.id} video={v} variant="compact" />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <MobileFilterDrawer 
        isOpen={isFilterDrawerOpen} 
        onClose={() => setIsFilterDrawerOpen(false)} 
        currentCategory={category.name}
      />
    </motion.div>
  );
};
