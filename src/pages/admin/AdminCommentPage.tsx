import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Trash2, 
  Eye, 
  Slash, 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  RefreshCw,
  ChevronRight,
  User as UserIcon,
  ExternalLink,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminComments as initialComments, AdminComment } from '../../data/admin-comments';
import { AdminPagination } from '../../components/admin/AdminPagination';

export const AdminCommentPage: React.FC = () => {
  const [comments, setComments] = useState<AdminComment[]>(initialComments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [periodFilter, setPeriodFilter] = useState('Toutes');
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const stats = useMemo(() => ({
    published: comments.filter(c => c.status === 'Publié').length,
    pending: comments.filter(c => c.status === 'En attente').length,
    reported: comments.filter(c => c.status === 'Signalé').length,
  }), [comments]);

  const filteredComments = useMemo(() => {
    return comments.filter(c => {
      const matchesSearch = c.text.toLowerCase().includes(searchQuery.toLowerCase()) || c.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'Tous' || 
                           (statusFilter === 'En attente de modération' && c.status === 'En attente') ||
                           (statusFilter === 'Signalés' && c.status === 'Signalé') ||
                           (statusFilter === 'Publiés' && c.status === 'Publié') ||
                           (statusFilter === 'Supprimés' && c.status === 'Supprimé');
      return matchesSearch && matchesStatus;
    });
  }, [comments, searchQuery, statusFilter]);

  const paginatedComments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredComments.slice(start, start + pageSize);
  }, [filteredComments, currentPage, pageSize]);

  const handleAction = (id: string, newStatus: AdminComment['status'], message: string) => {
    setComments(comments.map(c => c.id === id ? { ...c, status: newStatus } : v => v)); // Fixed mapping
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    showToast(message);
  };

  const handleBulkAction = (action: 'Approuver' | 'Supprimer') => {
    const newStatus = action === 'Approuver' ? 'Publié' : 'Supprimé';
    setComments(prev => prev.map(c => selectedComments.includes(c.id) ? { ...c, status: newStatus } : c));
    setSelectedComments([]);
    showToast(`${selectedComments.length} commentaires ${action === 'Approuver' ? 'approuvés' : 'supprimés'}`);
  };

  const handleSelectComment = (id: string) => {
    if (selectedComments.includes(id)) {
      setSelectedComments(selectedComments.filter(cId => cId !== id));
    } else {
      setSelectedComments([...selectedComments, id]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-main uppercase tracking-tighter mb-1">Modération des commentaires</h1>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {stats.published} publiés</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> {stats.pending} en attente</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {stats.reported} signalés</span>
          </div>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface p-1 rounded-2xl border border-muted/10 overflow-x-auto no-scrollbar">
          {['Tous', 'Publiés', 'En attente de modération', 'Signalés', 'Supprimés'].map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`relative px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                statusFilter === tab 
                  ? 'bg-background text-primary shadow-lg shadow-black/20' 
                  : 'text-muted hover:text-main'
              } ${tab === 'Signalés' && stats.reported > 0 ? 'text-orange-500' : ''}`}
            >
              {tab}
              {tab === 'Signalés' && stats.reported > 0 && (
                <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] animate-pulse">
                  {stats.reported}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search & Period */}
        <div className="bg-surface rounded-3xl border border-muted/10 p-4 lg:p-6 flex flex-col lg:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text"
              placeholder="Rechercher par texte / username..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-muted/20 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={periodFilter}
              onChange={e => setPeriodFilter(e.target.value)}
              className="bg-background border border-muted/20 rounded-xl px-4 py-3 text-xs font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="Toutes">Toutes les périodes</option>
              <option value="Aujourd'hui">Aujourd'hui</option>
              <option value="Cette semaine">Cette semaine</option>
              <option value="Ce mois">Ce mois</option>
            </select>
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('Tous'); }}
              className="p-3 text-muted hover:text-primary transition-colors bg-background rounded-xl border border-muted/20"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedComments.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-black uppercase tracking-widest">{selectedComments.length} commentaire(s) sélectionné(s)</span>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <button onClick={() => handleBulkAction('Approuver')} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Approuver tout</button>
                <button onClick={() => handleBulkAction('Supprimer')} className="px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Supprimer tout</button>
              </div>
            </div>
            <button onClick={() => setSelectedComments([])} className="p-1 hover:bg-white/10 rounded-full transition-all">
              <XCircle size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="space-y-4">
        {paginatedComments.length > 0 ? (
          paginatedComments.map((comment) => (
            <motion.div
              layout
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-surface rounded-3xl border border-muted/10 p-6 shadow-xl shadow-black/5 relative overflow-hidden group ${
                comment.status === 'Signalé' ? 'border-red-500/30' : ''
              }`}
            >
              {/* Checkbox */}
              <div className="absolute top-6 left-6 z-10">
                <input 
                  type="checkbox" 
                  checked={selectedComments.includes(comment.id)}
                  onChange={() => handleSelectComment(comment.id)}
                  className="rounded border-muted/20 bg-background text-primary focus:ring-primary" 
                />
              </div>

              <div className="pl-10">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-muted/10 shrink-0">
                      <img src={comment.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-main">{comment.username}</span>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">sur</span>
                        <Link to={`/video/${comment.videoId}`} className="text-xs font-bold text-primary hover:underline truncate max-w-[200px]">
                          {comment.videoTitle}
                        </Link>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">
                        <Clock size={10} />
                        {comment.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      comment.status === 'Publié' ? 'bg-emerald-500/10 text-emerald-500' :
                      comment.status === 'En attente' ? 'bg-yellow-500/10 text-yellow-500' :
                      comment.status === 'Signalé' ? 'bg-orange-500/10 text-orange-500' :
                      comment.status === 'Supprimé' ? 'bg-muted/10 text-muted' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {comment.status}
                    </span>
                  </div>
                </div>

                {/* Comment Text */}
                <div className="mb-6">
                  <p className="text-sm font-bold text-main leading-relaxed bg-background/30 p-4 rounded-2xl border border-muted/5">
                    {comment.text}
                  </p>
                </div>

                {/* Report Banner */}
                {comment.status === 'Signalé' && (
                  <div className="mb-6 flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-500">
                    <AlertTriangle size={18} className="shrink-0" />
                    <p className="text-xs font-black uppercase tracking-widest">
                      Motif du signalement : <span className="font-bold normal-case">{comment.reportReason}</span>
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-muted/5">
                  <button 
                    onClick={() => handleAction(comment.id, 'Publié', 'Commentaire approuvé')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    <CheckCircle2 size={14} /> Approuver
                  </button>
                  <button 
                    onClick={() => handleAction(comment.id, 'Supprimé', 'Commentaire rejeté')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    <XCircle size={14} /> Rejeter
                  </button>
                  <button 
                    onClick={() => handleAction(comment.id, 'Supprimé', 'Commentaire supprimé')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/10 text-muted text-[10px] font-black uppercase tracking-widest hover:bg-muted hover:text-white transition-all"
                  >
                    <Trash2 size={14} /> Supprimer
                  </button>
                  <div className="flex-grow" />
                  <Link 
                    to={`/video/${comment.videoId}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-muted/10 text-muted text-[10px] font-black uppercase tracking-widest hover:text-main transition-all"
                  >
                    <Eye size={14} /> Voir la vidéo
                  </Link>
                  <button 
                    onClick={() => { if(window.confirm(`Bannir l'utilisateur ${comment.username} ?`)) showToast('Utilisateur banni'); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Slash size={14} /> Bannir l'utilisateur
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-surface rounded-3xl border border-muted/10 p-12 text-center">
            <MessageSquare size={48} className="text-muted mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-black text-main uppercase tracking-tighter">Aucun commentaire trouvé</h3>
            <p className="text-muted text-sm font-medium mt-2">Essayez de modifier vos filtres ou votre recherche.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredComments.length > 0 && (
        <AdminPagination 
          currentPage={currentPage}
          totalPages={Math.ceil(filteredComments.length / pageSize)}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={filteredComments.length}
        />
      )}

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
