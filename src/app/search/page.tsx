'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function performSearch() {
      if (!query) return;
      setLoading(true);
      try {
        const res = await api.search(query, { page: 1, perPage: 20 });
        setResults(res.data?.results || res.data || []);
        setHasMore(res.pagination?.hasNext || false);
        setPage(1);
      } catch (err) {
        console.error('[SEARCH_ERROR]', err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query]);

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const res = await api.search(query, { page: nextPage, perPage: 20 });
      if (res.success && res.data) {
        setResults(prev => [...prev, ...(res.data?.results || res.data || [])]);
        setPage(nextPage);
        setHasMore(res.pagination?.hasNext || false);
      }
    } catch (err) {
      console.error('[SEARCH_LOAD_MORE_ERROR]', err);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 border-b border-zinc-900 pb-8">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">
          Résultats pour : <span className="text-orange-500">"{query}"</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-2 font-bold uppercase tracking-widest">
           {results.length} vidéos trouvées
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(12).fill(0).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {results.map(v => <VideoCard key={v.id} video={v} />)}
          </div>

          {hasMore && (
            <div className="mt-16 flex justify-center">
              <button 
                onClick={loadMore}
                className="px-12 py-4 bg-zinc-900 border border-zinc-800 rounded-full font-black uppercase text-sm hover:border-orange-500 transition-all"
              >
                Plus de résultats
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-black uppercase">Aucune vidéo ne correspond à votre recherche</h2>
          <p className="text-zinc-500 mt-2">Essayez avec des mots clés plus larges comme "milf" ou "teen".</p>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-500">Recherche en cours...</div>}>
      <SearchContent />
    </Suspense>
  );
}
