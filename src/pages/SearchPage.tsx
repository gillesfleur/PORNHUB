import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdBanner } from '../components/AdBanner';
import { VideoCard } from '../components/VideoCard';
import { Pagination } from '../components/Pagination';
import { PornstarCard } from '../components/PornstarCard';
import { CategoryCard } from '../components/CategoryCard';
import { videos } from '../data/videos';
import { actors } from '../data/actors';
import { categories } from '../data/categories';
import { tags } from '../data/tags';
import { 
  Search as SearchIcon, 
  Play, 
  User, 
  Folder, 
  ArrowUpDown, 
  Zap, 
  Filter,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SearchTab = 'videos' | 'pornstars' | 'categories';
type SortOption = 'popular' | 'recent' | 'top-rated' | 'longest' | 'shortest';
type DurationFilter = 'all' | '0-10' | '10-30' | '30+';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [activeTab, setActiveTab] = useState<SearchTab>('videos');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
  const [hdOnly, setHdOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (query) {
      document.title = `Résultats pour "${query}" - VibeTube`;
    }
  }, [query]);

  // Reset page on tab or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, sortBy, durationFilter, hdOnly, query]);

  // Search Logic
  const filteredResults = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    
    const matchedVideos = videos.filter(v => 
      v.title.toLowerCase().includes(lowerQuery) ||
      v.category.toLowerCase().includes(lowerQuery) ||
      v.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
      v.actor.toLowerCase().includes(lowerQuery)
    );

    const matchedActors = actors.filter(a => 
      a.name.toLowerCase().includes(lowerQuery)
    );

    const matchedCategories = categories.filter(c => 
      c.name.toLowerCase().includes(lowerQuery)
    );

    return {
      videos: matchedVideos,
      actors: matchedActors,
      categories: matchedCategories
    };
  }, [query]);

  // Apply Video Filters
  const processedVideos = useMemo(() => {
    let result = [...filteredResults.videos];

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
  }, [filteredResults.videos, sortBy, durationFilter, hdOnly]);

  const totalPages = Math.ceil(processedVideos.length / itemsPerPage);
  const paginatedVideos = processedVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isEmpty = query.length > 0 && 
    filteredResults.videos.length === 0 && 
    filteredResults.actors.length === 0 && 
    filteredResults.categories.length === 0;

  const popularTags = useMemo(() => {
    return [...tags].sort((a, b) => b.videoCount - a.videoCount).slice(0, 15);
  }, []);

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
              { label: 'Recherche', href: '/search' },
              { label: query || 'Tous les résultats' }
            ]} 
          />
        </div>

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-main uppercase tracking-tighter mb-2">
            Résultats pour <span className="text-primary">"{query}"</span>
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted font-bold">
            <span>{filteredResults.videos.length} vidéos trouvées</span>
            <span className="w-1.5 h-1.5 rounded-full bg-muted/30" />
            <span>{filteredResults.actors.length} pornstars</span>
            <span className="w-1.5 h-1.5 rounded-full bg-muted/30" />
            <span>{filteredResults.categories.length} catégories</span>
          </div>
        </div>

        {/* Ad Banner Top */}
        <AdBanner size="leaderboard" position="search-top" className="mb-8" />

        {/* Tabs & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between mb-8">
          {/* Type Tabs */}
          <div className="flex items-center gap-1 bg-surface border border-muted/20 p-1 rounded-2xl w-full lg:w-auto overflow-x-auto">
            {[
              { id: 'videos', label: 'Vidéos', icon: Play, count: filteredResults.videos.length },
              { id: 'pornstars', label: 'Pornstars', icon: User, count: filteredResults.actors.length },
              { id: 'categories', label: 'Catégories', icon: Folder, count: filteredResults.categories.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SearchTab)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-muted hover:text-main hover:bg-background'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                <span className={`ml-1 text-[10px] opacity-60 ${activeTab === tab.id ? 'text-white' : ''}`}>
                  ({tab.count})
                </span>
              </button>
            ))}
          </div>

          {/* Video Specific Filters */}
          {activeTab === 'videos' && (
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              {/* Sort */}
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
                HD
              </button>

              {/* Duration */}
              <div className="flex items-center gap-1 bg-background border border-muted/20 rounded-xl p-1">
                {['all', '0-10', '10-30', '30+'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDurationFilter(d as DurationFilter)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      durationFilter === d 
                        ? 'bg-primary text-white' 
                        : 'text-muted hover:text-main'
                    }`}
                  >
                    {d === 'all' ? 'Toutes' : d}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-muted/30"
            >
              <div className="relative inline-block mb-6">
                <SearchIcon size={80} className="text-muted/20" />
                <AlertCircle size={32} className="text-primary absolute -bottom-2 -right-2" />
              </div>
              <h3 className="text-2xl font-black text-main mb-2 uppercase tracking-tighter">Aucun résultat pour "{query}"</h3>
              <p className="text-muted mb-8 max-w-md mx-auto">
                Nous n'avons trouvé aucun contenu correspondant à votre recherche. 
                Essayez avec des termes plus généraux ou explorez nos tags populaires.
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                {popularTags.map(tag => (
                  <Link 
                    key={tag.id}
                    to={`/tag/${tag.slug}`}
                    className="px-4 py-2 bg-background border border-muted/20 rounded-xl text-xs font-bold text-muted hover:border-primary hover:text-primary transition-all"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'videos' && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
                    {paginatedVideos.map((video, index) => (
                      <React.Fragment key={video.id}>
                        <VideoCard video={video} />
                        {/* Native Ad between 4th and 5th result */}
                        {index === 3 && (
                          <VideoCard 
                            variant="sponsored"
                            video={{
                              id: 'search-native-ad',
                              title: 'Découvrez notre contenu partenaire exclusif',
                              duration: 'AD',
                              views: 'Sponsorisé',
                              likes: '100%',
                              date: 'Maintenant',
                              category: 'Sponsorisé',
                              tags: ['HD'],
                              thumbnail: 'https://picsum.photos/seed/search-ad/320/180',
                              actor: 'Partenaire Premium',
                              actorId: '0'
                            }} 
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <Pagination 
                      totalPages={totalPages} 
                      initialPage={currentPage} 
                      onPageChange={(page) => setCurrentPage(page)} 
                    />
                  )}
                </div>
              )}

              {activeTab === 'pornstars' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {filteredResults.actors.map((actor, index) => (
                    <PornstarCard key={actor.id} actor={actor} index={index} />
                  ))}
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredResults.categories.map((category, index) => (
                    <CategoryCard key={category.id} category={category} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
