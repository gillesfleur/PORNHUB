'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api.admin.getSettings();
        if (res.success) {
          setSettings(res.data || {});
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const res = await api.admin.updateSettings(settings);
      if (res.success) {
        setMessage('Paramètres sauvegardés avec succès !');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-20 bg-zinc-900 rounded-3xl w-1/3" />
    <div className="h-96 bg-zinc-900 rounded-[48px]" />
  </div>;

  return (
    <div className="space-y-12 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-zinc-900/50">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Configuration Globale</h1>
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.4em] font-mono">CORE_ENGINE_VARIABLES.CONF</p>
        </div>
        {message && (
          <div className="bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full border border-green-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
            {message}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Site Identity */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 select-none font-black italic text-4xl">SITE_ID</div>
          <h2 className="text-xl font-black uppercase italic tracking-tight mb-8 flex items-center gap-3">
             <span className="w-1.5 h-6 bg-orange-600 rounded-full" /> Identité du Site
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Nom de la plateforme</label>
                <input 
                  type="text" 
                  value={settings.siteName || ''}
                  onChange={e => setSettings({...settings, siteName: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-bold"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Slogan (Méta Title)</label>
                <input 
                  type="text" 
                  value={settings.siteTagline || ''}
                  onChange={e => setSettings({...settings, siteTagline: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-bold"
                />
             </div>
             <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Description SEO</label>
                <textarea 
                  value={settings.siteDescription || ''}
                  onChange={e => setSettings({...settings, siteDescription: e.target.value})}
                  rows={3}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-bold resize-none"
                />
             </div>
          </div>
        </section>

        {/* Technical Config */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 select-none font-black italic text-4xl">AUTH_VARS</div>
          <h2 className="text-xl font-black uppercase italic tracking-tight mb-8 flex items-center gap-3">
             <span className="w-1.5 h-6 bg-blue-600 rounded-full" /> Paramètres Techniques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
             <div className="flex items-center justify-between p-6 bg-black/50 border border-zinc-800 rounded-3xl">
                <div>
                  <p className="text-sm font-black italic uppercase tracking-tight text-white">Inscriptions Ouvertes</p>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1 italic">Autoriser les nouveaux comptes</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setSettings({...settings, registrationEnabled: !settings.registrationEnabled})}
                  className={`w-14 h-8 rounded-full relative transition-all ${settings.registrationEnabled ? 'bg-orange-600' : 'bg-zinc-800'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.registrationEnabled ? 'left-7' : 'left-1'}`} />
                </button>
             </div>
             <div className="flex items-center justify-between p-6 bg-black/50 border border-zinc-800 rounded-3xl">
                <div>
                  <p className="text-sm font-black italic uppercase tracking-tight text-white">Cache Dynamique</p>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1 italic">Vitesse de chargement optimale</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setSettings({...settings, cacheEnabled: !settings.cacheEnabled})}
                  className={`w-14 h-8 rounded-full relative transition-all ${settings.cacheEnabled ? 'bg-orange-600' : 'bg-zinc-800'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.cacheEnabled ? 'left-7' : 'left-1'}`} />
                </button>
             </div>
          </div>
        </section>

        <div className="flex justify-end pt-8 pb-20">
           <button 
             type="submit" 
             disabled={isSaving}
             className="bg-white text-black hover:bg-zinc-200 px-16 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all flex items-center gap-4"
           >
             {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Sauvegarde...
                </>
             ) : 'Enregistrer la configuration CORE'}
           </button>
        </div>
      </form>
    </div>
  );
}
