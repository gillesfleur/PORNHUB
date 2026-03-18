'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

export default function PornstarsPage() {
  const [actors, setActors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getActors({ sort: 'popular', perPage: 50 });
        setActors(res.data?.actors || res.data || []);
      } catch (err) {
        console.error('[ACTORS_LOAD_ERROR]', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 border-b border-zinc-900 pb-8">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">Top <span className="text-orange-500">Pornstars</span></h1>
        <p className="text-zinc-500 text-sm mt-2 uppercase font-bold tracking-widest">Les actrices les plus populaires du moment</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {loading ? Array(18).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-4 animate-pulse">
             <div className="w-full aspect-square rounded-full bg-zinc-900" />
             <div className="h-4 bg-zinc-900 w-2/3 rounded" />
          </div>
        )) : actors.map(actor => (
          <Link 
            key={actor.id} 
            href={`/pornstar/${actor.slug}`}
            className="group flex flex-col items-center gap-4"
          >
            <div className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-orange-500 transition-all transform group-hover:scale-105 shadow-2xl">
              {actor.imageUrl ? (
                <img src={actor.imageUrl} alt={actor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center font-black text-4xl text-zinc-800">
                  {actor.name[0]}
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-sm font-black uppercase text-zinc-100 group-hover:text-orange-500 transition-colors">{actor.name}</h3>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">{actor.videoCount} Vidéos</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
