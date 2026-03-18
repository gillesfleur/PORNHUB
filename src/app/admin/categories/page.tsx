'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  async function loadCategories() {
    try {
      setLoading(true);
      const res = await api.admin.getCategories();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await api.admin.updateCategory(isEditing.id, formData);
        if (res.success) {
          setCategories(categories.map(c => c.id === isEditing.id ? { ...c, ...formData } : c));
          setIsEditing(null);
        }
      } else {
        const res = await api.admin.createCategory(formData);
        if (res.success) {
          loadCategories();
        }
      }
      setFormData({ name: '', slug: '', description: '' });
    } catch (err) {
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (cat: any) => {
    setIsEditing(cat);
    setFormData({ name: cat.name, slug: cat.slug || '', description: cat.description || '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      const res = await api.admin.deleteCategory(id);
      if (res.success) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-12">
      <div className="pb-10 border-b border-zinc-900/50">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Catégories</h1>
        <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">Taxonomy_Internal_Engine.v2</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 sticky top-24 shadow-2xl">
            <h2 className="text-xl font-black uppercase italic tracking-tight mb-8">
              {isEditing ? 'Éditer la catégorie' : 'Nouvelle Catégorie'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Nom</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Slug (optionnel)</label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-bold resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl shadow-orange-600/10">
                  {isEditing ? 'Mettre à jour' : 'Créer'}
                </button>
                {isEditing && (
                  <button type="button" onClick={() => setIsEditing(null)} className="px-6 bg-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest">X</button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
           <div className="bg-zinc-900/30 border border-zinc-800 rounded-[48px] overflow-hidden backdrop-blur-sm shadow-2xl">
              <div className="grid grid-cols-1 divide-y divide-zinc-800/40">
                {loading ? (
                  Array(4).fill(0).map((i) => <div key={i} className="p-10 animate-pulse bg-zinc-900/50 h-24" />)
                ) : categories.map(cat => (
                  <div key={cat.id} className="p-8 flex items-center justify-between group hover:bg-zinc-800/20 transition-all">
                    <div>
                        <h3 className="text-lg font-black text-white italic tracking-tight uppercase group-hover:text-orange-500 transition-colors">{cat.name}</h3>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{cat.slug || 'no-slug'} • {cat.videoCount || 0} VIDÉOS</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleEdit(cat)} className="p-3 bg-zinc-800 rounded-xl text-xs hover:bg-zinc-700 transition-all">✏️</button>
                       <button onClick={() => handleDelete(cat.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-xs hover:bg-red-500 hover:text-white transition-all">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
