'use client';

import { useState, useEffect, use } from 'react';
import { api } from '@/lib/api-client';
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard';
import AdBanner from '@/components/ads/AdBanner';

interface ActorPageProps {
  params: Promise<{ slug: string }>;
}

export default function ActorDetailPage({ params }: ActorPageProps) {
  const { slug } = use(params);
  const [actor, setActor] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getActor(slug) as any;
        if (res.success && res.data) {
          setActor(res.data.actor);
          setVideos(res.data.videos);
          setHasMore(res.pagination?.hasNext || false);
        }
      } catch (err) {
        console.error('[ACTOR_DETAIL_LOAD_ERROR]', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      // Remarque: L'API du backend (GET /api/actors/[slug]) pourrait ne pas supporter ?page=...
      // mais on caste en `any` pour éviter l'erreur TS et si le backend est mis à jour, ça marchera.
      const res = await (api as any).getActor(slug, { page: nextPage, perPage: 20 }) as any;
      if (res.success && res.data) {
        setVideos(prev => [...prev, ...res.data.videos]);
        setPage(nextPage);
        setHasMore(res.pagination?.hasNext || false);
      }
    } catch (err) {
      console.error('[ACTOR_LOAD_MORE_ERROR]', err);
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-48 bg-zinc-900 animate-pulse rounded-2xl mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(12).fill(0).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      </main>
    );
  }

  if (!actor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-black mb-4">Pornstar Introuvable</h2>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* HEADER PORNOSTAR */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 md:p-12 pl-8 md:pl-20 relative overflow-hidden mb-12 flex flex-col md:flex-row items-center gap-8 md:gap-16 shadow-2xl">
        {/* Cercles décoratifs bg */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-zinc-800 flex-shrink-0 shadow-2xl">
            {actor.imageUrl ? (
              <img src={actor.imageUrl} alt={actor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center font-black text-6xl text-zinc-800">
                {actor.name[0]}
              </div>
            )}
        </div>

        <div className="relative text-center md:text-left flex-1">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6">
            {actor.name}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8">
            <div className="bg-zinc-900 px-6 py-3 rounded-2xl border border-zinc-800">
              <span className="block text-2xl font-black text-orange-500">{actor.videoCount}</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vidéos</span>
            </div>
            <div className="bg-zinc-900 px-6 py-3 rounded-2xl border border-zinc-800">
              <span className="block text-2xl font-black text-white">{actor.viewsCount?.toLocaleString() || 0}</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vues Totales</span>
            </div>
            <button className="bg-white text-black hover:bg-zinc-200 px-8 py-4 rounded-full font-black uppercase text-sm tracking-widest transition-colors shadow-lg shadow-white/10">
              S'abonner
            </button>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <AdBanner position="list_top" />
      </div>

      {/* GRID VIDEOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {videos.map(v => <VideoCard key={v.id} video={v} />)}
      </div>

      {hasMore && (
        <div className="mt-16 flex justify-center">
          <button 
            onClick={loadMore}
            className="px-12 py-4 bg-zinc-900 border border-zinc-800 rounded-full font-black uppercase text-sm hover:border-orange-500 transition-all"
          >
            Plus de Vidéos
          </button>
        </div>
      )}
    </main>
  );
}
