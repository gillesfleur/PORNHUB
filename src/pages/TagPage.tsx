import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdBanner } from '../components/AdBanner';
import { VideoCard } from '../components/VideoCard';
import { Pagination } from '../components/Pagination';
import { tags } from '../data/tags';
import { videos } from '../data/videos';
import { ArrowUpDown, Zap, Star, TrendingUp, Tag as TagIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SortOption = 'popular' | 'recent' | 'top-rated' | 'longest' | 'shortest';
type DurationFilter = 'all' | '0-10' | '10-30' | '30+';

export const TagPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
  const [hdOnly, setHdOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const tag = tags.find(t => t.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (tag) {
      document.title = `Vidéos ${tag.name} - VibeTube`;
    }
  }, [tag]);

  // Related tags (random 6 tags excluding current)
  const relatedTags = useMemo(() => {
    if (!tag) return [];
    return [...tags]
      .filter(t => t.id !== tag.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
  }, [tag]);

  const filteredVideos = useMemo(() => {
    if (!tag) return [];

    let result = videos.filter(v => v.tags.some(t => t.toLowerCase() === tag.name.toLowerCase()));

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
  }, [tag, sortBy, durationFilter, hdOnly]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!tag) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-4xl font-black text-main mb-4 uppercase tracking-tighter">Tag introuvable</h1>
        <p className="text-muted mb-8">Le tag que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link to="/tags" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all shadow-lg shadow-primary/20">
          Voir tous les tags
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
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="py-6">
          <Breadcrumb 
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Tags', href: '/tags' },
              { label: tag.name }
            ]} 
          />
        </div>

        {/* Tag Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-2">
                <TagIcon size={14} />
                Exploration par tag
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-main uppercase tracking-tighter">
                Vidéos tagguées : <span className="text-primary">{tag.name}</span>
              </h1>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted font-bold">
                <span>{tag.videoCount.toLocaleString()} vidéos trouvées</span>
                <span className="w-1.5 h-1.5 rounded-full bg-muted/30" />
                <span>Mise à jour en temps réel</span>
              </div>
            </div>

            {/* Related Tags */}
            <div className="flex flex-wrap gap-2 max-w-md md:justify-end">
              {relatedTags.map(rt => (
                <Link 
                  key={rt.id}
                  to={`/tag/${rt.slug}`}
                  className="px-3 py-1.5 bg-surface border border-muted/20 rounded-full text-[10px] font-black uppercase tracking-wider text-muted hover:border-primary hover:text-primary transition-all"
                >
                  {rt.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Ad Banner Top */}
        <AdBanner size="leaderboard" position="tag-top" className="mb-8" />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-grow">
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
                  <p className="text-muted">Aucune vidéo ne correspond au tag "{tag.name}" avec ces filtres.</p>
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
                <AdBanner size="rectangle" position="tag-sidebar" />
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
    </motion.div>
  );
};
