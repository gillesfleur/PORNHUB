'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncResults, setSyncResults] = useState<any>(null);

  async function loadSources() {
    try {
      setLoading(true);
      const res = await api.admin.getSources();
      if (res.success) {
        setSources(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load sources', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSources();
  }, []);

  const handleSync = async (id: string) => {
    setSyncingId(id);
    setSyncResults(null);
    try {
      const res = await api.admin.syncSource(id);
      if (res.success) {
        setSyncResults(res.data);
      } else {
        alert(res.error || 'Erreur lors de la synchronisation');
      }
    } catch (err: any) {
      alert(err.message || 'Erreur réseau');
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-zinc-900/50">
        <div>
           <div className="flex items-center gap-3 mb-4">
             <span className="h-0.5 w-8 bg-orange-600 rounded-full" />
             <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] font-mono">SOURCES_IMPORT_MODULE.V2</p>
           </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">Sources d'Import</h1>
        </div>
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest border border-zinc-700">
          Nouvelle Source
        </button>
      </div>

      {syncResults && (
        <div className="bg-zinc-900 border border-orange-500/20 rounded-[40px] p-10 animate-in fade-in zoom-in duration-500 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 select-none text-6xl font-black italic tracking-tighter">SUCCESS</div>
          <div className="relative z-10">
            <h2 className="text-xl font-black uppercase italic tracking-tight mb-8 flex items-center gap-3 text-orange-500">
              <span className="text-2xl">✅</span> Résultats de la synchronisation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
               <ResultCard label="Vidéos Importées" value={syncResults.imported || 0} color="green" />
               <ResultCard label="Mises à jour" value={syncResults.updated || 0} color="blue" />
               <ResultCard label="Erreurs" value={syncResults.errors || 0} color="red" />
            </div>
            <div className="mt-8 flex justify-end">
               <button onClick={() => setSyncResults(null)} className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">Masquer les résultats [X]</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          Array(2).fill(0).map((_, i) => <div key={i} className="h-64 bg-zinc-900 animate-pulse rounded-[48px] border border-zinc-800" />)
        ) : sources.map((source) => (
          <div key={source.id} className="bg-zinc-900 border border-zinc-800 rounded-[48px] p-10 hover:border-zinc-700 transition-all group relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
               <span className="text-7xl font-black italic tracking-tighter uppercase">{source.type || 'SOURCE'}</span>
            </div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-[24px] bg-zinc-950 border border-zinc-800 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform group-hover:border-zinc-700">
                  {getSourceIcon(source.type)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-orange-500 transition-colors uppercase">{source.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${source.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{source.isActive ? 'ACTIF' : 'EXTINCTION'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-10 text-sm font-medium text-zinc-400">
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600 italic">Dernière Sync</span>
                  <span className="text-white italic">{source.lastSyncAt ? new Date(source.lastSyncAt).toLocaleString() : 'Jamais'}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600 italic">Vidéos Totales</span>
                  <span className="text-white italic">{source.videoCount || 0} UNITÉS</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600 italic">Fréquence</span>
                  <span className="text-orange-500 italic uppercase">TOUTES LES {source.refreshInterval || 24}H</span>
                </div>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleSync(source.id)}
                  disabled={syncingId !== null}
                  className={`bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-xl shadow-orange-600/10 ${syncingId === source.id ? 'animate-pulse' : ''}`}
                >
                  {syncingId === source.id ? (
                    <>
                       <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                       Synchronisation...
                    </>
                  ) : (
                    <>🔄 Synchroniser</>
                  )}
                </button>
                <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-zinc-700">
                  ⚙️ Configurer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ label, value, color }: any) {
  const colors: any = {
    green: 'text-green-500 bg-green-500/5 border-green-500/10',
    blue: 'text-blue-500 bg-blue-500/5 border-blue-500/10',
    red: 'text-red-500 bg-red-500/5 border-red-500/10',
  };
  return (
    <div className={`p-8 rounded-3xl border ${colors[color]} text-center group transition-all hover:scale-[1.05]`}>
      <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 opacity-70 group-hover:opacity-100 transition-opacity italic">{label}</p>
      <p className="text-5xl font-black italic tracking-tighter">{value}</p>
    </div>
  );
}

function getSourceIcon(type: string) {
  switch(type?.toLowerCase()) {
    case 'eporner': return '🔞';
    case 'phub': return '🍊';
    case 'xvideo': return '❌';
    default: return '🔌';
  }
}
