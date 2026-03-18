'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.admin.getStats(),
          api.admin.getActivity()
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (activityRes.success) setActivity(activityRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-zinc-900/50">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-0.5 w-12 bg-orange-600 rounded-full" />
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] font-mono">SYSTEM_RECAP.V1</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white leading-none">
            RECAPITULATIF <br /> <span className="text-orange-600">MÉTIER</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-2xl shadow-2xl">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            DB_HEALTH: NOMINAL
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatWidget title="Vidéos Indexées" value={stats?.totalVideos || 0} trend="+12" icon="📽️" loading={loading} />
        <StatWidget title="Total Impressions" value={stats?.totalViews || 0} trend="+5.4k" icon="⚡" loading={loading} />
        <StatWidget title="Inscriptions" value={stats?.totalUsers || 0} trend="+3" icon="👤" loading={loading} />
        <StatWidget title="Alertes Modération" value={stats?.totalReports || 0} trend="-2" icon="🚩" loading={loading} warning={stats?.totalReports > 0} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* RECENT ACTIVITY LOG */}
        <div className="xl:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Journaux d'activité</h2>
            <Link href="/admin/logs" className="text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest border-b border-zinc-800 pb-1">Voir tous les logs</Link>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[48px] overflow-hidden backdrop-blur-sm shadow-2xl">
             {loading ? (
                <div className="p-10 space-y-6">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-zinc-900 animate-pulse rounded-[28px]" />)}
                </div>
             ) : activity.length > 0 ? (
               <div className="divide-y divide-zinc-800/30">
                 {activity.map((item, idx) => (
                   <div key={idx} className="p-8 flex items-center gap-6 hover:bg-zinc-800/20 transition-all group">
                     <div className="w-16 h-16 rounded-[24px] flex items-center justify-center text-2xl bg-zinc-950 border border-zinc-800/50 shadow-2xl transition-transform group-hover:scale-105 group-hover:border-zinc-700">
                       {getActivityIcon(item.type)}
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                           <span className="text-[10px] font-black text-orange-600/50 uppercase tracking-tighter">{new Date(item.createdAt).toLocaleTimeString()}</span>
                           <h3 className="text-sm font-black text-white italic tracking-tight">{item.description}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">{item.category || 'SYSTEM'}</span>
                        </div>
                     </div>
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs">👀</button>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-32 text-center">
                 <p className="text-zinc-700 font-black uppercase tracking-[0.3em] text-[10px]">Aucun événement enregistré aujourd'hui</p>
               </div>
             )}
          </div>
        </div>

        {/* CONTROL CENTER */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-orange-600">Actions Rapides</h2>
            <div className="grid grid-cols-1 gap-4">
               <AdminActionBtn href="/admin/videos" title="Nouveau Contenu" desc="Ajouter manuellement une vidéo" icon="➕" />
               <AdminActionBtn href="/admin/sources" title="Synchronisation" desc="Lancer l'import des sources" icon="🔄" special />
               <AdminActionBtn href="/admin/reports" title="Modération" desc="Traiter les alertes en attente" icon="⚠️" danger={stats?.totalReports > 0} />
               <AdminActionBtn href="/admin/settings" title="Configuration" desc="Modifier les variables globales" icon="🛠️" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-orange-600/10 p-10 rounded-[48px] relative overflow-hidden shadow-2xl group">
             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black italic tracking-tighter">OS</span>
             </div>
             <div className="relative z-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">Charge Pipeline</h3>
                <div className="space-y-6">
                   <LoadBar label="Importing Service" value={45} />
                   <LoadBar label="Encoding Queue" value={12} />
                   <LoadBar label="Cache Warmup" value={89} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatWidget({ title, value, trend, icon, loading, warning }: any) {
  return (
    <div className={`bg-zinc-900/50 border ${warning ? 'border-red-600/30 bg-red-600/[0.02]' : 'border-zinc-800'} p-10 rounded-[48px] relative overflow-hidden group shadow-2xl hover:border-zinc-700 transition-all`}>
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-all transform group-hover:scale-125 text-7xl select-none">{icon}</div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 group-hover:text-orange-500 transition-colors">{title}</p>
        <div className="flex items-baseline gap-3">
          {loading ? (
            <div className="h-12 w-32 bg-zinc-900 animate-pulse rounded-2xl" />
          ) : (
            <p className="text-5xl font-black italic tracking-tighter text-white">{value.toLocaleString()}</p>
          )}
          {!loading && <span className={`text-[10px] font-black ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>}
        </div>
      </div>
    </div>
  );
}

function AdminActionBtn({ href, title, desc, icon, special, danger }: any) {
  return (
    <Link href={href} className={`group block p-6 rounded-[32px] border transition-all active:scale-[0.98] ${
      special ? 'bg-orange-600 border-orange-500 text-white shadow-xl shadow-orange-600/20' : 
      danger ? 'bg-red-600/10 border-red-500/30 text-red-500 hover:bg-red-600/20' :
      'bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700'
    }`}>
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-2xl ${special ? 'bg-orange-500 border border-orange-400' : 'bg-black/40 border border-white/5'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className={`text-sm font-black uppercase italic tracking-tight ${special ? 'text-white' : 'text-white'}`}>{title}</h4>
          <p className={`text-[10px] font-medium opacity-60 ${special ? 'text-white/80' : 'text-zinc-500'}`}>{desc}</p>
        </div>
        <span className="text-xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">→</span>
      </div>
    </Link>
  );
}

function LoadBar({ label, value }: any) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
         <span className="text-zinc-500">{label}</span>
         <span className={value > 80 ? 'text-orange-500' : 'text-zinc-400'}>{value}%</span>
       </div>
       <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
          <div className="h-full bg-orange-600 transition-all duration-1000" style={{ width: `${value}%` }} />
       </div>
    </div>
  );
}

function getActivityIcon(type: string) {
  switch(type) {
    case 'video': return '🎬';
    case 'user': return '👤';
    case 'report': return '🚩';
    case 'sync': return '🔌';
    default: return '⚡';
  }
}
