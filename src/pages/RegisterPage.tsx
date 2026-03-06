import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Mail, Chrome, Twitter, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isOver18, setIsOver18] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [receiveNews, setReceiveNews] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Inscription - VibeTube';
  }, []);

  // Password Strength Logic
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-muted/20' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 33, label: 'Faible', color: 'bg-red-500' };
    if (score <= 3) return { score: 66, label: 'Moyen', color: 'bg-orange-500' };
    return { score: 100, label: 'Fort', color: 'bg-emerald-500' };
  }, [password]);

  // Real-time Validations
  const isUsernameValid = username.length >= 3;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isConfirmValid = confirmPassword === password && confirmPassword !== '';

  const canSubmit = isOver18 && acceptTerms && isUsernameValid && isEmailValid && isPasswordValid && isConfirmValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[460px] w-full space-y-8 bg-surface p-8 rounded-3xl border border-muted/10 shadow-2xl shadow-black/10 relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-600" />

        <div className="text-center">
          <Link to="/" className="inline-block text-3xl font-black tracking-tighter mb-6">
            <span className="text-primary">Vibe</span>
            <span className="text-main">Tube</span>
          </Link>
          <h2 className="text-2xl font-black text-main uppercase tracking-tighter">Créer un compte</h2>
          <p className="mt-2 text-sm text-muted font-medium">Rejoignez la communauté VibeTube !</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Field */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Nom d'utilisateur</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`block w-full pl-11 pr-4 py-3 bg-background border rounded-2xl text-sm font-bold text-main placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    username ? (isUsernameValid ? 'border-emerald-500/50 ring-2 ring-emerald-500/5' : 'border-red-500/50 ring-2 ring-red-500/5') : 'border-muted/20 focus:border-primary/50'
                  }`}
                  placeholder="Pseudo"
                />
              </div>
              {username && !isUsernameValid && (
                <p className="text-[10px] font-bold text-red-500 ml-1">Min. 3 caractères</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Adresse email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-11 pr-4 py-3 bg-background border rounded-2xl text-sm font-bold text-main placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    email ? (isEmailValid ? 'border-emerald-500/50 ring-2 ring-emerald-500/5' : 'border-red-500/50 ring-2 ring-red-500/5') : 'border-muted/20 focus:border-primary/50'
                  }`}
                  placeholder="votre@email.com"
                />
              </div>
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
                    password ? (isPasswordValid ? 'border-emerald-500/50 ring-2 ring-emerald-500/5' : 'border-red-500/50 ring-2 ring-red-500/5') : 'border-muted/20 focus:border-primary/50'
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
              
              {/* Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1 px-1">
                  <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength.score}%` }}
                      className={`h-full ${passwordStrength.color} transition-colors duration-500`}
                    />
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-widest text-right ${passwordStrength.color.replace('bg-', 'text-')}`}>
                    Force : {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Confirmer le mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-11 pr-12 py-3 bg-background border rounded-2xl text-sm font-bold text-main placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    confirmPassword ? (isConfirmValid ? 'border-emerald-500/50 ring-2 ring-emerald-500/5' : 'border-red-500/50 ring-2 ring-red-500/5') : 'border-muted/20 focus:border-primary/50'
                  }`}
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  {confirmPassword && (
                    isConfirmValid ? <CheckCircle2 size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={isOver18}
                  onChange={(e) => setIsOver18(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-muted/20 rounded cursor-pointer"
                />
              </div>
              <span className="text-[11px] font-bold text-muted leading-tight group-hover:text-main transition-colors">
                Je certifie avoir 18 ans ou plus <span className="text-primary">*</span>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-muted/20 rounded cursor-pointer"
                />
              </div>
              <span className="text-[11px] font-bold text-muted leading-tight group-hover:text-main transition-colors">
                J'accepte les <Link to="/terms" className="text-primary hover:underline">CGU</Link> et la <Link to="/privacy" className="text-primary hover:underline">Politique de confidentialité</Link> <span className="text-primary">*</span>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={receiveNews}
                  onChange={(e) => setReceiveNews(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-muted/20 rounded cursor-pointer"
                />
              </div>
              <span className="text-[11px] font-bold text-muted leading-tight group-hover:text-main transition-colors">
                Recevoir des offres et nouveautés par email
              </span>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-2xl text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Créer mon compte'
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
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Connectez-vous
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
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <CheckCircle2 size={20} />
            Compte créé avec succès !
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
