import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListMusic, Plus, Lock, MoreVertical, Trash2, Edit2, Globe, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSidebar } from '../components/UserSidebar';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdBanner } from '../components/AdBanner';
import { playlists as initialPlaylists } from '../data/playlists';
import { Playlist } from '../types';

import { SEO } from '../components/SEO';

export const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '', isPrivate: false });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO component handles title
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylist.name.trim()) return;

    const playlist: Playlist = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPlaylist.name,
      description: newPlaylist.description,
      isPrivate: newPlaylist.isPrivate,
      videoCount: 0,
      thumbnail: `https://picsum.photos/seed/${newPlaylist.name}/320/180`,
      createdAt: new Date().toLocaleDateString('fr-FR'),
    };

    setPlaylists([playlist, ...playlists]);
    setIsModalOpen(false);
    setNewPlaylist({ name: '', description: '', isPrivate: false });
  };

  const togglePrivacy = (id: string) => {
    setPlaylists(prev => prev.map(p => p.id === id ? { ...p, isPrivate: !p.isPrivate } : p));
    setActiveMenu(null);
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    setActiveMenu(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO title="Mes Playlists" description="Gérez vos listes de lecture personnalisées sur VibeTube." />
      <Breadcrumb items={[{ label: 'Mon profil', path: '/profile' }, { label: 'Mes playlists', path: '/playlists' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <UserSidebar />
          <AdBanner size="rectangle" position="playlists-sidebar" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-main tracking-tighter flex items-center gap-3">
                <ListMusic size={32} className="text-primary" />
                Mes playlists
              </h1>
              <p className="text-sm font-bold text-muted mt-1">
                {playlists.length} {playlists.length > 1 ? 'playlists créées' : 'playlist créée'}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              Créer une playlist
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {playlists.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative bg-surface rounded-2xl border border-muted/20 overflow-hidden shadow-lg shadow-black/5 hover:shadow-xl transition-all duration-300"
                >
                  {/* Mosaic Thumbnail */}
                  <Link to={`/playlist/${playlist.id}`} className="block relative aspect-video bg-muted overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <div className="grid grid-cols-2 grid-rows-2 h-full">
                      {[1, 2, 3, 4].map((i) => (
                        <img
                          key={i}
                          src={`https://picsum.photos/seed/pl${playlist.id}-${i}/160/90`}
                          alt=""
                          className="w-full h-full object-cover border-[0.5px] border-black/10"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <ListMusic size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded flex items-center gap-1">
                      {playlist.videoCount} VIDÉOS
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/playlist/${playlist.id}`} className="flex-grow">
                        <h3 className="text-sm font-black text-main line-clamp-1 group-hover:text-primary transition-colors">
                          {playlist.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                            Créée le {playlist.createdAt}
                          </span>
                          {playlist.isPrivate && <Lock size={10} className="text-muted" />}
                        </div>
                      </Link>

                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === playlist.id ? null : playlist.id)}
                          className="p-1 hover:bg-background rounded-lg transition-colors text-muted"
                        >
                          <MoreVertical size={18} />
                        </button>

                        <AnimatePresence>
                          {activeMenu === playlist.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-48 bg-surface border border-muted/20 rounded-xl shadow-2xl z-20 overflow-hidden"
                              >
                                <div className="p-1">
                                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-muted hover:text-main hover:bg-background transition-all">
                                    <Edit2 size={14} />
                                    Renommer
                                  </button>
                                  <button
                                    onClick={() => togglePrivacy(playlist.id)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-muted hover:text-main hover:bg-background transition-all"
                                  >
                                    {playlist.isPrivate ? <Globe size={14} /> : <Lock size={14} />}
                                    Rendre {playlist.isPrivate ? 'publique' : 'privée'}
                                  </button>
                                  <div className="h-px bg-muted/10 my-1 mx-2" />
                                  <button
                                    onClick={() => deletePlaylist(playlist.id)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all"
                                  >
                                    <Trash2 size={14} />
                                    Supprimer
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-surface rounded-3xl p-8 shadow-2xl border border-muted/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-main uppercase tracking-tighter flex items-center gap-3">
                  <ListMusic size={24} className="text-primary" />
                  Nouvelle playlist
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-background rounded-full transition-colors text-muted">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted">Nom de la playlist</label>
                  <input
                    type="text"
                    required
                    value={newPlaylist.name}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                    placeholder="Ex: Mes coups de cœur"
                    className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted">Description (optionnelle)</label>
                  <textarea
                    value={newPlaylist.description}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                    placeholder="Ajoutez une description..."
                    rows={3}
                    className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all resize-none"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-muted/10">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${newPlaylist.isPrivate ? 'bg-primary/10 text-primary' : 'bg-muted/10 text-muted'}`}>
                      {newPlaylist.isPrivate ? <Lock size={18} /> : <Globe size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-main">Playlist privée</p>
                      <p className="text-[10px] font-bold text-muted">Seul vous pourrez voir cette playlist</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewPlaylist({ ...newPlaylist, isPrivate: !newPlaylist.isPrivate })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${newPlaylist.isPrivate ? 'bg-primary' : 'bg-muted/30'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${newPlaylist.isPrivate ? 'translate-x-6' : ''}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-4 px-6 bg-background border border-muted/20 rounded-2xl text-xs font-black uppercase tracking-widest text-muted hover:text-main hover:bg-surface transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="py-4 px-6 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-primary/20"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
