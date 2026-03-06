import React, { useState, useEffect } from 'react';

export const AgeVerification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('AgeVerification: Checking verification status...');
    const verified = localStorage.getItem('age_verified');
    console.log('AgeVerification: verified =', verified);
    if (!verified) {
      setIsVisible(true);
    }
  }, []);

  const handleVerify = () => {
    console.log('AgeVerification: Verifying age...');
    localStorage.setItem('age_verified', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    console.log('AgeVerification: Declining age...');
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface border border-muted p-8 rounded-2xl shadow-2xl text-center">
        <div className="text-4xl font-bold tracking-tighter mb-6">
          <span className="text-primary">Vibe</span>
          <span className="text-main">Tube</span>
        </div>

        <h2 className="text-xl font-bold text-main mb-4">
          Vérification d'âge requise
        </h2>
        
        <p className="text-muted mb-8">
          Ce site contient du contenu réservé aux adultes. Vous devez avoir au moins 18 ans pour accéder à ce site.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleVerify}
            className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-full transition-colors"
          >
            J'ai 18 ans ou plus — Entrer
          </button>
          
          <button
            onClick={handleDecline}
            className="w-full bg-muted/20 hover:bg-muted/30 text-main font-bold py-3 rounded-full transition-colors"
          >
            Je suis mineur — Quitter
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
          <input type="checkbox" id="remember" className="rounded border-muted bg-background" />
          <label htmlFor="remember">Ne plus afficher ce message</label>
        </div>

        <p className="mt-8 text-[10px] text-muted leading-relaxed">
          En entrant sur ce site, vous certifiez avoir l'âge légal pour visionner du contenu pour adultes dans votre juridiction et vous acceptez nos conditions d'utilisation.
        </p>
      </div>
    </div>
  );
};
