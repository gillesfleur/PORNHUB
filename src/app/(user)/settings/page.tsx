'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';

export default function SettingsPage() {
  const { user, updateProfile, isLoading } = useAuth();
  
  // States for Profile
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // States for Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Sync state with user when it loads
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile({ username, email, bio, avatarUrl });
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour' });
    } finally {
      setIsUpdating(false);
      // Clear success message after 3s
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' });
      return;
    }
    setIsChangingPass(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.changePassword(currentPassword, newPassword);
      if (res.success) {
        setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(res.error || 'Erreur lors du changement');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Le mot de passe actuel est incorrect' });
    } finally {
      setIsChangingPass(false);
      // Clear success message after 3s
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-12">Mon Compte</h1>

      {message.text && (
        <div className={`fixed top-24 right-8 z-50 p-6 rounded-2xl shadow-2xl border flex items-center gap-4 animate-in slide-in-from-right duration-500 overflow-hidden ${
          message.type === 'success' ? 'bg-zinc-900 border-green-500/50 text-green-500' : 'bg-zinc-900 border-red-500/50 text-red-500'
        }`}>
          <div className={`w-1 h-full absolute left-0 top-0 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xl">{message.type === 'success' ? '✅' : '❌'}</span>
          <div>
            <p className="font-black uppercase text-xs tracking-widest">{message.type === 'success' ? 'Succès' : 'Attention'}</p>
            <p className="text-sm font-medium text-white/80">{message.text}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Form Profil */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <h2 className="text-xl font-black uppercase italic tracking-tight mb-8">Informations de Profil</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nom d'utilisateur</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-medium text-white placeholder-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-medium text-white placeholder-zinc-700"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Configuration Avatar (URL)</label>
                <input 
                  type="text" 
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  placeholder="https://votre-image.jpg"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-medium text-white placeholder-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Biographie</label>
                <textarea 
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all font-medium text-white placeholder-zinc-700 resize-none"
                  placeholder="Dites-en plus sur vous..."
                />
              </div>
              <button 
                type="submit" 
                disabled={isUpdating}
                className="group bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl shadow-orange-600/10"
              >
                {isUpdating ? 'Traitement en cours...' : 'Mettre à jour le profil'}
              </button>
            </form>
          </section>

          {/* Form Password */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xl font-black uppercase italic tracking-tight">Mot de passe</h2>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>
            <form onSubmit={handleChangePassword} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Mot de passe actuel</label>
                <input 
                  type="password" 
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirmer</label>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isChangingPass}
                className="bg-white text-black hover:bg-zinc-200 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl"
              >
                {isChangingPass ? 'Mise à jour...' : 'Changer mon mot de passe'}
              </button>
            </form>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-orange-600/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-xl">💎</span>
              </div>
              <h3 className="font-black text-white uppercase italic tracking-tight text-lg mb-2">Abonnement PRO</h3>
              <p className="text-sm text-zinc-500 leading-snug mb-8">
                Supprimez toutes les publicités, regardez en 4K illimité et accédez aux contenus exclusifs.
              </p>
              <button className="w-full bg-zinc-800 text-zinc-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] cursor-not-allowed">
                Bientôt Disponible
              </button>
            </div>
          </div>
          
          <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8">
            <h3 className="font-black text-red-500 uppercase italic tracking-tight text-lg mb-2">Zone Critique</h3>
            <p className="text-sm text-zinc-500 mb-6">Toutes vos données (favoris, historique, playlists) seront supprimées définitivement.</p>
            <button className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest underline underline-offset-8">
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
