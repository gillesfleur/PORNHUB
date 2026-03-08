import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Settings, Bell, Shield, Camera, 
  Check, AlertTriangle, Trash2, Download, 
  ChevronRight, Moon, Sun, Monitor, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSidebar } from '../components/UserSidebar';
import { Breadcrumb } from '../components/Breadcrumb';
import { useAuth } from '../lib/AuthContext';
import { useTheme } from '../lib/ThemeContext';
import { categories } from '../data/categories';

type SettingsSection = 'profile' | 'password' | 'preferences' | 'notifications' | 'privacy';

import { SEO } from '../components/SEO';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Form states
  const [profileData, setProfileData] = useState({
    username: user?.username || 'GillesFleur',
    email: user?.email || 'gilles@example.com',
    bio: 'Passionné de contenu de qualité. Toujours à la recherche de nouvelles pépites.'
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    quality: 'auto',
    autoplay: true,
    filteredCategories: [] as string[]
  });

  const [notifications, setNotifications] = useState({
    newContent: true,
    replies: true,
    newsletter: false,
    partners: false
  });

  const [privacy, setPrivacy] = useState({
    isPublic: true,
    showHistory: false,
    showFavorites: true
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO component handles title
  }, []);

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleSave = (section: string) => {
    triggerToast(`${section} mis à jour avec succès`);
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length > 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const sections = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'password', label: 'Mot de passe', icon: Lock },
    { id: 'preferences', label: 'Préférences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO title="Paramètres" description="Gérez vos paramètres de compte, préférences et notifications sur VibeTube." />
      <Breadcrumb items={[{ label: 'Mon profil', path: '/profile' }, { label: 'Paramètres', path: '/settings' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <UserSidebar />
          
          {/* Desktop Section Tabs */}
          <div className="hidden lg:block bg-surface rounded-2xl border border-muted/20 overflow-hidden p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as SettingsSection)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeSection === section.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted hover:text-main hover:bg-background'
                }`}
              >
                <div className="flex items-center gap-3">
                  <section.icon size={18} />
                  {section.label}
                </div>
                {activeSection === section.id && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-surface rounded-3xl border border-muted/20 shadow-xl shadow-black/5 overflow-hidden">
            {/* Mobile Tabs */}
            <div className="lg:hidden flex overflow-x-auto p-2 border-b border-muted/10 no-scrollbar">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as SettingsSection)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    activeSection === section.id 
                      ? 'bg-primary text-white' 
                      : 'text-muted hover:text-main'
                  }`}
                >
                  <section.icon size={14} />
                  {section.label}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeSection === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="relative group">
                        <img
                          src={user?.avatar || 'https://picsum.photos/seed/user/200'}
                          alt="Avatar"
                          className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-xl"
                          referrerPolicy="no-referrer"
                        />
                        <button className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Camera size={24} />
                        </button>
                      </div>
                      <div className="text-center md:text-left space-y-2">
                        <h2 className="text-xl font-black text-main uppercase tracking-tighter">Photo de profil</h2>
                        <p className="text-sm text-muted font-medium">Format JPG ou PNG. Taille max 2MB.</p>
                        <button className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                          Changer la photo
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted">Nom d'utilisateur</label>
                        <input
                          type="text"
                          value={profileData.username}
                          onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                          className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted">Bio</label>
                        <textarea
                          rows={4}
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => handleSave('Profil')}
                        className="bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'password' && (
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6 max-w-md">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted">Mot de passe actuel</label>
                        <input
                          type="password"
                          className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted">Nouveau mot de passe</label>
                        <input
                          type="password"
                          value={passwordData.new}
                          onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                          className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all"
                        />
                        <div className="flex gap-1 mt-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div 
                              key={i} 
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                getPasswordStrength(passwordData.new) >= i 
                                  ? i <= 2 ? 'bg-red-500' : i === 3 ? 'bg-orange-500' : 'bg-green-500'
                                  : 'bg-muted/20'
                              }`} 
                            />
                          ))}
                        </div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mt-1">
                          Force du mot de passe : {['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'][getPasswordStrength(passwordData.new)]}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted">Confirmer le nouveau mot de passe</label>
                        <input
                          type="password"
                          className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => handleSave('Mot de passe')}
                        className="bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all"
                      >
                        Modifier le mot de passe
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'preferences' && (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Theme */}
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-muted">Thème de l'interface</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'light', label: 'Clair', icon: Sun },
                            { id: 'dark', label: 'Sombre', icon: Moon },
                            { id: 'system', label: 'Auto', icon: Monitor },
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setTheme(t.id as any)}
                              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                                theme === t.id 
                                  ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5' 
                                  : 'bg-background border-muted/20 text-muted hover:border-muted'
                              }`}
                            >
                              <t.icon size={20} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Language */}
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-muted">Langue</label>
                        <div className="relative">
                          <select 
                            className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main appearance-none focus:outline-none focus:border-primary transition-all"
                            value={preferences.language}
                            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                          >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="de">Deutsch</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                            <Globe size={18} />
                          </div>
                        </div>
                      </div>

                      {/* Video Quality */}
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-muted">Qualité vidéo par défaut</label>
                        <select 
                          className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all"
                          value={preferences.quality}
                          onChange={(e) => setPreferences({ ...preferences, quality: e.target.value })}
                        >
                          <option value="auto">Automatique</option>
                          <option value="1080">1080p (Full HD)</option>
                          <option value="720">720p (HD)</option>
                          <option value="480">480p (SD)</option>
                        </select>
                      </div>

                      {/* Autoplay */}
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-muted">Lecture automatique</label>
                        <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-muted/10">
                          <span className="text-sm font-bold text-main">Lancer la vidéo suivante</span>
                          <button
                            onClick={() => setPreferences({ ...preferences, autoplay: !preferences.autoplay })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${preferences.autoplay ? 'bg-primary' : 'bg-muted/30'}`}
                          >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.autoplay ? 'translate-x-6' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Filtered Content */}
                      <div className="md:col-span-2 space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-muted">Contenu filtré (Catégories masquées)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {categories.slice(0, 12).map((cat) => (
                            <label key={cat.id} className="flex items-center gap-3 p-3 bg-background rounded-xl border border-muted/10 cursor-pointer hover:border-primary/30 transition-all">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-muted/30 text-primary focus:ring-primary bg-surface"
                                checked={preferences.filteredCategories.includes(cat.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setPreferences({ ...preferences, filteredCategories: [...preferences.filteredCategories, cat.id] });
                                  } else {
                                    setPreferences({ ...preferences, filteredCategories: preferences.filteredCategories.filter(id => id !== cat.id) });
                                  }
                                }}
                              />
                              <span className="text-xs font-bold text-main">{cat.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => handleSave('Préférences')}
                        className="bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      {[
                        { id: 'newContent', label: 'Nouveaux contenus', desc: 'Recevoir un email quand vos pornstars préférées publient une vidéo.' },
                        { id: 'replies', label: 'Réponses aux commentaires', desc: 'Être averti quand quelqu\'un répond à l\'un de vos commentaires.' },
                        { id: 'newsletter', label: 'Newsletter hebdomadaire', desc: 'Le meilleur de VibeTube chaque lundi matin dans votre boîte mail.' },
                        { id: 'partners', label: 'Offres des partenaires', desc: 'Recevoir des promotions exclusives de nos partenaires sélectionnés.' },
                      ].map((n) => (
                        <div key={n.id} className="flex items-center justify-between p-6 bg-background rounded-2xl border border-muted/10">
                          <div className="space-y-1">
                            <p className="text-sm font-black text-main">{n.label}</p>
                            <p className="text-xs font-medium text-muted">{n.desc}</p>
                          </div>
                          <button
                            onClick={() => setNotifications({ ...notifications, [n.id]: !notifications[n.id as keyof typeof notifications] })}
                            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${notifications[n.id as keyof typeof notifications] ? 'bg-primary' : 'bg-muted/30'}`}
                          >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[n.id as keyof typeof notifications] ? 'translate-x-6' : ''}`} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => handleSave('Notifications')}
                        className="bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'privacy' && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      {[
                        { id: 'isPublic', label: 'Profil public', desc: 'Permettre aux autres utilisateurs de voir votre profil et vos statistiques.' },
                        { id: 'showHistory', label: 'Afficher mon historique', desc: 'Rendre votre historique de visionnage visible sur votre profil public.' },
                        { id: 'showFavorites', label: 'Afficher mes favoris', desc: 'Permettre aux autres de voir les vidéos que vous avez aimées.' },
                      ].map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-6 bg-background rounded-2xl border border-muted/10">
                          <div className="space-y-1">
                            <p className="text-sm font-black text-main">{p.label}</p>
                            <p className="text-xs font-medium text-muted">{p.desc}</p>
                          </div>
                          <button
                            onClick={() => setPrivacy({ ...privacy, [p.id]: !privacy[p.id as keyof typeof privacy] })}
                            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${privacy[p.id as keyof typeof privacy] ? 'bg-primary' : 'bg-muted/30'}`}
                          >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${privacy[p.id as keyof typeof privacy] ? 'translate-x-6' : ''}`} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 bg-background rounded-2xl border border-muted/10 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-xl">
                          <Download size={24} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-main">Données personnelles</p>
                          <p className="text-xs font-medium text-muted">Téléchargez une archive contenant toutes vos données (historique, favoris, commentaires).</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => triggerToast('Demande envoyée. Votre archive sera prête sous 24h.')}
                        className="w-full py-3 bg-surface border border-muted/20 rounded-xl text-xs font-black uppercase tracking-widest text-main hover:bg-background transition-all"
                      >
                        Télécharger mes données
                      </button>
                    </div>

                    <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                          <AlertTriangle size={24} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-red-500">Zone de danger</p>
                          <p className="text-xs font-medium text-red-500/70">La suppression de votre compte est irréversible. Toutes vos données seront effacées.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="w-full py-3 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                      >
                        Supprimer mon compte
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface rounded-3xl p-8 shadow-2xl border border-red-500/20"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex p-4 bg-red-500/10 text-red-500 rounded-full mb-2">
                  <AlertTriangle size={48} />
                </div>
                <h2 className="text-2xl font-black text-main uppercase tracking-tighter">Action irréversible</h2>
                <p className="text-sm text-muted font-medium">
                  Êtes-vous absolument sûr de vouloir supprimer votre compte ? Cette action supprimera définitivement vos favoris, playlists et historique.
                </p>
                
                <div className="space-y-4 pt-4">
                  <p className="text-xs font-black uppercase tracking-widest text-muted">
                    Tapez <span className="text-red-500">SUPPRIMER</span> pour confirmer
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="SUPPRIMER"
                    className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-center text-sm font-black text-red-500 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="py-4 px-6 bg-background border border-muted/20 rounded-2xl text-xs font-black uppercase tracking-widest text-muted hover:text-main transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    disabled={deleteConfirmation !== 'SUPPRIMER'}
                    className={`py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      deleteConfirmation === 'SUPPRIMER'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600'
                        : 'bg-muted/10 text-muted cursor-not-allowed'
                    }`}
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[110] bg-surface border border-primary/20 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3 min-w-[300px]"
          >
            <div className="bg-primary/10 text-primary p-2 rounded-full">
              <Check size={20} />
            </div>
            <p className="text-sm font-bold text-main">{showToast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
