import React, { useState, useMemo } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdBanner } from '../components/AdBanner';
import { tags } from '../data/tags';
import { Search, Hash, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const TagsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Alphabet for navigation
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Group tags by first letter
  const groupedTags = useMemo(() => {
    const groups: Record<string, typeof tags> = {};
    
    filteredTags.forEach(tag => {
      const firstLetter = tag.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(tag);
    });

    // Sort keys and tags within groups
    const sortedKeys = Object.keys(groups).sort();
    const result: Record<string, typeof tags> = {};
    
    sortedKeys.forEach(key => {
      result[key] = [...groups[key]].sort((a, b) => a.name.localeCompare(b.name));
    });

    return result;
  }, [filteredTags]);

  // Calculate tag cloud sizes based on videoCount
  const popularTags = useMemo(() => {
    return [...tags].sort((a, b) => b.videoCount - a.videoCount).slice(0, 30);
  }, []);

  const maxCount = Math.max(...popularTags.map(t => t.videoCount));
  const minCount = Math.min(...popularTags.map(t => t.videoCount));

  const getTagSize = (count: number) => {
    const minSize = 0.75; // rem
    const maxSize = 2.25; // rem
    if (maxCount === minCount) return 1.25;
    const size = minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize);
    return size;
  };

  const getTagColor = (count: number) => {
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.8) return 'text-primary font-black';
    if (ratio > 0.5) return 'text-main font-bold';
    return 'text-muted font-medium';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6 pb-20"
    >
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Tags' }
        ]} 
      />

      {/* Header */}
      <div className="mt-6 mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-main mb-6 uppercase tracking-tighter flex items-center gap-3">
          <TrendingUp className="text-primary" size={32} />
          Tags populaires
        </h1>

        {/* Tag Cloud */}
        <div className="bg-surface/30 p-8 rounded-3xl border border-muted/10 backdrop-blur-sm">
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4">
            {popularTags.map((tag) => (
              <Link 
                key={tag.id}
                to={`/tag/${tag.slug}`}
                style={{ fontSize: `${getTagSize(tag.videoCount)}rem` }}
                className={`${getTagColor(tag.videoCount)} hover:scale-110 hover:text-primary transition-all duration-300 block whitespace-nowrap`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Ad Banner */}
      <AdBanner size="leaderboard" position="tags-middle" className="mb-12" />

      {/* Alphabetical Index Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h2 className="text-2xl font-black text-main uppercase tracking-tighter flex items-center gap-3">
            <Hash className="text-primary" size={24} />
            Index alphabétique
          </h2>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text"
              placeholder="Rechercher un tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-muted/20 rounded-xl py-2.5 pl-12 pr-4 text-sm text-main focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Alphabet Navigation */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {alphabet.map(letter => (
            <a 
              key={letter}
              href={`#letter-${letter}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-all ${
                groupedTags[letter] 
                  ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white' 
                  : 'text-muted opacity-30 cursor-not-allowed'
              }`}
              onClick={(e) => {
                if (!groupedTags[letter]) e.preventDefault();
              }}
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Grouped Tags List */}
        <div className="space-y-12">
          {Object.keys(groupedTags).length > 0 ? (
            Object.entries(groupedTags).map(([letter, letterTags]) => (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-black text-primary/20">{letter}</span>
                  <div className="h-px flex-grow bg-muted/20" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-3">
                  {(letterTags as typeof tags).map((tag) => (
                    <Link 
                      key={tag.id}
                      to={`/tag/${tag.slug}`}
                      className="text-sm text-muted hover:text-primary transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate group-hover:font-bold">{tag.name}</span>
                      <span className="text-[10px] font-bold opacity-40 group-hover:opacity-100">
                        ({tag.videoCount})
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-muted">Aucun tag ne correspond à votre recherche.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};
