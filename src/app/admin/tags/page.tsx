'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function AdminTagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ q: '', page: 1, perPage: 50 });

  async function loadTags() {
    try {
      setLoading(true);
      const res = await api.admin.getTags(params);
      if (res.success) {
        setTags(res.data?.tags || res.data || []);
      }
    } catch (err) {
      console.error('Failed to load tags', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTags();
  }, [params.q]);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce tag ?')) return;
    try {
      const res = await api.admin.deleteTag(id);
      if (res.success) {
        setTags(tags.filter(t => t.id !== id));
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-zinc-900/50">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Mots-clés (Tags)</h1>
          <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">META_DATA_INDEXER.V3</p>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Filtrer les tags..."
            value={params.q}
            onChange={e => setParams({...params, q: e.target.value})}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 pl-12 text-sm focus:outline-none focus:border-orange-500 transition-all w-64 md:w-80"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[48px] p-10 backdrop-blur-md shadow-2xl">
        {loading ? (
          <div className="flex flex-wrap gap-4 animate-pulse">
            {Array(20).fill(0).map((i) => <div key={i} className="h-10 w-24 bg-zinc-800 rounded-full" />)}
          </div>
        ) : tags.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div 
                key={tag.id} 
                className="group bg-zinc-950 border border-zinc-800 hover:border-orange-600/50 px-5 py-3 rounded-2xl flex items-center gap-3 transition-all hover:bg-zinc-900 shadow-xl"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-black italic text-zinc-300 uppercase italic tracking-tight group-hover:text-white transition-colors">#{tag.name}</span>
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{tag.videoCount || 0} VIDÉOS</span>
                </div>
                <button 
                  onClick={() => handleDelete(tag.id)}
                  className="w-6 h-6 rounded-lg bg-zinc-900 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center text-zinc-700 font-black uppercase tracking-widest text-xs italic">
            Aucun tag trouvé.
          </div>
        )}
      </div>
    </div>
  );
}
