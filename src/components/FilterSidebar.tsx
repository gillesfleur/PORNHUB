import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, X, Filter as FilterIcon } from 'lucide-react';
import { categories } from '../data/categories';
import { motion, AnimatePresence } from 'motion/react';

interface FilterSidebarProps {
  currentCategory?: string;
  onApply?: () => void;
  onReset?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  currentCategory,
  onApply,
  onReset
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [showAllCats, setShowAllCats] = useState(false);

  const filteredCats = categories.filter(c => 
    c.name.toLowerCase().includes(catSearch.toLowerCase())
  );

  const displayedCats = showAllCats ? filteredCats : filteredCats.slice(0, 8);

  return (
    <aside className={`hidden lg:block transition-all duration-300 shrink-0 ${isCollapsed ? 'w-12' : 'w-[240px]'}`}>
      <div className="sticky top-24 space-y-6">
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-0 bg-primary text-white p-1 rounded-full shadow-lg z-10"
        >
          {isCollapsed ? <FilterIcon size={14} /> : <X size={14} />}
        </button>

        {!isCollapsed && (
          <div className="bg-surface/50 rounded-2xl border border-muted/10 p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tighter text-main">Filtres</h2>
              <button onClick={onReset} className="text-[10px] font-bold text-primary hover:underline">Réinitialiser</button>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted">Catégories</h3>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted" size={12} />
                <input 
                  type="text" 
                  placeholder="Rechercher..."
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  className="w-full bg-background border border-muted/20 rounded-lg py-1.5 pl-7 pr-2 text-[11px] focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {displayedCats.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      defaultChecked={currentCategory?.toLowerCase() === cat.name.toLowerCase()}
                      className="w-3.5 h-3.5 rounded border-muted/30 text-primary focus:ring-primary bg-background"
                    />
                    <span className="text-xs text-muted group-hover:text-main transition-colors">{cat.name}</span>
                  </label>
                ))}
              </div>
              {filteredCats.length > 8 && (
                <button 
                  onClick={() => setShowAllCats(!showAllCats)}
                  className="text-[10px] font-bold text-primary flex items-center gap-1"
                >
                  {showAllCats ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {showAllCats ? 'Voir moins' : 'Voir plus'}
                </button>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted">Durée</h3>
              <div className="space-y-2">
                {['Toutes', '0-5 min', '5-20 min', '20-60 min', '60+ min'].map(label => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="duration"
                      defaultChecked={label === 'Toutes'}
                      className="w-3.5 h-3.5 border-muted/30 text-primary focus:ring-primary bg-background"
                    />
                    <span className="text-xs text-muted group-hover:text-main transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted">Qualité</h3>
              <div className="space-y-2">
                {['HD', 'Full HD', '4K'].map(label => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 rounded border-muted/30 text-primary focus:ring-primary bg-background"
                    />
                    <span className="text-xs text-muted group-hover:text-main transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Added */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted">Date d'ajout</h3>
              <div className="space-y-2">
                {['Toutes', "Aujourd'hui", 'Cette semaine', 'Ce mois', 'Cette année'].map(label => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="date"
                      defaultChecked={label === 'Toutes'}
                      className="w-3.5 h-3.5 border-muted/30 text-primary focus:ring-primary bg-background"
                    />
                    <span className="text-xs text-muted group-hover:text-main transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted">Tri</h3>
              <div className="space-y-2">
                {['Pertinence', 'Plus vues', 'Plus récentes', 'Mieux notées', 'Plus longues'].map(label => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="sort"
                      defaultChecked={label === 'Pertinence'}
                      className="w-3.5 h-3.5 border-muted/30 text-primary focus:ring-primary bg-background"
                    />
                    <span className="text-xs text-muted group-hover:text-main transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={onApply}
              className="w-full bg-primary text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all"
            >
              Appliquer les filtres
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export const MobileFilterDrawer: React.FC<{ isOpen: boolean; onClose: () => void; currentCategory?: string }> = ({ 
  isOpen, 
  onClose,
  currentCategory
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          {/* Drawer */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-[32px] z-[101] max-h-[90vh] overflow-y-auto p-6 pb-10"
          >
            <div className="w-12 h-1.5 bg-muted/20 rounded-full mx-auto mb-6" />
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-main">Filtres</h2>
              <button onClick={onClose} className="p-2 bg-muted/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted">Catégories</h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.slice(0, 10).map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 p-3 bg-background border border-muted/10 rounded-xl">
                      <input 
                        type="checkbox" 
                        defaultChecked={currentCategory?.toLowerCase() === cat.name.toLowerCase()}
                        className="w-4 h-4 rounded border-muted/30 text-primary focus:ring-primary bg-background"
                      />
                      <span className="text-xs font-bold text-main">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted">Durée</h3>
                <div className="flex flex-wrap gap-2">
                  {['Toutes', '0-5 min', '5-20 min', '20-60 min', '60+ min'].map(label => (
                    <label key={label} className="flex items-center gap-2 px-4 py-2 bg-background border border-muted/10 rounded-full">
                      <input 
                        type="radio" 
                        name="mob-duration"
                        defaultChecked={label === 'Toutes'}
                        className="w-4 h-4 border-muted/30 text-primary focus:ring-primary bg-background"
                      />
                      <span className="text-xs font-bold text-main">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted">Qualité</h3>
                <div className="flex gap-2">
                  {['HD', 'Full HD', '4K'].map(label => (
                    <label key={label} className="flex items-center gap-2 px-4 py-2 bg-background border border-muted/10 rounded-full">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-muted/30 text-primary focus:ring-primary bg-background"
                      />
                      <span className="text-xs font-bold text-main">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted">Trier par</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Pertinence', 'Plus vues', 'Plus récentes', 'Mieux notées', 'Plus longues'].map(label => (
                    <label key={label} className="flex items-center gap-2 p-3 bg-background border border-muted/10 rounded-xl">
                      <input 
                        type="radio" 
                        name="mob-sort"
                        defaultChecked={label === 'Pertinence'}
                        className="w-4 h-4 border-muted/30 text-primary focus:ring-primary bg-background"
                      />
                      <span className="text-xs font-bold text-main">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  onClick={onClose}
                  className="flex-1 bg-muted/10 text-main py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  Annuler
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
