import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Mail, Github, Chrome, Twitter, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Connexion - VibeTube';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      newErrors.identifier = 'Ce champ est requis';
    }
    if (!password.trim()) {
      newErrors.password = 'Ce champ est requis';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[420px] w-full space-y-8 bg-surface p-8 rounded-3xl border border-muted/10 shadow-2xl shadow-black/10 relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-600" />

        <div className="text-center">
          <Link to="/" className="inline-block text-3xl font-black tracking-tighter mb-6">
            <span className="text-primary">Vibe</span>
            <span className="text-main">Tube</span>
          </Link>
          <h2 className="text-2xl font-black text-main uppercase tracking-tighter">Connexion</h2>
          <p className="mt-2 text-sm text-muted font-medium">Bon retour parmi nous !</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Identifier Field */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Email ou nom d'utilisateur</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={`block w-full pl-11 pr-4 py-3 bg-background border rounded-2xl text-sm font-bold text-main placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.identifier ? 'border-red-500 ring-2 ring-red-500/10' : 'border-muted/20 focus:border-primary/50'
                  }`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.identifier && (
                <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.identifier}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-11 pr-12 py-3 bg-background border rounded-2xl text-sm font-bold text-main placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.password ? 'border-red-500 ring-2 ring-red-500/10' : 'border-muted/20 focus:border-primary/50'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-muted/20 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-muted cursor-pointer select-none">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-xs font-bold">
              <Link to="/forgot-password" title="Mot de passe oublié ?" className="text-primary hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-2xl text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted/10"></div>
            </div>
            <div className="relative flex justify-center text-xs font-black uppercase tracking-widest">
              <span className="px-4 bg-surface text-muted/40">— OU —</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-background border border-muted/20 rounded-2xl text-xs font-bold text-main hover:bg-surface transition-all"
            >
              <Chrome size={16} className="text-red-500" />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-background border border-muted/20 rounded-2xl text-xs font-bold text-main hover:bg-surface transition-all"
            >
              <Twitter size={16} className="text-sky-500" />
              Twitter
            </button>
          </div>
        </form>

        <p className="text-center text-xs font-bold text-muted">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <AlertCircle size={20} />
            Erreur : identifiants incorrects
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
