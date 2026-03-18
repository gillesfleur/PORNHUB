'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import Link from 'next/link';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  async function loadPlaylists() {
    try {
      setLoading(true);
      const res = await api.getPlaylists();
      if (res.success) {
        setPlaylists(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load playlists', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlaylists();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    setIsCreating(true);
    try {
      const res = await api.createPlaylist({ name: newPlaylistName });
      if (res.success) {
        setNewPlaylistName('');
        loadPlaylists();
      }
    } catch (err) {
      alert('Erreur lors de la création');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-900 pb-8">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Mes Playlists</h1>
          <p className="text-zinc-500 font-medium">Vos collections de vidéos personnalisées.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Form Creation */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sticky top-24">
            <h2 className="text-lg font-black uppercase italic tracking-tight mb-6">Nouvelle Playlist</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input 
                type="text" 
                placeholder="Nom de la playlist..."
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all text-sm font-medium"
              />
              <button 
                type="submit" 
                disabled={isCreating || !newPlaylistName.trim()}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all disabled:opacity-50 shadow-xl shadow-orange-600/10"
              >
                {isCreating ? 'Création...' : 'Créer la playlist'}
              </button>
            </form>
          </div>
        </div>

        {/* List Playlists */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-zinc-900 animate-pulse rounded-3xl border border-zinc-800" />
              ))}
            </div>
          ) : playlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {playlists.map(p => (
                <Link key={p.id} href={`/playlists/${p.id}`} className="group bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-orange-600 transition-all relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                     <span className="text-6xl font-black italic tracking-tighter text-zinc-500">{p.name[0]}</span>
                   </div>
                   <div className="relative z-10 flex flex-col h-full">
                     <h3 className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-orange-500 transition-colors mb-2">{p.name}</h3>
                     <p className="text-zinc-500 text-sm font-bold mb-8 uppercase tracking-[0.2em]">{p._count?.videos || p.videos?.length || 0} VIDÉOS</p>
                     
                     <div className="mt-auto flex items-center justify-between">
                       <span className="text-xs font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-all italic">Voir la collection</span>
                       <span className="text-zinc-700 group-hover:text-orange-500 group-hover:translate-x-2 transition-all text-2xl font-light scale-y-150">→</span>
                     </div>
                   </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-950 rounded-[40px] border border-dashed border-zinc-800">
              <p className="text-zinc-500">Vous n'avez pas encore créé de playlist.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
