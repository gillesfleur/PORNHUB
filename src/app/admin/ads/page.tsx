'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', imageUrl: '', linkUrl: '', position: 'header', isActive: true });

  async function loadAds() {
    try {
      setLoading(true);
      const res = await api.admin.getAds();
      if (res.success) {
        setAds(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load ads', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAds();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.admin.createAd(formData);
      if (res.success) {
        setIsAdding(false);
        setFormData({ title: '', imageUrl: '', linkUrl: '', position: 'header', isActive: true });
        loadAds();
      }
    } catch (err) {
      alert('Erreur lors de la création');
    }
  };

  const handleToggle = async (ad: any) => {
    try {
      const res = await api.admin.updateAd(ad.id, { isActive: !ad.isActive });
      if (res.success) {
        setAds(ads.map(item => item.id === ad.id ? { ...item, isActive: !ad.isActive } : item));
      }
    } catch (err) {
      alert('Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette publicité ?')) return;
    try {
      const res = await api.admin.deleteAd(id);
      if (res.success) {
        setAds(ads.filter(a => a.id !== id));
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-zinc-900/50">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Publicités</h1>
          <p className="text-[10px] font-black uppercase text-orange-600 tracking-[0.4em] font-mono">AD_SERVER_MANAGEMENT.V2</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-white text-black hover:bg-zinc-200 px-10 py-4 rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all"
        >
          {isAdding ? 'Annuler' : 'Créer un emplacement'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-[48px] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
           <h2 className="text-xl font-black uppercase italic tracking-tight mb-8">Configuration de l'annonce</h2>
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Titre / Label</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Positionnement</label>
                <select 
                  value={formData.position}
                  onChange={e => setFormData({...formData, position: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-black uppercase tracking-widest italic text-[10px]"
                >
                  <option value="header">Header Banner</option>
                  <option value="home_top">Home Top</option>
                  <option value="sidebar">Sidebar Square</option>
                  <option value="video_player">Video Player Bottom</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">URL Image (Bannière)</label>
                <input 
                  type="text" 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">URL Cible (Lien)</label>
                <input 
                  type="text" 
                  value={formData.linkUrl}
                  onChange={e => setFormData({...formData, linkUrl: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-bold"
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-600/20 active:scale-95 transition-all">
                  Lancer la campagne
                </button>
              </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
           Array(4).fill(0).map((i) => <div key={i} className="h-64 bg-zinc-900 animate-pulse rounded-[48px]" />)
        ) : ads.map((ad) => (
          <div key={ad.id} className="bg-zinc-900 border border-zinc-800 rounded-[48px] overflow-hidden group hover:border-zinc-700 transition-all shadow-2xl">
             <div className="h-40 bg-black relative group-hover:h-44 transition-all duration-500 overflow-hidden">
                <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-orange-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic">{ad.position}</div>
             </div>
             <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-xl font-black italic uppercase tracking-tight text-white">{ad.title}</h3>
                   <div className={`w-3 h-3 rounded-full ${ad.isActive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                </div>
                <p className="text-[10px] text-zinc-500 font-bold tracking-widest truncate mb-8 uppercase italic">{ad.linkUrl}</p>
                <div className="flex items-center gap-4">
                   <button 
                     onClick={() => handleToggle(ad)}
                     className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic border ${ad.isActive ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-green-600/10 text-green-500 border-green-500/20'}`}
                   >
                     {ad.isActive ? 'Désactiver' : 'Activer'}
                   </button>
                   <button 
                     onClick={() => handleDelete(ad.id)}
                     className="p-4 bg-red-600/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                   >
                     🗑️
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
