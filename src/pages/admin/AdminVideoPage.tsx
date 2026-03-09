import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Star, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  ChevronDown,
  RefreshCw,
  Check,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { videos as initialVideos } from '../../data/videos';
import { categories } from '../../data/categories';
import { AdminVideoModal } from '../../components/admin/AdminVideoModal';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { VideoCard } from '../../components/VideoCard';

export const AdminVideoPage: React.FC = () => {
  const [videos, setVideos] = useState(initialVideos.map(v => ({ ...v, status: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'En attente' : 'Signalée') : 'Publiée' })));
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [categoryFilter, setCategoryFilter] = useState('Toutes');
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.actor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'Tous' || v.status === statusFilter;
      const matchesCategory = categoryFilter === 'Toutes' || v.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [videos, searchQuery, statusFilter, categoryFilter]);

  const paginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVideos.slice(start, start + pageSize);
  }, [filteredVideos, currentPage, pageSize]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedVideos(paginatedVideos.map(v => v.id));
    } else {
      setSelectedVideos([]);
    }
  };

  const handleSelectVideo = (id: string) => {
    if (selectedVideos.includes(id)) {
      setSelectedVideos(selectedVideos.filter(vId => vId !== id));
    } else {
      setSelectedVideos([...selectedVideos, id]);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      setVideos(videos.filter(v => v.id !== id));
      showToast('Vidéo supprimée avec succès');
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Supprimer les ${selectedVideos.length} vidéos sélectionnées ?`)) {
      setVideos(videos.filter(v => !selectedVideos.includes(v.id)));
      setSelectedVideos([]);
      showToast(`${selectedVideos.length} vidéos supprimées`);
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setVideos(videos.map(v => v.id === id ? { ...v, status: newStatus } : v));
    showToast(`Statut mis à jour : ${newStatus}`);
  };

  const handleSaveVideo = (videoData: any) => {
    if (editingVideo) {
      setVideos(videos.map(v => v.id === editingVideo.id ? { ...v, ...videoData } : v));
      showToast('Vidéo mise à jour');
    } else {
      const newVideo = {
        ...videoData,
        id: `new-${Date.now()}`,
        views: '0',
        likes: '0%',
        date: 'À l\'instant'
      };
      setVideos([newVideo, ...videos]);
      showToast('Vidéo ajoutée avec succès');
    }
    setIsModalOpen(false);
    setEditingVideo(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-main uppercase tracking-tighter mb-1">Gestion des vidéos</h1>
          <p className="text-muted text-sm font-medium">{videos.length} vidéos au total</p>
        </div>
        <button 
          onClick={() => { setEditingVideo(null); setIsModalOpen(true); }}
          className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus size={18} />
          Ajouter une vidéo manuellement
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface rounded-3xl border border-muted/10 p-4 lg:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text"
              placeholder="Rechercher par titre, ID, acteur..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-muted/20 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-background p-1 rounded-xl border border-muted/10">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-surface text-primary shadow-sm' : 'text-muted hover:text-main'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-surface text-primary shadow-sm' : 'text-muted hover:text-main'}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-muted/10 overflow-x-auto no-scrollbar">
            {['Tous', 'Publiée', 'En attente', 'Rejetée', 'Signalée'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  statusFilter === status 
                    ? 'bg-surface text-primary shadow-sm' 
                    : 'text-muted hover:text-main'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-muted/10 hidden lg:block" />

          {/* Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-background border border-muted/20 rounded-xl px-4 py-2 text-xs font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="Toutes">Toutes les catégories</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>

            <select className="bg-background border border-muted/20 rounded-xl px-4 py-2 text-xs font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer">
              <option>Toutes les périodes</option>
              <option>Aujourd'hui</option>
              <option>Cette semaine</option>
              <option>Ce mois</option>
            </select>

            <select className="bg-background border border-muted/20 rounded-xl px-4 py-2 text-xs font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer">
              <option>Toutes les qualités</option>
              <option>HD</option>
              <option>SD</option>
              <option>4K</option>
            </select>

            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('Tous'); setCategoryFilter('Toutes'); }}
              className="p-2 text-muted hover:text-primary transition-colors"
              title="Réinitialiser les filtres"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedVideos.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-black uppercase tracking-widest">{selectedVideos.length} vidéo(s) sélectionnée(s)</span>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Publier</button>
                <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Désactiver</button>
                <button onClick={handleBulkDelete} className="px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Supprimer</button>
              </div>
            </div>
            <button onClick={() => setSelectedVideos([])} className="p-1 hover:bg-white/10 rounded-full transition-all">
              <XCircle size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="bg-surface rounded-3xl border border-muted/10 overflow-hidden shadow-xl shadow-black/5">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background/50 text-[10px] font-black uppercase tracking-widest text-muted border-b border-muted/10">
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={selectedVideos.length === paginatedVideos.length && paginatedVideos.length > 0}
                      className="rounded border-muted/20 bg-background text-primary focus:ring-primary" 
                    />
                  </th>
                  <th className="px-6 py-4">Vidéo</th>
                  <th className="px-6 py-4">Catégorie</th>
                  <th className="px-6 py-4">Durée</th>
                  <th className="px-6 py-4">Vues</th>
                  <th className="px-6 py-4">Likes</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Date ajout</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/5">
                {paginatedVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-background/30 transition-colors group">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedVideos.includes(video.id)}
                        onChange={() => handleSelectVideo(video.id)}
                        className="rounded border-muted/20 bg-background text-primary focus:ring-primary" 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 border border-muted/10 relative">
                          <img src={video.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-main truncate max-w-[200px] group-hover:text-primary transition-colors">{video.title}</p>
                          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{video.actor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted bg-background px-2 py-1 rounded-md border border-muted/10">{video.category}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-muted">{video.duration}</td>
                    <td className="px-6 py-4 text-xs font-bold text-muted">{video.views}</td>
                    <td className="px-6 py-4 text-xs font-bold text-emerald-500">{video.likes}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        video.status === 'Publiée' ? 'bg-emerald-500/10 text-emerald-500' :
                        video.status === 'En attente' ? 'bg-yellow-500/10 text-yellow-500' :
                        video.status === 'Signalée' ? 'bg-orange-500/10 text-orange-500 animate-pulse' :
                        video.status === 'Rejetée' ? 'bg-red-500/10 text-red-500' :
                        'bg-muted/10 text-muted'
                      }`}>
                        {video.status === 'Publiée' && <CheckCircle2 size={10} />}
                        {video.status === 'En attente' && <AlertCircle size={10} />}
                        {video.status === 'Signalée' && <AlertTriangle size={10} />}
                        {video.status === 'Rejetée' && <XCircle size={10} />}
                        {video.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-muted">{video.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/video/${video.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`} 
                          target="_blank"
                          className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Voir sur le site"
                        >
                          <Eye size={16} />
                        </Link>
                        <button 
                          onClick={() => { setEditingVideo(video); setIsModalOpen(true); }}
                          className="p-2 text-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                          title="Modifier"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(video.id)}
                          className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="relative group/menu">
                          <button className="p-2 text-muted hover:text-main hover:bg-muted/10 rounded-lg transition-all">
                            <MoreVertical size={16} />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-muted/20 rounded-xl shadow-2xl z-50 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all">
                            <div className="p-2 space-y-1">
                              <button onClick={() => handleStatusChange(video.id, 'Publiée')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted hover:text-emerald-500 hover:bg-emerald-500/5 transition-all">
                                <Check size={14} /> Publier
                              </button>
                              <button onClick={() => handleStatusChange(video.id, 'En attente')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted hover:text-orange-500 hover:bg-orange-500/5 transition-all">
                                <AlertCircle size={14} /> Mettre en attente
                              </button>
                              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary hover:bg-primary/5 transition-all">
                                <Star size={14} /> Mettre en avant
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedVideos.map((video) => (
              <div key={video.id} className="relative group">
                <div className="absolute top-3 left-3 z-10">
                  <input 
                    type="checkbox" 
                    checked={selectedVideos.includes(video.id)}
                    onChange={() => handleSelectVideo(video.id)}
                    className="rounded border-white/20 bg-black/40 text-primary focus:ring-primary" 
                  />
                </div>
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingVideo(video); setIsModalOpen(true); }} className="p-2 bg-black/60 backdrop-blur-md text-white rounded-lg hover:bg-primary transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => handleDelete(video.id)} className="p-2 bg-black/60 backdrop-blur-md text-white rounded-lg hover:bg-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 z-10">
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                    video.status === 'Publiée' ? 'bg-emerald-500 text-white' :
                    video.status === 'En attente' ? 'bg-yellow-500 text-white' :
                    video.status === 'Signalée' ? 'bg-orange-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {video.status}
                  </span>
                </div>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <AdminPagination 
          currentPage={currentPage}
          totalPages={Math.ceil(filteredVideos.length / pageSize)}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={filteredVideos.length}
        />
      </div>

      {/* Modal */}
      <AdminVideoModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingVideo(null); }}
        onSave={handleSaveVideo}
        video={editingVideo}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border ${
              toast.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-red-500 text-white border-red-400'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
