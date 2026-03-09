import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Palette, 
  FileText, 
  Search, 
  ShieldCheck, 
  Link2, 
  Wrench, 
  Save, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  Trash2, 
  Globe, 
  Clock, 
  Moon, 
  Sun, 
  Eye, 
  ThumbsUp, 
  Plus, 
  X, 
  Lock, 
  Server, 
  Activity,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SectionId = 'general' | 'apparence' | 'contenu' | 'seo' | 'securite' | 'api' | 'maintenance';

interface ApiPartner {
  id: string;
  name: string;
  url: string;
  key: string;
  status: 'connected' | 'error';
  lastSync: string;
}

export const AdminSettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('general');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [rebuildProgress, setRebuildProgress] = useState(0);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [testingApiId, setTestingApiId] = useState<string | null>(null);

  const [apiPartners, setApiPartners] = useState<ApiPartner[]>([
    { id: '1', name: 'VideoCloud API', url: 'https://api.videocloud.com/v1', key: '••••••••••••••••', status: 'connected', lastSync: 'il y a 2h' },
    { id: '2', name: 'MetaTags Pro', url: 'https://api.metatags.io', key: '••••••••••••••••', status: 'connected', lastSync: 'il y a 5h' },
    { id: '3', name: 'AdNetwork SDK', url: 'https://ads.network.net/api', key: '••••••••••••••••', status: 'error', lastSync: 'il y a 1 jour' },
  ]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Modifications enregistrées avec succès');
  };

  const handleRebuildThumbnails = () => {
    setIsRebuilding(true);
    setRebuildProgress(0);
    const interval = setInterval(() => {
      setRebuildProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRebuilding(false);
          showToast('Thumbnails reconstruites avec succès');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const testConnection = (id: string) => {
    setTestingApiId(id);
    setTimeout(() => {
      setTestingApiId(null);
      setApiPartners(prev => prev.map(p => p.id === id ? { ...p, status: Math.random() > 0.2 ? 'connected' : 'error' } : p));
      showToast('Test de connexion terminé');
    }, 1500);
  };

  const sections = [
    { id: 'general', label: 'Général', icon: Globe },
    { id: 'apparence', label: 'Apparence', icon: Palette },
    { id: 'contenu', label: 'Contenu', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'securite', label: 'Sécurité', icon: ShieldCheck },
    { id: 'api', label: 'API Partenaires', icon: Link2 },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 shrink-0">
        <div className="bg-surface rounded-3xl border border-muted/10 p-2 sticky top-24 shadow-xl shadow-black/5">
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as SectionId)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeSection === section.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-muted hover:text-main hover:bg-background'
                }`}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow">
        <form onSubmit={handleSave} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-surface rounded-3xl border border-muted/10 p-8 shadow-xl shadow-black/5"
            >
              {/* SECTION: GÉNÉRAL */}
              {activeSection === 'general' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-muted/10 pb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-main uppercase tracking-tighter">Paramètres Généraux</h2>
                      <p className="text-xs font-medium text-muted">Configurez les informations de base de votre site</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Nom du site</label>
                      <input type="text" defaultValue="TubeVibe Premium" className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">URL du site</label>
                      <input type="text" value="https://tubevibe-premium.com" disabled className="w-full bg-background/50 border border-muted/10 rounded-xl py-3 px-4 text-sm font-bold text-muted cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Description du site</label>
                      <textarea rows={3} defaultValue="La meilleure plateforme de streaming vidéo haute qualité." className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Langue par défaut</label>
                      <select className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none">
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Fuseau horaire</label>
                      <select className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none">
                        <option value="utc+1">(UTC+01:00) Paris, Brussels, Madrid</option>
                        <option value="utc+0">(UTC+00:00) London, Lisbon, Dublin</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Logo du site</label>
                      <div className="aspect-video bg-background border-2 border-dashed border-muted/20 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:border-primary/50 transition-all cursor-pointer">
                        <Upload size={24} className="text-muted group-hover:text-primary transition-colors" />
                        <p className="text-[10px] font-bold text-muted">Télécharger le logo</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Favicon</label>
                      <div className="aspect-video bg-background border-2 border-dashed border-muted/20 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:border-primary/50 transition-all cursor-pointer">
                        <Upload size={24} className="text-muted group-hover:text-primary transition-colors" />
                        <p className="text-[10px] font-bold text-muted">Télécharger la favicon</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: APPARENCE */}
              {activeSection === 'apparence' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-muted/10 pb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <Palette size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-main uppercase tracking-tighter">Apparence & Design</h2>
                      <p className="text-xs font-medium text-muted">Personnalisez le look de votre plateforme</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Thème par défaut</label>
                      <div className="flex gap-4">
                        <label className="flex-1 cursor-pointer group">
                          <input type="radio" name="theme" className="hidden peer" defaultChecked />
                          <div className="p-4 bg-background border border-muted/20 rounded-2xl flex items-center gap-3 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-muted group-hover:text-primary transition-colors">
                              <Moon size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-main">Sombre</span>
                          </div>
                        </label>
                        <label className="flex-1 cursor-pointer group">
                          <input type="radio" name="theme" className="hidden peer" />
                          <div className="p-4 bg-background border border-muted/20 rounded-2xl flex items-center gap-3 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-muted group-hover:text-primary transition-colors shadow-sm">
                              <Sun size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-main">Clair</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Couleur d'accent primaire</label>
                        <div className="flex items-center gap-3">
                          <input type="color" defaultValue="#FFA500" className="w-12 h-12 rounded-xl border-none bg-transparent cursor-pointer" />
                          <input type="text" defaultValue="#FFA500" className="flex-grow bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all uppercase" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Vidéos par page</label>
                        <select className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none">
                          <option value="12">12 vidéos</option>
                          <option value="24" selected>24 vidéos</option>
                          <option value="36">36 vidéos</option>
                          <option value="48">48 vidéos</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-muted/10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <Eye size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest text-main">Afficher le compteur de vues</p>
                            <p className="text-[10px] text-muted">Affiche le nombre de vues sous chaque vidéo</p>
                          </div>
                        </div>
                        <button type="button" className="w-10 h-5 bg-primary rounded-full relative">
                          <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-muted/10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <ThumbsUp size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest text-main">Afficher les likes/dislikes</p>
                            <p className="text-[10px] text-muted">Autorise les utilisateurs à voter sur les vidéos</p>
                          </div>
                        </div>
                        <button type="button" className="w-10 h-5 bg-primary rounded-full relative">
                          <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: CONTENU */}
              {activeSection === 'contenu' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-muted/10 pb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-main uppercase tracking-tighter">Gestion du Contenu</h2>
                      <p className="text-xs font-medium text-muted">Règles de modération et limites utilisateurs</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Modération des commentaires</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Automatique', 'Manuelle', 'Désactivée'].map((mode, i) => (
                          <label key={mode} className="cursor-pointer group">
                            <input type="radio" name="mod" className="hidden peer" defaultChecked={i === 0} />
                            <div className="p-4 bg-background border border-muted/20 rounded-2xl text-center peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                              <span className="text-[10px] font-black uppercase tracking-widest text-main">{mode}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-muted/10">
                        <span className="text-xs font-black uppercase tracking-widest text-main">Autoriser les commentaires</span>
                        <button type="button" className="w-10 h-5 bg-primary rounded-full relative">
                          <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-muted/10">
                        <span className="text-xs font-black uppercase tracking-widest text-main">Autoriser les inscriptions</span>
                        <button type="button" className="w-10 h-5 bg-primary rounded-full relative">
                          <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Max favoris par utilisateur</label>
                        <input type="number" defaultValue={500} className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Max playlists par utilisateur</label>
                        <input type="number" defaultValue={20} className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: SEO */}
              {activeSection === 'seo' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-muted/10 pb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <Search size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-main uppercase tracking-tighter">SEO & Indexation</h2>
                      <p className="text-xs font-medium text-muted">Optimisez la visibilité de votre site sur les moteurs de recherche</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Meta Title par défaut</label>
                      <input type="text" defaultValue="TubeVibe Premium - Vidéos HD en Streaming" className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Meta Description par défaut</label>
                      <textarea rows={3} defaultValue="Découvrez des milliers de vidéos exclusives en haute définition sur TubeVibe Premium." className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Mots-clés (Tags)</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-background border border-muted/20 rounded-xl">
                        {['vidéo', 'streaming', 'HD', 'premium'].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            {tag} <X size={12} className="cursor-pointer" />
                          </span>
                        ))}
                        <input type="text" placeholder="Ajouter..." className="bg-transparent border-none focus:outline-none text-[10px] font-bold text-main ml-2 w-20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-muted/10">
                        <span className="text-xs font-black uppercase tracking-widest text-main">Indexation Google</span>
                        <button type="button" className="w-10 h-5 bg-primary rounded-full relative">
                          <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Google Analytics ID</label>
                        <input type="text" defaultValue="G-XXXXXXXXXX" className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Script de tracking personnalisé</label>
                      <textarea rows={4} placeholder="<!-- Collez vos scripts ici -->" className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-xs font-mono text-main focus:outline-none focus:border-primary/50 transition-all resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: SÉCURITÉ */}
              {activeSection === 'securite' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-muted/10 pb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-main uppercase tracking-tighter">Sécurité & Accès</h2>
                      <p className="text-xs font-medium text-muted">Protégez votre plateforme et vos utilisateurs</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-muted/10">
                        <span className="text-xs font-black uppercase tracking-widest text-main">Vérification d'âge obligatoire</span>
                        <button type="button" className="w-10 h-5 bg-primary rounded-full relative">
                          <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-muted/10">
                        <span className="text-xs font-black uppercase tracking-widest text-main">Forcer HTTPS</span>
                        <button type="button" className="w-10 h-5 bg-primary rounded-full relative">
                          <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Tentatives de connexion max</label>
                        <input type="number" defaultValue={5} className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Durée du blocage (minutes)</label>
                        <input type="number" defaultValue={30} className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all" />
                      </div>
                    </div>
                    <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-red-500/10 text-red-500">
                          <Lock size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest text-red-500">Mode Maintenance</p>
                          <p className="text-[10px] text-muted">Désactive l'accès au site pour tous les visiteurs non-admin</p>
                        </div>
                      </div>
                      <button type="button" className="w-12 h-6 bg-muted/20 rounded-full relative">
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: API PARTENAIRES */}
              {activeSection === 'api' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-muted/10 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <Link2 size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-main uppercase tracking-tighter">API Partenaires</h2>
                        <p className="text-xs font-medium text-muted">Gérez vos intégrations externes</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsApiModalOpen(true)}
                      className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                    >
                      <Plus size={14} /> Ajouter un partenaire
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-black uppercase tracking-widest text-muted border-b border-muted/10">
                          <th className="pb-4 pr-4">Partenaire</th>
                          <th className="pb-4 pr-4">URL API</th>
                          <th className="pb-4 pr-4">Statut</th>
                          <th className="pb-4 pr-4">Dernière synchro</th>
                          <th className="pb-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/5">
                        {apiPartners.map(partner => (
                          <tr key={partner.id} className="group">
                            <td className="py-4 pr-4">
                              <p className="text-xs font-black text-main">{partner.name}</p>
                              <p className="text-[10px] font-bold text-muted">Clé : {partner.key}</p>
                            </td>
                            <td className="py-4 pr-4 text-[10px] font-bold text-muted truncate max-w-[150px]">{partner.url}</td>
                            <td className="py-4 pr-4">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                                partner.status === 'connected' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                              }`}>
                                {partner.status === 'connected' ? 'Connecté ✅' : 'Erreur ❌'}
                              </span>
                            </td>
                            <td className="py-4 pr-4 text-[10px] font-bold text-muted">{partner.lastSync}</td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button 
                                  type="button"
                                  onClick={() => testConnection(partner.id)}
                                  className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                  title="Tester la connexion"
                                >
                                  {testingApiId === partner.id ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}
                                </button>
                                <button type="button" className="p-2 text-muted hover:text-main hover:bg-muted/10 rounded-lg transition-all"><Settings size={14} /></button>
                                <button type="button" className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SECTION: MAINTENANCE */}
              {activeSection === 'maintenance' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-muted/10 pb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <Wrench size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-main uppercase tracking-tighter">Maintenance & Système</h2>
                      <p className="text-xs font-medium text-muted">Outils d'administration et état du serveur</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Actions de maintenance</h4>
                      <div className="space-y-3">
                        <button 
                          type="button"
                          onClick={() => showToast('Cache vidé avec succès')}
                          className="w-full flex items-center justify-between p-4 bg-background border border-muted/10 rounded-2xl hover:border-primary/30 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <Trash2 size={18} className="text-muted group-hover:text-primary transition-colors" />
                            <span className="text-xs font-black uppercase tracking-widest text-main">Vider le cache</span>
                          </div>
                          <ChevronRight size={16} className="text-muted" />
                        </button>
                        <div className="space-y-2">
                          <button 
                            type="button"
                            onClick={handleRebuildThumbnails}
                            disabled={isRebuilding}
                            className="w-full flex items-center justify-between p-4 bg-background border border-muted/10 rounded-2xl hover:border-primary/30 transition-all group disabled:opacity-50"
                          >
                            <div className="flex items-center gap-3">
                              <RefreshCw size={18} className={`text-muted group-hover:text-primary transition-colors ${isRebuilding ? 'animate-spin' : ''}`} />
                              <span className="text-xs font-black uppercase tracking-widest text-main">Reconstruire les thumbnails</span>
                            </div>
                            <ChevronRight size={16} className="text-muted" />
                          </button>
                          {isRebuilding && (
                            <div className="px-4">
                              <div className="h-1 w-full bg-muted/10 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${rebuildProgress}%` }}
                                  className="h-full bg-primary"
                                />
                              </div>
                              <p className="text-[8px] font-black text-primary mt-1 uppercase tracking-widest">{rebuildProgress}% terminé</p>
                            </div>
                          )}
                        </div>
                        <button 
                          type="button"
                          onClick={() => showToast('Export de la base de données en cours...')}
                          className="w-full flex items-center justify-between p-4 bg-background border border-muted/10 rounded-2xl hover:border-primary/30 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <Database size={18} className="text-muted group-hover:text-primary transition-colors" />
                            <span className="text-xs font-black uppercase tracking-widest text-main">Exporter toute la base</span>
                          </div>
                          <ChevronRight size={16} className="text-muted" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Informations Système</h4>
                      <div className="bg-background p-6 rounded-3xl border border-muted/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Server size={16} className="text-primary" />
                            <span className="text-[10px] font-bold text-muted uppercase">Version du site</span>
                          </div>
                          <span className="text-xs font-black text-main">v2.4.1-stable</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Activity size={16} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-muted uppercase">Uptime</span>
                          </div>
                          <span className="text-xs font-black text-main">14 jours, 5h 12m</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted uppercase">Espace disque</span>
                            <span className="text-[10px] font-black text-main">75% (1.2 TB / 1.6 TB)</span>
                          </div>
                          <div className="h-2 w-full bg-muted/10 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-3/4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button (for all sections except Maintenance/API which have specific actions) */}
              {activeSection !== 'maintenance' && activeSection !== 'api' && (
                <div className="mt-10 pt-8 border-t border-muted/10 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-primary/20 transition-all"
                  >
                    <Save size={18} />
                    Sauvegarder les modifications
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </form>
      </main>

      {/* API Partner Modal */}
      <AnimatePresence>
        {isApiModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsApiModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-surface border border-muted/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-muted/10 flex items-center justify-between bg-background/50">
                <h2 className="text-lg font-black uppercase tracking-tighter text-main">Ajouter un partenaire API</h2>
                <button onClick={() => setIsApiModalOpen(false)} className="p-2 hover:bg-muted/10 rounded-xl text-muted hover:text-main transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Nom du partenaire</label>
                  <input type="text" className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all" placeholder="Ex: CloudSync" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">URL de l'API</label>
                  <input type="text" className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all" placeholder="https://api.partner.com/v1" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Clé API</label>
                  <input type="password" placeholder="••••••••••••••••" className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Fréquence de synchronisation</label>
                  <select className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none">
                    <option value="1h">Toutes les heures</option>
                    <option value="6h">Toutes les 6 heures</option>
                    <option value="12h">Toutes les 12 heures</option>
                    <option value="24h">Une fois par jour</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsApiModalOpen(false)} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted hover:bg-muted/10 transition-all">Annuler</button>
                  <button onClick={() => { setIsApiModalOpen(false); showToast('Partenaire ajouté'); }} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-primary text-white hover:bg-orange-600 shadow-lg shadow-primary/20 transition-all">Ajouter</button>
                </div>
              </div>
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
            className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border ${
              toast.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-red-500 text-white border-red-400'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
