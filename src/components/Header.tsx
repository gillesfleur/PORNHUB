'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AdBanner from './ads/AdBanner'; // Utilisation du banner si configuré

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout, isLoading } = useAuth();

  return (
    <header className="w-full bg-zinc-950 text-white border-b border-zinc-800 sticky top-0 z-50">
      {/* Zone Ad Header */}
      <AdBanner position="header" className="mx-auto" />

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black italic tracking-tighter text-orange-500 hover:text-orange-400 transition-colors">
            VIBETUBE<span className="text-white">.PRO</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="/videos" className="hover:text-white transition-colors">Vidéos</Link>
            <Link href="/categories" className="hover:text-white transition-colors">Catégories</Link>
            <Link href="/actors" className="hover:text-white transition-colors">Acteurs</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-8 w-24 bg-zinc-800 animate-pulse rounded-full" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link href="/admin" className="text-xs bg-orange-600 hover:bg-orange-500 px-3 py-1 rounded-full font-bold transition-colors">
                  ADMIN
                </Link>
              )}
              
              <div className="relative group">
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 overflow-hidden border border-zinc-600">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-zinc-800 text-zinc-400">
                        {user?.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{user?.username}</span>
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-zinc-800 transition-colors">Mon Profil</Link>
                  <Link href="/favorites" className="block px-4 py-2 text-sm hover:bg-zinc-800 transition-colors">Favoris</Link>
                  <Link href="/history" className="block px-4 py-2 text-sm hover:bg-zinc-800 transition-colors">Historique</Link>
                  <div className="my-1 border-t border-zinc-800" />
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-800 transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-bold px-4 py-2 hover:text-orange-500 transition-colors">
                Connexion
              </Link>
              <Link href="/register" className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
