import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, AlertTriangle, CheckCircle2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSidebar } from '../components/UserSidebar';
import { Breadcrumb } from '../components/Breadcrumb';
import { VideoCard } from '../components/VideoCard';
import { Pagination } from '../components/Pagination';
import { AdBanner } from '../components/AdBanner';
import { videos } from '../data/videos';
import { Video } from '../types';

import { SEO } from '../components/SEO';

export const FavoritesPage: React.FC = () => {
  // Take 12 random videos for initial mock state
  const [favoriteVideos, setFavoriteVideos] = useState<Video[]>([]);
  const [sortBy, setSortBy] = useState('date');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO component handles title
    
    // Initialize with 12 random videos
    const shuffled = [...videos].sort(() => 0.5 - Math.random());
    setFavoriteVideos(shuffled.slice(0, 12));
  }, []);

  const sortedVideos = useMemo(() => {
    const result = [...favoriteVideos];
    if (sortBy === 'title') {
      return result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'views') {
      // Simple parse for views like "1.2M" or "500K"
      const parseViews = (v: string) => {
        const num = parseFloat(v.replace(/[^\d.]/g, ''));
        if (v.includes('M')) return num * 1000000;
        if (v.includes('K')) return num * 1000;
        return num;
      };
      return result.sort((a, b) => parseViews(b.views) - parseViews(a.views));
    }
    // Default: date (simulated by original order)
    return result;
  }, [favoriteVideos, sortBy]);

  const removeVideo = (id: string) => {
    setFavoriteVideos(prev => prev.filter(v => v.id !== id));
  };

  const clearAllFavorites = () => {
    setIsConfirmModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // As per instructions: "la confirmation affiche un toast 'Favoris supprimés' mais ne change rien visuellement"
    // Wait, the instruction says "ne change rien visuellement" for the list, but usually "Tout supprimer" should clear it.
    // Re-reading: "la confirmation affiche un toast 'Favoris supprimés' mais ne change rien visuellement"
    // This is a bit ambiguous. Does it mean the list stays? 
    // "la confirmation affiche un toast 'Favoris supprimés' mais ne change rien visuellement" 
    // I'll follow it literally: show toast, don't clear.
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO title="Mes Favoris" description="Retrouvez toutes vos vidéos préférées enregistrées sur VibeTube." />
      <Breadcrumb items={[{ label: 'Mon profil', path: '/profile' }, { label: 'Mes favoris', path: '/favorites' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <UserSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-main tracking-tighter flex items-center gap-3">
                <Heart size={32} className="text-red-500 fill-red-500" />
                Mes favoris
              </h1>
              <p className="text-sm font-bold text-muted mt-1">
                {favoriteVideos.length} {favoriteVideos.length > 1 ? 'vidéos' : 'vidéo'} en favoris
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-surface border border-muted/20 rounded-xl text-xs font-bold text-main focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="date">Date d'ajout</option>
                  <option value="title">Titre</option>
                  <option value="views">Plus vues</option>
                </select>
              </div>

              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all group"
              >
                <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                Tout supprimer
              </button>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {favoriteVideos.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {sortedVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <VideoCard 
                      video={video} 
                      onRemove={removeVideo}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-surface rounded-3xl border border-dashed border-muted/30"
              >
                <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center text-muted/30">
                  <Heart size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-main uppercase tracking-tighter">Vous n'avez pas encore de favoris</h3>
                  <p className="text-sm text-muted font-medium max-w-xs mx-auto">
                    Parcourez nos vidéos et cliquez sur le cœur pour les ajouter à votre liste personnelle.
                  </p>
                </div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all"
                >
                  Découvrir des vidéos
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {favoriteVideos.length > 0 && <Pagination />}

          <AdBanner size="rectangle" position="favorites-bottom" className="mt-12" />
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface rounded-3xl p-8 shadow-2xl border border-muted/20"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-main uppercase tracking-tighter">Êtes-vous sûr ?</h3>
                  <p className="text-sm text-muted font-medium">
                    Cette action est irréversible. Toutes vos vidéos favorites seront supprimées de votre liste.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                  <button
                    onClick={() => setIsConfirmModalOpen(false)}
                    className="py-3 px-4 bg-background border border-muted/20 rounded-2xl text-xs font-black uppercase tracking-widest text-muted hover:text-main hover:bg-surface transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={clearAllFavorites}
                    className="py-3 px-4 bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <CheckCircle2 size={20} />
            Favoris supprimés
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
