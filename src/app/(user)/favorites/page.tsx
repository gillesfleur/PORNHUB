'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const res = await api.getFavorites();
        if (res.success) {
          setVideos(res.data?.videos || res.data || []);
        }
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12 border-b border-zinc-900 pb-8">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Mes Favoris</h1>
          <p className="text-zinc-500 font-medium">Toutes les vidéos que vous avez ajoutées à votre collection.</p>
        </div>
        {!loading && videos.length > 0 && (
          <span className="bg-zinc-900 text-zinc-400 text-xs font-black px-4 py-2 rounded-full border border-zinc-800">
            {videos.length} VIDÉOS
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array(8).fill(0).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      ) : (
        <div className="text-center py-24 bg-zinc-950 rounded-[40px] border border-dashed border-zinc-800">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">⭐</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Votre collection est vide</h2>
          <p className="text-zinc-500 mb-10 max-w-sm mx-auto leading-relaxed">
            Commencez à parcourir notre catalogue et cliquez sur l'étoile pour sauvegarder vos vidéos préférées.
          </p>
          <Link href="/" className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-600/20">
            Explorer le site
          </Link>
        </div>
      )}
    </div>
  );
}
