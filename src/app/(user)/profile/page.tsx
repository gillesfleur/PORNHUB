'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getMyStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoadingStats(false);
      }
    }

    if (user) {
      loadStats();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-bold animate-pulse">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirection gérée par le middleware
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-orange-600/10 transition-colors duration-700" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center text-4xl font-black text-zinc-600 border-4 border-zinc-800 shadow-xl overflow-hidden shrink-0">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              user.username[0].toUpperCase()
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">{user.username}</h1>
              {user.role === 'ADMIN' && (
                <span className="inline-block bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded italic">STAFF</span>
              )}
            </div>
            <p className="text-zinc-500 mb-6 text-sm font-medium">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
               <Link href="/settings" className="bg-white text-black hover:bg-zinc-200 px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl">
                 Modifier le profil
               </Link>
               {user.role === 'ADMIN' && (
                 <Link href="/admin/dashboard" className="bg-zinc-800 text-white hover:bg-zinc-700 px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border border-zinc-700">
                   Portail Admin
                 </Link>
               )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Vidéos vues" value={stats?.viewCount || 0} loading={loadingStats} />
        <StatCard title="Favoris" value={stats?.favoriteCount || 0} loading={loadingStats} />
        <StatCard title="Playlists" value={stats?.playlistCount || 0} loading={loadingStats} />
      </div>

      <div className="mt-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">Ma Bibliothèque</h2>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LibraryLink 
            href="/history" 
            title="Historique" 
            desc="Les vidéos que vous avez récemment regardées."
            count={stats?.viewCount}
          />
          <LibraryLink 
            href="/favorites" 
            title="Vidéos Favorites" 
            desc="Sélection de vos meilleurs moments."
            count={stats?.favoriteCount}
          />
          <LibraryLink 
            href="/playlists" 
            title="Mes Playlists" 
            desc="Vos collections personnalisées."
            count={stats?.playlistCount}
          />
          <LibraryLink 
            href="/settings" 
            title="Paramètres" 
            desc="Gérez votre compte et vos préférences."
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, loading }: { title: string, value: number, loading: boolean }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center hover:border-zinc-700 transition-colors group">
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3 group-hover:text-orange-500 transition-colors">{title}</p>
      {loading ? (
        <div className="h-10 w-20 bg-zinc-800 animate-pulse mx-auto rounded-lg" />
      ) : (
        <p className="text-4xl font-black text-white italic tracking-tighter">{value}</p>
      )}
    </div>
  );
}

function LibraryLink({ href, title, desc, count }: { href: string, title: string, desc: string, count?: number }) {
  return (
    <Link href={href} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-orange-600 transition-all flex items-center justify-between group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
         <span className="text-4xl font-black italic tracking-tighter text-zinc-500">{title[0]}</span>
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-black text-lg text-white uppercase italic group-hover:text-orange-500 transition-colors tracking-tight">{title}</h3>
          {count !== undefined && (
            <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded text-xs">{count}</span>
          )}
        </div>
        <p className="text-sm text-zinc-500 max-w-[250px] leading-snug">{desc}</p>
      </div>
      <span className="text-zinc-700 group-hover:text-orange-500 group-hover:translate-x-2 transition-all text-2xl font-light scale-y-150">→</span>
    </Link>
  );
}
