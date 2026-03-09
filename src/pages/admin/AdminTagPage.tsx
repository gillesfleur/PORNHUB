import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Merge, 
  X, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { tags as initialTags } from '../../data/tags';
import { AdminPagination } from '../../components/admin/AdminPagination';

export const AdminTagPage: React.FC = () => {
  const [tags, setTags] = useState(initialTags.map(t => ({
    ...t,
    slug: t.name.toLowerCase().replace(/ /g, '-'),
    videoCount: Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 1000) + 10,
    createdAt: '01/01/2024'
  })));

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mergeDestination, setMergeDestination] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredTags = useMemo(() => {
    return tags.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [tags, searchQuery]);

  const paginatedTags = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTags.slice(start, start + pageSize);
  }, [filteredTags, currentPage, pageSize]);

  const unusedTagsCount = useMemo(() => tags.filter(t => t.videoCount === 0).length, [tags]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTags(paginatedTags.map(t => t.id));
    } else {
      setSelectedTags([]);
    }
  };

  const handleSelectTag = (id: string) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter(tId => tId !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer ce tag ?')) {
      setTags(tags.filter(t => t.id !== id));
      showToast('Tag supprimé');
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Supprimer les ${selectedTags.length} tags sélectionnés ?`)) {
      setTags(tags.filter(t => !selectedTags.includes(t.id)));
      setSelectedTags([]);
      showToast(`${selectedTags.length} tags supprimés`);
    }
  };

  const handleMerge = () => {
    if (mergeDestination) {
      const destTag = tags.find(t => t.id === mergeDestination);
      if (destTag) {
        // In a real app, we would update all videos with these tags
        setTags(tags.filter(t => !selectedTags.includes(t.id) || t.id === mergeDestination));
        setSelectedTags([]);
        setIsMergeModalOpen(false);
        showToast(`Tags fusionnés dans "${destTag.name}"`);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('name') as string;

    if (editingTag) {
      setTags(tags.map(t => t.id === editingTag.id ? { ...t, name, slug: name.toLowerCase().replace(/ /g, '-') } : t));
      showToast('Tag mis à jour');
    } else {
      const newTag = {
        id: `tag-${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/ /g, '-'),
        videoCount: 0,
        createdAt: new Date().toLocaleDateString()
      };
      setTags([newTag, ...tags]);
      showToast('Tag créé');
    }
    setIsModalOpen(false);
    setEditingTag(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-main uppercase tracking-tighter mb-1">Gestion des tags</h1>
          <p className="text-muted text-sm font-medium">{tags.length} tags — <span className="text-orange-500">{unusedTagsCount} inutilisés</span></p>
        </div>
        <button 
          onClick={() => { setEditingTag(null); setIsModalOpen(true); }}
          className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus size={18} />
          Nouveau tag
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-3xl border border-muted/10 p-4 lg:p-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text"
            placeholder="Rechercher un tag..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-muted/20 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <button 
          onClick={() => { setSearchQuery(''); }}
          className="p-3 text-muted hover:text-primary transition-colors bg-background rounded-xl border border-muted/20"
          title="Réinitialiser"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-black uppercase tracking-widest">{selectedTags.length} tag(s) sélectionné(s)</span>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMergeModalOpen(true)} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                  <Merge size={14} /> Fusionner
                </button>
                <button onClick={handleBulkDelete} className="px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>
            <button onClick={() => setSelectedTags([])} className="p-1 hover:bg-white/10 rounded-full transition-all">
              <XCircle size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-surface rounded-3xl border border-muted/10 overflow-hidden shadow-xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background/50 text-[10px] font-black uppercase tracking-widest text-muted border-b border-muted/10">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedTags.length === paginatedTags.length && paginatedTags.length > 0}
                    className="rounded border-muted/20 bg-background text-primary focus:ring-primary" 
                  />
                </th>
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Nb vidéos</th>
                <th className="px-6 py-4">Date création</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/5">
              {paginatedTags.map((tag) => (
                <tr key={tag.id} className={`hover:bg-background/30 transition-colors group ${tag.videoCount === 0 ? 'bg-orange-500/5' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleSelectTag(tag.id)}
                      className="rounded border-muted/20 bg-background text-primary focus:ring-primary" 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-main">{tag.name}</span>
                      {tag.videoCount === 0 && (
                        <AlertTriangle size={12} className="text-orange-500" title="Tag inutilisé" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-muted">{tag.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-black ${tag.videoCount === 0 ? 'text-orange-500' : 'text-main'}`}>
                      {tag.videoCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-muted">{tag.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setEditingTag(tag); setIsModalOpen(true); }}
                        className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        title="Modifier"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => { setSelectedTags([tag.id]); setIsMergeModalOpen(true); }}
                        className="p-2 text-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Fusionner"
                      >
                        <Merge size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tag.id)}
                        className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminPagination 
          currentPage={currentPage}
          totalPages={Math.ceil(filteredTags.length / pageSize)}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={filteredTags.length}
        />
      </div>

      {/* Tag Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-surface border border-muted/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-muted/10 flex items-center justify-between bg-background/50">
                <h2 className="text-lg font-black uppercase tracking-tighter text-main">
                  {editingTag ? 'Modifier le tag' : 'Nouveau tag'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted/10 rounded-xl text-muted hover:text-main transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Nom du tag</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    defaultValue={editingTag?.name}
                    className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="Ex: POV"
                  />
                  {editingTag && (
                    <p className="text-[10px] font-bold text-muted italic">Slug : {editingTag.name.toLowerCase().replace(/ /g, '-')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Tags associés (Regroupement)</label>
                  <select multiple className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all h-32">
                    {tags.filter(t => t.id !== editingTag?.id).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-muted italic">Maintenez Ctrl pour sélectionner plusieurs tags.</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted hover:bg-muted/10 transition-all">Annuler</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-primary text-white hover:bg-orange-600 shadow-lg shadow-primary/20 transition-all">Sauvegarder</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Merge Modal */}
      <AnimatePresence>
        {isMergeModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMergeModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-surface border border-muted/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 text-blue-500 mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/10">
                  <Merge size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Fusionner les tags</h3>
                  <p className="text-xs font-bold text-muted">Fusionner {selectedTags.length} tags sélectionnés</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Tag de destination</label>
                  <select 
                    value={mergeDestination}
                    onChange={e => setMergeDestination(e.target.value)}
                    className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    <option value="">Sélectionner le tag cible...</option>
                    {tags.filter(t => !selectedTags.includes(t.id)).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  <p className="text-[10px] font-bold text-blue-500 leading-relaxed">
                    Toutes les vidéos utilisant les tags sélectionnés seront réaffectées au tag de destination. Les tags sources seront supprimés.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setIsMergeModalOpen(false)} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted hover:bg-muted/10 transition-all">Annuler</button>
                  <button onClick={handleMerge} disabled={!mergeDestination} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20">Confirmer la fusion</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
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
