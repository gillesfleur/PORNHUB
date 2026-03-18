'use client';

import { useState, useEffect, use } from 'react';
import { api } from '@/lib/api-client';
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard';

interface RankingPageProps {
  type: 'popular' | 'recent' | 'top-rated' | 'trending';
  title: string;
}

export function RankingPage({ type, title }: RankingPageProps) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let res;
        if (type === 'popular') res = await api.getPopularVideos({ page: 1 });
        else if (type === 'recent') res = await api.getRecentVideos({ page: 1 });
        else if (type === 'top-rated') res = await api.getTopRatedVideos({ page: 1 });
        else res = await api.getTrendingVideos({ page: 1 });

        setVideos(res.data?.videos || res.data || []);
        setHasMore(res.pagination?.hasNext || false);
      } catch (err) {
        console.error(`[RANKING_${type.toUpperCase()}_LOAD_ERROR]`, err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [type]);

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      let res;
      if (type === 'popular') res = await api.getPopularVideos({ page: nextPage });
      else if (type === 'recent') res = await api.getRecentVideos({ page: nextPage });
      else if (type === 'top-rated') res = await api.getTopRatedVideos({ page: nextPage });
      else res = await api.getTrendingVideos({ page: nextPage });

      if (res.success && res.data) {
        setVideos(prev => [...prev, ...(res.data?.videos || res.data || [])]);
        setPage(nextPage);
        setHasMore(res.pagination?.hasNext || false);
      }
    } catch (err) {
      console.error(`[RANKING_LOAD_MORE_ERROR]`, err);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 border-b border-zinc-900 pb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">{title}</h1>
          <p className="text-zinc-500 text-sm mt-2 font-bold uppercase tracking-widest">Les meilleures sélections de {title.toLowerCase()}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(16).fill(0).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : (
        <>
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
        </>
      )}
    </main>
  );
}
