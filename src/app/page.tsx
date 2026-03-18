'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard';
import AdBanner from '@/components/ads/AdBanner';

interface HomeData {
  hero: any[];
  trending: any[];
  categories: any[];
  actors: any[];
  popular: any[];
}

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [moreLoading, setMoreLoading] = useState(false);

  useEffect(() => {
    async function loadHome() {
      try {
        const [heroRes, trendingRes, catRes, actorsRes, popularRes] = await Promise.all([
          api.getVideos({ isFeatured: true, perPage: 5 }),
          api.getTrendingVideos({ perPage: 8 }),
          api.getCategories(),
          api.getActors({ sort: 'popular', perPage: 6 }),
          api.getPopularVideos({ perPage: 12, page: 1 })
        ]);

        setData({
          hero: heroRes.data?.videos || heroRes.data || [],
          trending: trendingRes.data?.videos || trendingRes.data || [],
          categories: (catRes.data || []).slice(0, 8),
          actors: actorsRes.data?.actors || actorsRes.data || [],
          popular: popularRes.data?.videos || popularRes.data || [],
        });
      } catch (err) {
        console.error('[HOME_FETCH_ERROR]', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadHome();
  }, []);

  const loadMore = async () => {
    if (moreLoading) return;
    setMoreLoading(true);
    try {
      const nextPage = page + 1;
      const res = await api.getPopularVideos({ perPage: 12, page: nextPage });
      if (res.success && res.data) {
        setData((prev: HomeData | null) => prev ? { ...prev, popular: [...prev.popular, ...(res.data?.videos || res.data || [])] } : null);
        setPage(nextPage);
      }
    } catch (err) {
      console.error('[LOAD_MORE_ERROR]', err);
    } finally {
      setMoreLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-black text-white mb-4">Mince ! Le serveur fait des siennes...</h2>
        <p className="text-zinc-500 mb-8">Impossible de charger les vidéos. Revenez dans quelques minutes.</p>
        <button onClick={() => window.location.reload()} className="bg-orange-600 px-8 py-3 rounded-full font-bold">Réessayer</button>
      </div>
    );
  }

  return (
    <main className="pb-20">
      {/* SECTION HERO */}
      <section className="relative h-[40vh] md:h-[60vh] overflow-hidden bg-black">
        {loading ? (
          <div className="w-full h-full bg-zinc-950 animate-pulse" />
        ) : data?.hero?.[0] ? (
          <Link href={`/video/${data.hero[0].slug}`} className="block w-full h-full relative group">
            <img 
              src={data.hero[0].thumbnailUrl} 
              alt={data.hero[0].title}
              className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-8 md:left-16 max-w-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-orange-600 text-white text-[10px] font-black py-1 px-3 rounded-full tracking-tighter uppercase">À LA UNE</span>
                <span className="text-white/60 text-xs font-bold">{data.hero[0].quality}</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase line-clamp-2">
                {data.hero[0].title}
              </h2>
              <p className="text-zinc-400 text-sm md:text-lg line-clamp-2 leading-relaxed">
                {data.hero[0].description || "Découvrez l'une des meilleures vidéos de la semaine sélectionnée par notre équipe."}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="bg-white text-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all transform hover:scale-105">
                  Regarder Maintenant
                </div>
              </div>
            </div>
          </Link>
        ) : null}
      </section>

      {/* PUB BANNER MIDDLE */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <AdBanner position="home_top" className="rounded-2xl" />
      </div>

      {/* SECTION TENDANCES */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-2">
            <span className="w-2 h-8 bg-orange-600 rounded-sm" />
            Vidéos Tendances
          </h2>
          <Link href="/trending" className="text-xs font-bold text-zinc-500 hover:text-orange-500 uppercase tracking-widest">Voir Tout</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? Array(8).fill(0).map((_, i) => <VideoCardSkeleton key={i} />) : 
            data?.trending.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      </section>

      {/* SECTION CATÉGORIES (Badges) */}
      <section className="bg-zinc-950 py-16 mt-20 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4">
            {loading ? Array(8).fill(0).map((_, i) => <div key={i} className="h-12 w-32 bg-zinc-900 animate-pulse rounded-full flex-shrink-0" />) :
              data?.categories.map(cat => (
                <Link 
                  key={cat.id} 
                  href={`/category/${cat.slug}`}
                  className="flex-shrink-0 bg-zinc-900 border border-zinc-800 hover:border-orange-500 hover:bg-zinc-800 px-6 py-3 rounded-full text-sm font-bold transition-all text-zinc-300 hover:text-white"
                >
                  {cat.name}
                </Link>
              ))
            }
            <Link href="/categories" className="flex-shrink-0 bg-orange-600/10 border border-orange-500/20 text-orange-500 px-6 py-3 rounded-full text-sm font-bold hover:bg-orange-600 hover:text-white transition-all">
              Plus...
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION ACTEURS (Cercles) */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Pornstars Populaires</h2>
          <div className="w-16 h-1 bg-orange-600 mx-auto" />
        </div>
        <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap">
          {loading ? Array(6).fill(0).map((_, i) => <div key={i} className="w-24 h-24 md:w-32 md:h-32 bg-zinc-900 animate-pulse rounded-full" />) :
            data?.actors.map(actor => (
              <Link key={actor.id} href={`/pornstar/${actor.slug}`} className="group flex flex-col items-center gap-3">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-orange-600 transition-all transform group-hover:scale-110 shadow-xl">
                  {actor.imageUrl ? (
                    <img src={actor.imageUrl} alt={actor.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center font-black text-2xl text-zinc-500">
                      {actor.name[0]}
                    </div>
                  )}
                </div>
                <span className="text-sm font-bold group-hover:text-orange-500">{actor.name}</span>
              </Link>
            ))
          }
        </div>
      </section>

      {/* SECTION PRINCIPALE (GRID) */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
          <h2 className="text-xl font-black uppercase flex items-center gap-2">Plus Populaire</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {loading ? Array(12).fill(0).map((_, i) => <VideoCardSkeleton key={i} />) : 
            data?.popular.map(v => <VideoCard key={v.id} video={v} />)}
        </div>

        {/* Load More */}
        <div className="mt-16 flex justify-center">
          <button 
            onClick={loadMore}
            disabled={moreLoading}
            className="group relative px-12 py-4 bg-zinc-900 border border-zinc-800 rounded-full font-black uppercase text-sm tracking-widest overflow-hidden transition-all hover:border-orange-600"
          >
            <span className="relative z-10 flex items-center gap-3">
              {moreLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin " />
              ) : "Charger Plus de Vidéos"}
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}
