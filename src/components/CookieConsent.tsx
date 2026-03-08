import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { X, Cookie, ShieldCheck, Settings, Info } from 'lucide-react';

interface CookieSettings {
  essential: boolean;
  analytical: boolean;
  advertising: boolean;
  social: boolean;
}

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true,
    analytical: true,
    advertising: true,
    social: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allSettings = { essential: true, analytical: true, advertising: true, social: true };
    localStorage.setItem('cookie-consent', JSON.stringify(allSettings));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const minimalSettings = { essential: true, analytical: false, advertising: false, social: false };
    localStorage.setItem('cookie-consent', JSON.stringify(minimalSettings));
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(settings));
    setShowModal(false);
    setIsVisible(false);
  };

  const toggleSetting = (key: keyof CookieSettings) => {
    if (key === 'essential') return;
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Function to be called from Footer
  useEffect(() => {
    const handleReopen = () => {
      const saved = localStorage.getItem('cookie-consent');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
      setIsVisible(true);
    };
    window.addEventListener('reopen-cookie-consent', handleReopen);
    return () => window.removeEventListener('reopen-cookie-consent', handleReopen);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
          >
            <div className="container mx-auto max-w-6xl">
              <div className="bg-surface border border-muted/20 rounded-3xl shadow-2xl shadow-black/50 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 bg-primary/10 text-primary rounded-2xl hidden md:block">
                  <Cookie size={32} />
                </div>
                
                <div className="flex-grow space-y-2 text-center md:text-left">
                  <h3 className="text-lg font-black text-main uppercase tracking-tighter flex items-center justify-center md:justify-start gap-2">
                    <Cookie size={20} className="md:hidden text-primary" />
                    Respect de votre vie privée
                  </h3>
                  <p className="text-sm text-muted font-medium leading-relaxed max-w-3xl">
                    Ce site utilise des cookies pour améliorer votre expérience, analyser le trafic et afficher des publicités personnalisées. 
                    En cliquant sur "Tout accepter", vous consentez à l'utilisation de tous les cookies. 
                    Consultez notre <Link to="/privacy" className="text-primary hover:underline font-bold">Politique de confidentialité</Link> pour en savoir plus.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted hover:text-main hover:bg-muted/10 transition-all flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Personnaliser
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-muted/20 text-main hover:bg-muted/5 transition-all"
                  >
                    Tout refuser
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all"
                  >
                    Tout accepter
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customization Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-surface border border-muted/20 rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                      <ShieldCheck size={24} />
                    </div>
                    <h2 className="text-xl font-black text-main uppercase tracking-tighter">Personnaliser les cookies</h2>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-2 text-muted hover:text-main transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'essential', label: 'Cookies essentiels', desc: 'Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.', icon: ShieldCheck, alwaysOn: true },
                    { id: 'analytical', label: 'Cookies analytiques', desc: 'Nous permettent de mesurer l\'audience et d\'améliorer le site.', icon: Info },
                    { id: 'advertising', label: 'Cookies publicitaires', desc: 'Utilisés pour vous proposer des publicités adaptées à vos centres d\'intérêt.', icon: Cookie },
                    { id: 'social', label: 'Cookies réseaux sociaux', desc: 'Permettent de partager du contenu sur les plateformes sociales.', icon: Settings },
                  ].map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-background/50 border border-muted/10"
                    >
                      <div className="flex gap-3">
                        <div className="mt-1 text-primary/60">
                          <item.icon size={18} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-main uppercase tracking-tight">{item.label}</h4>
                          <p className="text-xs text-muted font-medium leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                      
                      <button
                        disabled={item.alwaysOn}
                        onClick={() => toggleSetting(item.id as keyof CookieSettings)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                          settings[item.id as keyof CookieSettings] ? 'bg-primary' : 'bg-muted/20'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings[item.id as keyof CookieSettings] ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveCustom}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-orange-600 transition-all"
                >
                  Sauvegarder mes choix
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
