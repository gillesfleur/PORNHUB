import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Play, Folder, User, ArrowRight } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { videos } from '../data/videos';
import { categories } from '../data/categories';
import { actors } from '../data/actors';

interface SearchBarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ isMobile, onClose }) => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync query with URL change
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Filter suggestions
  const suggestions = useMemo(() => {
    if (query.length < 2) return { videos: [], categories: [], actors: [] };

    const lowerQuery = query.toLowerCase();
    
    return {
      videos: videos
        .filter(v => v.title.toLowerCase().includes(lowerQuery))
        .slice(0, 5),
      categories: categories
        .filter(c => c.name.toLowerCase().includes(lowerQuery))
        .slice(0, 3),
      actors: actors
        .filter(a => a.name.toLowerCase().includes(lowerQuery))
        .slice(0, 3)
    };
  }, [query]);

  const allSuggestions = useMemo(() => {
    return [
      ...suggestions.videos.map(v => ({ type: 'video', data: v })),
      ...suggestions.categories.map(c => ({ type: 'category', data: c })),
      ...suggestions.actors.map(a => ({ type: 'actor', data: a }))
    ];
  }, [suggestions]);

  const hasSuggestions = allSuggestions.length > 0;

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < allSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        const item = allSuggestions[selectedIndex];
        handleSelect(item);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
      if (isMobile && onClose) onClose();
    }
  };

  const slugify = (text: string) => {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleSelect = (item: any) => {
    setIsFocused(false);
    setQuery('');
    if (onClose) onClose();

    if (item.type === 'video') {
      navigate(`/video/${slugify(item.data.title)}`);
    } else if (item.type === 'category') {
      navigate(`/category/${item.data.slug}`);
    } else if (item.type === 'actor') {
      navigate(`/pornstar/${item.data.slug}`);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
      if (onClose) onClose();
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  // Focus input on mobile mount
  useEffect(() => {
    if (isMobile) {
      inputRef.current?.focus();
    }
  }, [isMobile]);

  return (
    <div 
      ref={containerRef}
      className={`relative transition-all duration-300 ease-in-out ${
        isMobile ? 'w-full max-w-2xl' : isFocused ? 'flex-1 max-w-2xl' : 'flex-1 max-w-md'
      }`}
    >
      <div className="relative flex items-center">
        <div className="absolute left-4 text-muted pointer-events-none">
          <Search size={18} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher une vidéo, un acteur..."
          className={`w-full bg-background border border-muted rounded-full py-2.5 px-4 pl-12 pr-24 text-main focus:outline-none focus:border-primary transition-all ${
            isMobile ? 'text-lg py-4 pl-14' : ''
          }`}
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button 
              onClick={clearSearch}
              className="p-2 text-muted hover:text-main transition-colors"
            >
              <X size={18} />
            </button>
          )}
          
          <button 
            onClick={handleSearch}
            className={`bg-primary text-white p-2 rounded-full hover:bg-orange-600 transition-colors ${
              isMobile ? 'p-3' : ''
            }`}
          >
            {isMobile ? <ArrowRight size={24} /> : <Search size={18} />}
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute top-full left-0 right-0 mt-2 bg-surface border border-muted rounded-2xl shadow-2xl overflow-hidden z-[100] ${
              isMobile ? 'max-h-[60vh] overflow-y-auto' : ''
            }`}
          >
            {hasSuggestions ? (
              <div className="p-2">
                {/* Videos Section */}
                {suggestions.videos.length > 0 && (
                  <div className="mb-2">
                    <div className="px-3 py-1 text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <Play size={10} />
                      Suggestions
                    </div>
                    {suggestions.videos.map((video, idx) => {
                      const globalIdx = idx;
                      return (
                        <button
                          key={video.id}
                          onClick={() => handleSelect({ type: 'video', data: video })}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-colors ${
                            selectedIndex === globalIdx ? 'bg-primary/10 text-primary' : 'text-main hover:bg-background'
                          }`}
                        >
                          <div className="w-10 h-6 bg-zinc-800 rounded overflow-hidden shrink-0">
                            <img src={video.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <span className="text-sm font-medium truncate">{video.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Categories Section */}
                {suggestions.categories.length > 0 && (
                  <div className="mb-2">
                    <div className="px-3 py-1 text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <Folder size={10} />
                      Catégories
                    </div>
                    {suggestions.categories.map((cat, idx) => {
                      const globalIdx = suggestions.videos.length + idx;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleSelect({ type: 'category', data: cat })}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-colors ${
                            selectedIndex === globalIdx ? 'bg-primary/10 text-primary' : 'text-main hover:bg-background'
                          }`}
                        >
                          <Folder size={14} className="text-muted" />
                          <span className="text-sm font-medium">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Actors Section */}
                {suggestions.actors.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <User size={10} />
                      Pornstars
                    </div>
                    {suggestions.actors.map((actor, idx) => {
                      const globalIdx = suggestions.videos.length + suggestions.categories.length + idx;
                      return (
                        <button
                          key={actor.id}
                          onClick={() => handleSelect({ type: 'actor', data: actor })}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-colors ${
                            selectedIndex === globalIdx ? 'bg-primary/10 text-primary' : 'text-main hover:bg-background'
                          }`}
                        >
                          <div className="w-6 h-6 rounded-full bg-zinc-800 overflow-hidden shrink-0">
                            <img src={actor.photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <span className="text-sm font-medium">{actor.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-muted">
                <p className="text-sm">Aucun résultat pour "{query}"</p>
              </div>
            )}
            
            <button 
              onClick={handleSearch}
              className="w-full bg-background/50 p-3 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Voir tous les résultats pour "{query}"
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
