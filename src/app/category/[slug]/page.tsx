'use client';

import { useState, useEffect, use } from 'react';
import { api } from '@/lib/api-client';
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard';
import AdBanner from '@/components/ads/AdBanner';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const [category, setCategory] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getCategory(slug, { page: 1, perPage: 20 }) as any;
        if (res.success && res.data) {
          setCategory(res.data.category);
          setVideos(res.data.videos);
          setHasMore(res.pagination?.hasNext || false);
        }
      } catch (err) {
        console.error('[CATEGORY_DETAIL_LOAD_ERROR]', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const res = await api.getCategory(slug, { page: nextPage, perPage: 20 }) as any;
      if (res.success && res.data) {
        setVideos(prev => [...prev, ...res.data.videos]);
        setPage(nextPage);
        setHasMore(res.pagination?.hasNext || false);
      }
    } catch (err) {
      console.error('[CATEGORY_LOAD_MORE_ERROR]', err);
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-64 bg-zinc-900 animate-pulse rounded-2xl mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(12).fill(0).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      </main>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-black mb-4">Catégorie Introuvable</h2>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* HEADER CATÉGORIE */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-black mb-12 border border-zinc-900 shadow-2xl flex items-end">
        {category.imageUrl && (
          <img 
            src={category.imageUrl} 
            alt={category.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-40" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        <div className="relative p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white leading-none mb-4">
              {category.name}
            </h1>
            <p className="text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
              {category.description || `Retrouvez les meilleures vidéos de la catégorie ${category.name.toLowerCase()}.`}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-4xl md:text-5xl font-black text-orange-500">{category.videoCount}</span>
            <span className="block text-sm font-bold uppercase tracking-widest text-zinc-500">Vidéos</span>
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
