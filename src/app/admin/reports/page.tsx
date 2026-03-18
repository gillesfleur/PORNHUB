'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, perPage: 20 });

  async function loadReports() {
    try {
      setLoading(true);
      const res = await api.admin.getReports(params);
      if (res.success) {
        setReports(res.data?.reports || res.data || []);
      }
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      const res = await api.admin.resolveReport(id);
      if (res.success) {
        setReports(reports.map(r => r.id === id ? { ...r, status: 'RESOLVED' } : r));
      }
    } catch (err) {
      alert('Erreur lors du traitement');
    }
  };

  return (
    <div className="space-y-12">
      <div className="pb-10 border-b border-zinc-900/50">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Signalements</h1>
        <p className="text-[10px] font-black uppercase text-red-600 tracking-[0.4em] font-mono">MODERATION_QUEUE_PRIORITY_1</p>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[48px] overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="grid grid-cols-1 divide-y divide-zinc-800/40">
          {loading ? (
             Array(5).fill(0).map((i) => <div key={i} className="p-12 animate-pulse h-28 bg-zinc-900" />)
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="p-10 flex flex-col md:flex-row md:items-center gap-8 group hover:bg-zinc-800/10 transition-all">
                <div className={`w-16 h-16 rounded-[24px] shrink-0 flex items-center justify-center text-xl shadow-2xl border ${report.status === 'RESOLVED' ? 'bg-zinc-900 border-zinc-800 opacity-50' : 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse'}`}>
                   🚨
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{new Date(report.createdAt).toLocaleString()}</span>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${report.type === 'VIDEO' ? 'bg-orange-600/10 text-orange-500' : 'bg-blue-600/10 text-blue-500'}`}>
                      {report.type}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${report.status === 'RESOLVED' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                      {report.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white italic tracking-tight uppercase mb-2">{report.reason || 'Raison non spécifiée'}</h3>
                  <p className="text-sm text-zinc-500 font-medium max-w-2xl leading-relaxed">{report.description || 'Aucun détail supplémentaire fourni.'}</p>
                </div>
                <div className="flex items-center gap-4">
                   <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-zinc-700">Voir le contenu</button>
                   {report.status !== 'RESOLVED' && (
                     <button onClick={() => handleResolve(report.id)} className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-600/10">Marquer comme réglé</button>
                   )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-32 text-center text-zinc-700 font-black uppercase tracking-widest text-xs italic">
              Aucun signalement en attente. Félicitations 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
