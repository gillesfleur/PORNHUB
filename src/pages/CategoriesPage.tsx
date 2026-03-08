import React, { useState, useMemo, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdBanner } from '../components/AdBanner';
import { CategoryCard } from '../components/CategoryCard';
import { PageSkeleton } from '../components/Skeletons';
import { categories } from '../data/categories';
import { LayoutGrid, List, Search, ArrowUpDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

type SortOption = 'a-z' | 'z-a' | 'most-videos' | 'least-videos';

import { SEO } from '../components/SEO';

export const CategoriesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('a-z');

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedCategories = useMemo(() => {
    let result = categories.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case 'a-z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'z-a':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'most-videos':
        result.sort((a, b) => b.videoCount - a.videoCount);
        break;
      case 'least-videos':
        result.sort((a, b) => a.videoCount - b.videoCount);
        break;
    }

    return result;
  }, [searchQuery, sortBy]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6 pb-20"
    >
      <SEO 
        title="Catégories" 
        description="Explorez toutes les catégories de vidéos sur VibeTube. Trouvez exactement ce que vous cherchez." 
      />
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Catégories' }
        ]} 
      />

      {/* Header Section */}
      <div className="mt-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-main mb-4 uppercase tracking-tighter">
          Toutes les catégories
        </h1>
        <AdBanner size="leaderboard" position="categories-top" className="mb-8" />
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface/50 p-4 rounded-2xl border border-muted/10 mb-8">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text"
            placeholder="Filtrer les catégories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-muted/20 rounded-xl py-2.5 pl-12 pr-4 text-sm text-main focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Sort */}
          <div className="flex items-center gap-2 flex-grow md:flex-grow-0">
            <ArrowUpDown size={16} className="text-muted" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-background border border-muted/20 rounded-xl py-2 px-4 text-xs font-bold text-main focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
              <option value="most-videos">Plus de vidéos</option>
              <option value="least-videos">Moins de vidéos</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex bg-background border border-muted/20 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:text-main'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:text-main'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {filteredAndSortedCategories.length > 0 ? (
          <motion.div 
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredAndSortedCategories.map((category, index) => (
                  <CategoryCard key={category.id} category={category} index={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAndSortedCategories.map((category) => (
                  <Link 
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="flex items-center gap-4 bg-surface/50 hover:bg-surface p-4 rounded-2xl border border-muted/10 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl flex-shrink-0">
                      {category.name.charAt(0)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-main font-black uppercase tracking-tighter group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {category.videoCount.toLocaleString()} vidéos
                        </span>
                      </div>
                      <p className="text-xs text-muted line-clamp-1 italic">
                        {category.description || 'Découvrez tout le contenu de cette catégorie.'}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-main mb-2">Aucune catégorie trouvée</h3>
            <p className="text-muted">Essayez d'ajuster vos filtres de recherche.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Effacer la recherche
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
