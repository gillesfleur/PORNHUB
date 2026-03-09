import React, { useState, useMemo } from 'react';
import { 
  Layout, 
  Monitor, 
  MousePointer2, 
  BarChart3, 
  Settings2, 
  Power, 
  Edit3, 
  Eye, 
  X, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Mail,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdPlacement {
  id: string;
  name: string;
  type: 'Banner' | 'Rectangle' | 'Skyscraper' | 'Native' | 'Pre-roll';
  dimensions: string;
  pages: string[];
  status: 'Actif' | 'Inactif';
  impressionsPerDay: number;
  rotationFrequency: string;
  integrationCode: string;
}

interface AdPartner {
  id: string;
  name: string;
  logo: string;
  adType: string;
  contractStatus: 'Actif' | 'En renégociation' | 'Terminé';
  contact: string;
}

const initialPlacements: AdPlacement[] = [
  {
    id: 'p1',
    name: 'Header Banner',
    type: 'Banner',
    dimensions: '728x90',
    pages: ['Accueil', 'Page vidéo', 'Catégories'],
    status: 'Actif',
    impressionsPerDay: 45000,
    rotationFrequency: '30s',
    integrationCode: '<script src="https://ads.partner.com/header.js"></script>'
  },
  {
    id: 'p2',
    name: 'Sidebar Rectangle',
    type: 'Rectangle',
    dimensions: '300x250',
    pages: ['Page vidéo'],
    status: 'Actif',
    impressionsPerDay: 28000,
    rotationFrequency: '45s',
    integrationCode: '<script src="https://ads.partner.com/sidebar.js"></script>'
  },
  {
    id: 'p3',
    name: 'In-feed Native',
    type: 'Native',
    dimensions: 'Variable',
    pages: ['Accueil', 'Catégories'],
    status: 'Actif',
    impressionsPerDay: 32000,
    rotationFrequency: 'N/A',
    integrationCode: '<script src="https://ads.partner.com/native.js"></script>'
  },
  {
    id: 'p4',
    name: 'Video Pre-roll',
    type: 'Pre-roll',
    dimensions: '16:9',
    pages: ['Page vidéo'],
    status: 'Actif',
    impressionsPerDay: 15000,
    rotationFrequency: 'Par vidéo',
    integrationCode: '<script src="https://ads.partner.com/preroll.js"></script>'
  },
  {
    id: 'p5',
    name: 'Footer Banner',
    type: 'Banner',
    dimensions: '728x90',
    pages: ['Toutes'],
    status: 'Inactif',
    impressionsPerDay: 0,
    rotationFrequency: '60s',
    integrationCode: '<script src="https://ads.partner.com/footer.js"></script>'
  }
];

const initialPartners: AdPartner[] = [
  {
    id: 'part1',
    name: 'AdSense Premium',
    logo: 'https://picsum.photos/seed/adsense/100/100',
    adType: 'Display & Native',
    contractStatus: 'Actif',
    contact: 'support@adsense.com'
  },
  {
    id: 'part2',
    name: 'VideoAds Network',
    logo: 'https://picsum.photos/seed/videoads/100/100',
    adType: 'Pre-roll & Mid-roll',
    contractStatus: 'En renégociation',
    contact: 'legal@videoads.net'
  },
  {
    id: 'part3',
    name: 'NativeContent Co.',
    logo: 'https://picsum.photos/seed/native/100/100',
    adType: 'Native Ads',
    contractStatus: 'Actif',
    contact: 'contact@nativecontent.io'
  }
];

export const AdminAdPage: React.FC = () => {
  const [placements, setPlacements] = useState<AdPlacement[]>(initialPlacements);
  const [partners] = useState<AdPartner[]>(initialPartners);
  const [selectedPlacement, setSelectedPlacement] = useState<AdPlacement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = (id: string) => {
    setPlacements(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'Actif' ? 'Inactif' : 'Actif';
        showToast(`Emplacement ${p.name} ${newStatus === 'Actif' ? 'activé' : 'désactivé'}`);
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  const handleSavePlacement = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Emplacement sauvegardé avec succès');
    setIsModalOpen(false);
    setSelectedPlacement(null);
  };

  const stats = [
    { label: 'Impressions totales', value: '124,500', sub: '+12% vs hier', icon: Eye, color: 'text-blue-500' },
    { label: 'Clics', value: '3,120', sub: '+5% vs hier', icon: MousePointer2, color: 'text-emerald-500' },
    { label: 'CTR Moyen', value: '2.51%', sub: 'Stable', icon: BarChart3, color: 'text-primary' },
  ];

  const chartData = [45, 52, 48, 61, 55, 67, 72]; // Mock data for last 7 days

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-main uppercase tracking-tighter mb-1">Gestion des publicités</h1>
        <p className="text-muted text-sm font-medium">Gérez les emplacements et les campagnes publicitaires du site</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface rounded-3xl border border-muted/10 p-6 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-background border border-muted/10 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{stat.sub}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-main tracking-tighter">{stat.value}</p>
            
            {/* Mini bar chart simulation */}
            <div className="mt-6 flex items-end gap-1 h-12">
              {chartData.map((val, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-all cursor-help"
                  style={{ height: `${val}%` }}
                  title={`Jour ${idx + 1}: ${val}%`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Emplacements Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-main uppercase tracking-tighter flex items-center gap-2">
            <Layout size={24} className="text-primary" />
            Emplacements publicitaires
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Visual Wireframe */}
          <div className="lg:col-span-4 bg-surface rounded-3xl border border-muted/10 p-8 flex flex-col items-center justify-center shadow-xl shadow-black/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-6">Aperçu des emplacements</p>
            
            <div className="w-full max-w-[240px] aspect-[3/4] bg-background border-2 border-muted/20 rounded-xl p-3 relative overflow-hidden">
              {/* Header Banner Zone */}
              <div 
                onMouseEnter={() => setHoveredZone('Header Banner')}
                onMouseLeave={() => setHoveredZone(null)}
                className={`w-full h-6 border border-dashed rounded mb-3 flex items-center justify-center transition-all cursor-help ${
                  hoveredZone === 'Header Banner' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted/5 border-muted/20 text-muted/40'
                }`}
              >
                <span className="text-[6px] font-black uppercase">Header</span>
              </div>

              <div className="flex gap-2 h-full">
                <div className="flex-grow space-y-2">
                  {/* Content simulation */}
                  <div className="w-full h-2 bg-muted/10 rounded-full" />
                  <div className="w-3/4 h-2 bg-muted/10 rounded-full" />
                  
                  {/* In-feed Zone */}
                  <div 
                    onMouseEnter={() => setHoveredZone('In-feed Native')}
                    onMouseLeave={() => setHoveredZone(null)}
                    className={`w-full h-16 border border-dashed rounded flex items-center justify-center transition-all cursor-help ${
                      hoveredZone === 'In-feed Native' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted/5 border-muted/20 text-muted/40'
                    }`}
                  >
                    <span className="text-[6px] font-black uppercase">In-feed</span>
                  </div>

                  <div className="w-full h-2 bg-muted/10 rounded-full" />
                  <div className="w-1/2 h-2 bg-muted/10 rounded-full" />
                </div>

                {/* Sidebar Zone */}
                <div 
                  onMouseEnter={() => setHoveredZone('Sidebar Rectangle')}
                  onMouseLeave={() => setHoveredZone(null)}
                  className={`w-12 h-24 border border-dashed rounded flex items-center justify-center transition-all cursor-help ${
                    hoveredZone === 'Sidebar Rectangle' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted/5 border-muted/20 text-muted/40'
                  }`}
                >
                  <span className="text-[6px] font-black uppercase vertical-text">Sidebar</span>
                </div>
              </div>

              {/* Footer Zone */}
              <div 
                onMouseEnter={() => setHoveredZone('Footer Banner')}
                onMouseLeave={() => setHoveredZone(null)}
                className={`absolute bottom-3 left-3 right-3 h-6 border border-dashed rounded flex items-center justify-center transition-all cursor-help ${
                  hoveredZone === 'Footer Banner' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted/5 border-muted/20 text-muted/40'
                }`}
              >
                <span className="text-[6px] font-black uppercase">Footer</span>
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredZone && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-main text-white p-3 rounded-xl shadow-2xl z-10 w-40 pointer-events-none"
                  >
                    <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-1">{hoveredZone}</p>
                    <p className="text-[10px] font-bold leading-tight">
                      {placements.find(p => p.name === hoveredZone)?.dimensions} • {placements.find(p => p.name === hoveredZone)?.status}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Table */}
          <div className="lg:col-span-8 bg-surface rounded-3xl border border-muted/10 overflow-hidden shadow-xl shadow-black/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-background/50 text-[10px] font-black uppercase tracking-widest text-muted border-b border-muted/10">
                    <th className="px-6 py-4">Nom</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Dimensions</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Impressions/j</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/5">
                  {placements.map((p) => (
                    <tr 
                      key={p.id} 
                      className={`hover:bg-background/30 transition-colors group ${hoveredZone === p.name ? 'bg-primary/5' : ''}`}
                      onMouseEnter={() => setHoveredZone(p.name)}
                      onMouseLeave={() => setHoveredZone(null)}
                    >
                      <td className="px-6 py-4">
                        <p className="text-xs font-black text-main">{p.name}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{p.pages.join(', ')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">{p.type}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-muted">{p.dimensions}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleToggleStatus(p.id)}
                          className={`w-10 h-5 rounded-full relative transition-all ${p.status === 'Actif' ? 'bg-emerald-500' : 'bg-muted/20'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${p.status === 'Actif' ? 'left-6' : 'left-1'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-main">{p.impressionsPerDay.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => { setSelectedPlacement(p); setIsModalOpen(true); }}
                            className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Modifier"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button className="p-2 text-muted hover:text-main hover:bg-muted/10 rounded-lg transition-all" title="Voir les stats">
                            <BarChart3 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Partenaires Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-main uppercase tracking-tighter flex items-center gap-2">
          <Building2 size={24} className="text-primary" />
          Partenaires publicitaires
        </h2>

        <div className="bg-surface rounded-3xl border border-muted/10 overflow-hidden shadow-xl shadow-black/5">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background/50 text-[10px] font-black uppercase tracking-widest text-muted border-b border-muted/10">
                <th className="px-6 py-4">Partenaire</th>
                <th className="px-6 py-4">Type de pub</th>
                <th className="px-6 py-4">Statut contrat</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/5">
              {partners.map((partner) => (
                <tr key={partner.id} className="hover:bg-background/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-muted/10 shrink-0">
                        <img src={partner.logo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <p className="text-xs font-black text-main">{partner.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-muted">{partner.adType}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      partner.contractStatus === 'Actif' ? 'bg-emerald-500/10 text-emerald-500' :
                      partner.contractStatus === 'En renégociation' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {partner.contractStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted">
                      <Mail size={14} className="text-primary" />
                      {partner.contact}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-4 py-2 bg-background border border-muted/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted hover:text-main transition-all">
                        Détail
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <Power size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Modifier Emplacement */}
      <AnimatePresence>
        {isModalOpen && selectedPlacement && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-surface border border-muted/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-muted/10 flex items-center justify-between bg-background/50">
                <h2 className="text-lg font-black uppercase tracking-tighter text-main flex items-center gap-2">
                  <Settings2 size={20} className="text-primary" />
                  Modifier l'emplacement
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted/10 rounded-xl text-muted hover:text-main transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSavePlacement} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Nom de l'emplacement</label>
                    <input 
                      type="text" 
                      defaultValue={selectedPlacement.name}
                      className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Type</label>
                    <select className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none">
                      {['Banner', 'Rectangle', 'Skyscraper', 'Native', 'Pre-roll'].map(t => (
                        <option key={t} value={t} selected={selectedPlacement.type === t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Dimensions (Largeur x Hauteur)</label>
                    <input 
                      type="text" 
                      defaultValue={selectedPlacement.dimensions}
                      className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Fréquence de rotation</label>
                    <input 
                      type="text" 
                      defaultValue={selectedPlacement.rotationFrequency}
                      className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Pages d'affichage</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Accueil', 'Page vidéo', 'Catégories', 'Recherche', 'Profil'].map(page => (
                      <label key={page} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          defaultChecked={selectedPlacement.pages.includes(page) || selectedPlacement.pages.includes('Toutes')}
                          className="rounded border-muted/20 bg-background text-primary focus:ring-primary" 
                        />
                        <span className="text-xs font-bold text-muted group-hover:text-main transition-colors">{page}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Code d'intégration</label>
                  <textarea 
                    rows={4}
                    defaultValue={selectedPlacement.integrationCode}
                    className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-xs font-mono text-main focus:outline-none focus:border-primary/50 transition-all resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-muted/10">
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => handleToggleStatus(selectedPlacement.id)}
                      className={`w-10 h-5 rounded-full relative transition-all ${selectedPlacement.status === 'Actif' ? 'bg-emerald-500' : 'bg-muted/20'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${selectedPlacement.status === 'Actif' ? 'left-6' : 'left-1'}`} />
                    </button>
                    <span className="text-xs font-black uppercase tracking-widest text-main">Emplacement actif</span>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted hover:bg-muted/10 transition-all">Annuler</button>
                    <button type="submit" className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-primary text-white hover:bg-orange-600 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                      <Save size={16} /> Sauvegarder
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed bottom-8 right-8 z-[300] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border ${
              toast.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-red-500 text-white border-red-400'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
};
