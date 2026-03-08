import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Mail, Github, Chrome, Twitter, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { SEO } from '../components/SEO';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO component handles title
    
    if (location.state?.message) {
      showToastMessage(location.state.message, 'error');
      // Clear state to avoid showing it again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Ce champ est requis';
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

    try {
      const success = await login(email, password, rememberMe);
      
      if (success) {
        const storedUser = localStorage.getItem('vibetube_user') || sessionStorage.getItem('vibetube_user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        
        showToastMessage(`Connexion réussie ! Bienvenue ${user?.role === 'admin' ? 'Admin' : 'Jean'}`, 'success');
        
        setTimeout(() => {
          if (user?.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }, 1000);
      } else {
        setLoginAttempts(prev => prev + 1);
        showToastMessage('Authentification invalide. Vérifiez vos identifiants.', 'error');
        setErrors({ email: ' ', password: ' ' });
      }
    } catch (error) {
      showToastMessage('Une erreur est survenue.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <SEO title="Connexion" />
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
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Adresse email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                  <User size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-11 pr-4 py-3 bg-background border rounded-2xl text-sm font-bold text-main placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.email ? 'border-red-500 ring-2 ring-red-500/10' : 'border-muted/20 focus:border-primary/50'
                  }`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && errors.email !== ' ' && (
                <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email}
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
              {errors.password && errors.password !== ' ' && (
                <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>
          </div>

          {loginAttempts >= 3 && (
            <p className="text-[10px] font-bold text-orange-500 text-center bg-orange-500/5 py-2 rounded-lg border border-orange-500/20">
              Trop de tentatives. Veuillez réessayer dans quelques instants.
            </p>
          )}

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
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm text-white ${
              toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
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
