'use client';

import { useEffect, useRef } from 'react';

interface AdScriptProps {
  adCode: string;
}

/**
 * Composant pour injecter dynamiquement du code HTML/JS de publicité (ExoClick)
 */
export default function AdScript({ adCode }: AdScriptProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !adCode) return;

    // Nettoyage du conteneur avant injection
    containerRef.current.innerHTML = '';

    // Création d'un fragment pour injecter le code
    const range = document.createRange();
    const fragment = range.createContextualFragment(adCode);

    // Injection du fragment (les scripts s'exécuteront)
    containerRef.current.appendChild(fragment);

    return () => {
      // Cleanup optionnel si nécessaire
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [adCode]);

  return <div ref={containerRef} className="ad-script-container" />;
}
