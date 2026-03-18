'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard';
import Link from 'next/link';

export default function HistoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  async function loadHistory() {
    try {
      setLoading(true);
      const res = await api.getHistory();
      if (res.success) {
        setItems(res.data?.history || res.data || []);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = async () => {
    if (!confirm('Voulez-vous vraiment effacer tout votre historique ?')) return;
    setClearing(true);
    try {
      const res = await api.clearHistory();
      if (res.success) {
        setItems([]);
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-900 pb-8">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Historique</h1>
          <p className="text-zinc-500 font-medium">Les vidéos que vous avez récemment visionnées.</p>
        </div>
        {!loading && items.length > 0 && (
          <button 
            onClick={handleClear}
            disabled={clearing}
            className="text-[10px] font-black text-red-500 hover:text-white uppercase tracking-[0.2em] border border-red-500/20 px-6 py-2.5 rounded-full hover:bg-red-500 transition-all disabled:opacity-50 active:scale-95"
          >
            {clearing ? 'Suppression...' : 'Vider l\'historique'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array(8).fill(0).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {items.map(item => {
            const video = item.video || item;
            return <VideoCard key={item.id || video.id} video={video} />;
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-zinc-950 rounded-[40px] border border-dashed border-zinc-800">
           <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">🕒</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Votre historique est vide</h2>
          <p className="text-zinc-500 mb-10 max-w-sm mx-auto leading-relaxed">
            Revenez ici après avoir regardé quelques vidéos pour les retrouver facilement.
          </p>
          <Link href="/" className="bg-white hover:bg-zinc-200 text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-xl">
            Commencer à regarder
          </Link>
        </div>
      )}
    </div>
  );
}
