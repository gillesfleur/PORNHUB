'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, perPage: 15, q: '' });
  const [pagination, setPagination] = useState<any>(null);

  async function loadVideos() {
    try {
      setLoading(true);
      const res = await api.admin.getVideos(params);
      if (res.success) {
        setVideos(res.data?.videos || res.data || []);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to load videos', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVideos();
  }, [params.page, params.perPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadVideos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette vidéo ?')) return;
    try {
      const res = await api.admin.deleteVideo(id);
      if (res.success) {
        setVideos(videos.filter(v => v.id !== id));
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Gestion Vidéos</h1>
          <p className="text-zinc-500 font-medium text-xs tracking-widest uppercase">CATALOGUE_MASTER_VIEW</p>
        </div>
        <div className="flex items-center gap-4">
           <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                placeholder="Rechercher une vidéo..."
                value={params.q}
                onChange={e => setParams({...params, q: e.target.value})}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-3 pl-12 text-sm focus:outline-none focus:border-orange-500 transition-all w-64 md:w-80"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
           </form>
           <button className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all">
             Ajouter
           </button>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[40px] overflow-hidden backdrop-blur-sm shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/50">
              <th className="p-6 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] italic">Vidéo</th>
              <th className="p-6 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] italic">Statut</th>
              <th className="p-6 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] italic">Stats</th>
              <th className="p-6 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] italic text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="p-10"><div className="h-12 bg-zinc-800/50 rounded-2xl" /></td>
                </tr>
              ))
            ) : videos.length > 0 ? (
              videos.map((video) => (
                <tr key={video.id} className="group hover:bg-zinc-800/20 transition-all">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                       <div className="w-24 h-14 bg-black rounded-lg overflow-hidden border border-zinc-800 group-hover:border-zinc-700 transition-colors shrink-0">
                         <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover opacity-80" />
                       </div>
                       <div className="min-w-0">
                         <p className="text-sm font-black text-white italic truncate max-w-[300px] uppercase tracking-tight">{video.title}</p>
                         <p className="text-[10px] text-zinc-500 font-bold tracking-widest mt-1 uppercase">{video.quality || 'HD'} • {video.duration || '00:00'}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      video.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${video.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-orange-500'}`} />
                      {video.status || 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-6 text-xs font-black text-zinc-400 font-mono tracking-tighter">
                     👁️ {video.views?.toLocaleString() || 0} <br />
                     ⭐ {video.favorites?.length || 0}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-3 bg-zinc-800 rounded-xl text-xs hover:bg-zinc-700 transition-all" title="Éditer">✏️</button>
                      <button 
                        onClick={() => handleDelete(video.id)}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs hover:bg-red-500 hover:text-white transition-all border border-red-500/20" 
                        title="Supprimer"
                      >
                         🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-20 text-center text-zinc-600 font-black uppercase text-xs tracking-[0.2em] italic">Aucune vidéo trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-8">
           <button 
             disabled={!pagination.hasPrev}
             onClick={() => setParams({...params, page: pagination.page - 1})}
             className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-zinc-600 disabled:opacity-30 transition-all"
           >
             Précédent
           </button>
           <span className="text-xs font-black italic text-zinc-500">
             PAGE {pagination.page} / {pagination.totalPages}
           </span>
           <button 
             disabled={!pagination.hasNext}
             onClick={() => setParams({...params, page: pagination.page + 1})}
             className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-zinc-600 disabled:opacity-30 transition-all"
           >
             Suivant
           </button>
        </div>
      )}
    </div>
  );
}
