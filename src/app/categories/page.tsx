'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('[CATEGORIES_LOAD_ERROR]', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 border-b border-zinc-900 pb-8">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">Toutes les <span className="text-orange-500">Catégories</span></h1>
        <p className="text-zinc-500 text-sm mt-2 uppercase font-bold tracking-widest">Explorez notre bibliothèque par thématique</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? Array(12).fill(0).map((_, i) => (
          <div key={i} className="h-40 bg-zinc-950 animate-pulse rounded-2xl border border-zinc-900" />
        )) : categories.map(cat => (
          <Link 
            key={cat.id} 
            href={`/category/${cat.slug}`}
            className="group relative h-40 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all hover:border-orange-500 shadow-xl"
          >
            {cat.imageUrl && (
              <img src={cat.imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500" />
            )}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
              <h3 className="text-lg font-black italic uppercase text-white group-hover:text-orange-500 transition-colors">{cat.name}</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{cat.videoCount.toLocaleString()} Vidéos</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
