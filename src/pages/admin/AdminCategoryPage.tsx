import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Power, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { categories as initialCategories } from '../../data/categories';
import { AdminPagination } from '../../components/admin/AdminPagination';

export const AdminCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState(initialCategories.map((c, idx) => ({
    ...c,
    slug: c.name.toLowerCase().replace(/ /g, '-'),
    videoCount: Math.floor(Math.random() * 500) + 50,
    status: 'Actif',
    order: idx + 1,
    description: `Contenu lié à la catégorie ${c.name}.`
  })));

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredCategories = useMemo(() => {
    return categories
      .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.order - b.order);
  }, [categories, searchQuery]);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const idx = categories.findIndex(c => c.id === id);
    if (direction === 'up' && idx > 0) {
      const newCategories = [...categories];
      const temp = newCategories[idx].order;
      newCategories[idx].order = newCategories[idx - 1].order;
      newCategories[idx - 1].order = temp;
      setCategories(newCategories);
    } else if (direction === 'down' && idx < categories.length - 1) {
      const newCategories = [...categories];
      const temp = newCategories[idx].order;
      newCategories[idx].order = newCategories[idx + 1].order;
      newCategories[idx + 1].order = temp;
      setCategories(newCategories);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette catégorie ?')) {
      setCategories(categories.filter(c => c.id !== id));
      showToast('Catégorie supprimée');
    }
  };

  const handleToggleStatus = (id: string) => {
    setCategories(categories.map(c => 
      c.id === id ? { ...c, status: c.status === 'Actif' ? 'Inactif' : 'Actif' } : c
    ));
    showToast('Statut mis à jour');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('name') as string;
    
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id ? { ...c, name, slug: name.toLowerCase().replace(/ /g, '-') } : c
      ));
      showToast('Catégorie mise à jour');
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/ /g, '-'),
        image: 'https://picsum.photos/seed/new/400/250',
        videoCount: 0,
        status: 'Actif',
        order: categories.length + 1,
        description: formData.get('description') as string
      };
      setCategories([...categories, newCat]);
      showToast('Catégorie créée');
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-main uppercase tracking-tighter mb-1">Gestion des catégories</h1>
          <p className="text-muted text-sm font-medium">{categories.length} catégories configurées</p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
          className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus size={18} />
          Nouvelle catégorie
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-3xl border border-muted/10 p-4 lg:p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-muted/20 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-3xl border border-muted/10 overflow-hidden shadow-xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background/50 text-[10px] font-black uppercase tracking-widest text-muted border-b border-muted/10">
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" className="rounded border-muted/20 bg-background text-primary focus:ring-primary" />
                </th>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Nb vidéos</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Ordre</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/5">
              {paginatedCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-background/30 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-muted/20 bg-background text-primary focus:ring-primary" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-10 rounded-lg overflow-hidden border border-muted/10">
                      <img src={cat.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-main">{cat.name}</td>
                  <td className="px-6 py-4 text-xs font-bold text-muted">{cat.slug}</td>
                  <td className="px-6 py-4 text-xs font-black text-main">{cat.videoCount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      cat.status === 'Actif' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted/10 text-muted'
                    }`}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-main w-4">{cat.order}</span>
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => handleMove(cat.id, 'up')} className="p-0.5 hover:text-primary transition-colors"><ChevronUp size={14} /></button>
                        <button onClick={() => handleMove(cat.id, 'down')} className="p-0.5 hover:text-primary transition-colors"><ChevronDown size={14} /></button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}
                        className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(cat.id)}
                        className="p-2 text-muted hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-all"
                      >
                        <Power size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
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
          totalPages={Math.ceil(filteredCategories.length / pageSize)}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={filteredCategories.length}
        />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-surface border border-muted/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-muted/10 flex items-center justify-between bg-background/50">
                <h2 className="text-lg font-black uppercase tracking-tighter text-main">
                  {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted/10 rounded-xl text-muted hover:text-main transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Nom de la catégorie</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    defaultValue={editingCategory?.name}
                    className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="Ex: Amateurs"
                  />
                  {editingCategory && (
                    <p className="text-[10px] font-bold text-muted italic">Slug : {editingCategory.name.toLowerCase().replace(/ /g, '-')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Description</label>
                  <textarea 
                    name="description"
                    rows={3}
                    defaultValue={editingCategory?.description}
                    className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all resize-none"
                    placeholder="Brève description..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Image de couverture</label>
                  <div className="aspect-video bg-background border-2 border-dashed border-muted/20 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:border-primary/50 transition-all cursor-pointer overflow-hidden relative">
                    {editingCategory ? (
                      <img src={editingCategory.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload size={24} className="text-muted group-hover:text-primary transition-colors" />
                        <p className="text-[10px] font-bold text-muted">Glissez une image ici</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button type="button" className="w-10 h-5 bg-primary rounded-full relative">
                      <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                    </button>
                    <span className="text-xs font-bold text-main">Catégorie active</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Ordre</label>
                    <input type="number" defaultValue={editingCategory?.order || categories.length + 1} className="w-16 bg-background border border-muted/20 rounded-lg py-1 px-2 text-xs font-bold text-main" />
                  </div>
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
