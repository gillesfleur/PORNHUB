import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Loader2, Send, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '../components/SEO';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO component handles title
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Veuillez entrer votre adresse email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Format d\'email invalide');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleResend = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <SEO 
        title="Mot de passe oublié" 
        description="Réinitialisez votre mot de passe VibeTube pour accéder à vos vidéos et playlists préférées." 
      />
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
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-black text-main uppercase tracking-tighter">Mot de passe oublié</h2>
                <p className="mt-3 text-sm text-muted font-medium leading-relaxed">
                  Entrez votre adresse email. Si un compte existe, nous vous enverrons un lien de réinitialisation.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
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
                        error ? 'border-red-500 ring-2 ring-red-500/10' : 'border-muted/20 focus:border-primary/50'
                      }`}
                      placeholder="votre@email.com"
                    />
                  </div>
                  {error && (
                    <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-2xl text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    'Envoyer le lien'
                  )}
                </button>
              </form>

              <div className="text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors">
                  <ArrowLeft size={14} />
                  Retour à la connexion
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                  <Send size={40} />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-main uppercase tracking-tighter">Email envoyé !</h2>
                <p className="text-sm text-muted font-medium leading-relaxed">
                  Si un compte est associé à <span className="text-main font-bold">{email}</span>, vous recevrez un lien de réinitialisation dans quelques minutes.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleResend}
                  className="w-full py-3 px-4 border-2 border-muted/20 rounded-2xl text-xs font-black uppercase tracking-widest text-main hover:bg-surface hover:border-primary/50 transition-all"
                >
                  Renvoyer l'email
                </button>
                
                <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors">
                  <ArrowLeft size={14} />
                  Retour à la connexion
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
            Email renvoyé
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
