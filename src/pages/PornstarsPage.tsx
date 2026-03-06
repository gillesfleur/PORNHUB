import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdBanner } from '../components/AdBanner';
import { Pagination } from '../components/Pagination';
import { actors } from '../data/actors';
import { videos } from '../data/videos';
import { Search, Star, Users, User, UserCheck, ArrowUpDown, ChevronRight, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SortOption = 'popular' | 'az' | 'za' | 'videos';
type GenderFilter = 'all' | 'female' | 'male';

export const PornstarsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Pornstars - VibeTube';
  }, []);

  // Calculate total views for each actor
  const actorsWithStats = useMemo(() => {
    return actors.map(actor => {
      const actorVideos = videos.filter(v => v.actorId === actor.id);
      const totalViews = actorVideos.reduce((acc, v) => {
        const views = parseFloat(v.views.replace('K', '')) * (v.views.includes('K') ? 1000 : 1);
        return acc + views;
      }, 0);
      return { ...actor, totalViews };
    });
  }, []);

  const filteredActors = useMemo(() => {
    let result = [...actorsWithStats];

    // Search Filter
    if (searchQuery) {
      result = result.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Gender Filter
    if (genderFilter !== 'all') {
      result = result.filter(a => a.gender === genderFilter);
    }

    // Sorting
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.totalViews - a.totalViews);
        break;
      case 'az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'videos':
        result.sort((a, b) => b.videoCount - a.videoCount);
        break;
    }

    return result;
  }, [actorsWithStats, searchQuery, genderFilter, sortBy]);

  const totalPages = Math.ceil(filteredActors.length / itemsPerPage);
  const paginatedActors = filteredActors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const slugify = (text: string) => {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
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
              { label: 'Pornstars' }
            ]} 
          />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-main uppercase tracking-tighter mb-4">Pornstars</h1>
          <AdBanner size="leaderboard" position="pornstars-top" className="mb-8" />
        </div>

        {/* Filters Bar */}
        <div className="bg-surface/50 p-6 rounded-3xl border border-muted/10 mb-10 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                type="text"
                placeholder="Rechercher par nom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-muted/20 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Gender & Sort */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-center">
              {/* Gender Toggle */}
              <div className="flex items-center gap-1 bg-background border border-muted/20 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'Tous', icon: Users },
                  { id: 'female', label: 'Femmes', icon: User },
                  { id: 'male', label: 'Hommes', icon: UserCheck }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGenderFilter(g.id as GenderFilter)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      genderFilter === g.id 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-muted hover:text-main'
                    }`}
                  >
                    <g.icon size={12} />
                    {g.label}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-muted" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-background border border-muted/20 rounded-xl py-2.5 px-4 text-xs font-bold text-main focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                >
                  <option value="popular">Plus populaires</option>
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                  <option value="videos">Plus de vidéos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Alphabetical Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-1 pt-4 border-t border-muted/10">
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => setSearchQuery(letter)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all ${
                  searchQuery.toUpperCase() === letter 
                    ? 'bg-primary text-white' 
                    : 'text-muted hover:bg-muted/10 hover:text-main'
                }`}
              >
                {letter}
              </button>
            ))}
            <button 
              onClick={() => setSearchQuery('')}
              className="px-3 h-8 flex items-center justify-center rounded-lg text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all"
            >
              Effacer
            </button>
          </div>
        </div>

        {/* Actors Grid */}
        <AnimatePresence mode="wait">
          {paginatedActors.length > 0 ? (
            <motion.div 
              key={`${genderFilter}-${sortBy}-${searchQuery}-${currentPage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
            >
              {paginatedActors.map((actor, idx) => {
                const isTop = (currentPage === 1 && idx < 3 && sortBy === 'popular');
                return (
                  <Link 
                    key={actor.id}
                    to={`/pornstar/${actor.slug}`}
                    className="group relative flex flex-col bg-surface rounded-2xl overflow-hidden border border-muted/10 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Photo Container */}
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <img 
                        src={actor.photo} 
                        alt={actor.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      
                      {/* Top Badge */}
                      {isTop && (
                        <div className="absolute top-3 left-3 bg-yellow-500 text-black p-1.5 rounded-lg shadow-lg flex items-center gap-1 animate-pulse">
                          <Star size={14} fill="currentColor" />
                          <span className="text-[10px] font-black uppercase tracking-tighter">Top</span>
                        </div>
                      )}

                      {/* Video Count Overlay */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-md border border-white/10">
                        {actor.videoCount} VIDÉOS
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-main font-black uppercase tracking-tight group-hover:text-primary transition-colors truncate">
                        {actor.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-muted text-[10px] font-bold uppercase tracking-widest">
                          <TrendingUp size={12} className="text-primary" />
                          {formatViews(actor.totalViews)} vues
                        </div>
                        <ChevronRight size={14} className="text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-muted/30">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-xl font-black text-main mb-2 uppercase tracking-tighter">Aucun profil trouvé</h3>
              <p className="text-muted">Aucun pornstar ne correspond à votre recherche ou vos filtres.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setGenderFilter('all');
                  setSortBy('popular');
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
    </motion.div>
  );
};
