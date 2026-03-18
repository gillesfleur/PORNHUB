'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { label: 'Tableau de bord', href: '/admin/dashboard', icon: '⚡' },
  { label: 'Vidéos', href: '/admin/videos', icon: '🎬' },
  { label: 'Utilisateurs', href: '/admin/users', icon: '👥' },
  { label: 'Catégories', href: '/admin/categories', icon: '📂' },
  { label: 'Tags', href: '/admin/tags', icon: '🏷️' },
  { label: 'Commentaires', href: '/admin/comments', icon: '💬' },
  { label: 'Signalements', href: '/admin/reports', icon: '🚩' },
  { label: 'Publicités', href: '/admin/ads', icon: '💰' },
  { label: 'Sources d\'Import', href: '/admin/sources', icon: '🔌' },
  { label: 'Configuration', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si pas admin, le middleware s'en occupe, mais sécurité supplémentaire
  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-black text-zinc-100">
      {/* Sidebar */}
      <aside className="w-72 bg-zinc-950 border-r border-zinc-900 sticky top-0 h-screen overflow-y-auto hidden lg:flex flex-col">
        <div className="p-10 border-b border-zinc-900">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black italic tracking-tighter text-orange-500 uppercase">
              VIBETUBE<span className="text-white">.ADMIN</span>
            </span>
          </Link>
          <p className="text-[10px] font-bold text-zinc-600 mt-2 uppercase tracking-widest">Management System v1.0</p>
        </div>
        
        <nav className="flex-1 py-8">
          <ul className="space-y-2 px-6">
            {menuItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${
                      active 
                        ? 'bg-zinc-900 text-orange-500 shadow-xl italic' 
                        : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                    }`}
                  >
                    <span className={`text-lg transition-transform group-hover:scale-110 ${active ? 'grayscale-0' : 'grayscale'}`}>
                      {item.icon}
                    </span>
                    <span className="italic">{item.label}</span>
                    {active && <div className="absolute right-4 w-1.5 h-1.5 bg-orange-600 rounded-full" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-8 mt-auto border-t border-zinc-900">
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-orange-500 text-xs shadow-inner">
               {user?.username?.[0].toUpperCase()}
             </div>
             <div className="min-w-0">
               <p className="text-[10px] font-black uppercase text-white truncate w-32 tracking-wider">{user?.username}</p>
               <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">CONNECTED</p>
               </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-x-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between sticky top-0 z-40 bg-opacity-90 backdrop-blur-xl">
           <Link href="/" className="text-xl font-black italic tracking-tighter text-orange-500">
            VT<span className="text-white">.ADMIN</span>
          </Link>
          <button className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-xl border border-zinc-800 shadow-xl active:scale-95 transition-all">
            ☰
          </button>
        </div>

        <div className="p-6 md:p-10 lg:p-16 max-w-[1600px] mx-auto min-h-screen">
          {children}
        </div>

        {/* Footer info fix */}
        <div className="mt-auto px-6 md:px-10 lg:px-16 py-8 border-t border-zinc-900 flex flex-col md:flex-row gap-4 items-center justify-between text-zinc-600 text-[10px] font-black tracking-widest uppercase">
           <p>© 2026 VIBETUBE CORE TEAM</p>
           <p>SYSTEM LOAD: 1.02ms / OK</p>
        </div>
      </main>
    </div>
  );
}
