'use client';

import { useState, useEffect } from 'react';
import AdScript from './AdScript';

interface AdPlacement {
  id: string;
  name: string;
  placementType: string;
  width: number | null;
  height: number | null;
  pages: string[];
  adCode: string;
}

interface AdBannerProps {
  position: string; // Ex: 'header', 'sidebar', 'footer'
  className?: string;
}

/**
 * Composant principal pour afficher des bannières publicitaires ExoClick
 */
export default function AdBanner({ position, className = '' }: AdBannerProps) {
  const [ad, setAd] = useState<AdPlacement | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Détection du mode développement
    setIsDev(
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    );

    // Récupération des pubs actives
    async function fetchAds() {
      try {
        const res = await fetch('/api/ads/active');
        if (res.ok) {
          const data = await res.json();
          const ads: AdPlacement[] = data.data || [];
          
          // Trouver l'emplacement par nom ou par tag dans pages (ici on simplifie par nom)
          const matchedAd = ads.find(a => 
            a.name.toLowerCase().includes(position.toLowerCase()) ||
            (Array.isArray(a.pages) && a.pages.includes(position))
          );
          
          if (matchedAd) {
            setAd(matchedAd);
          }
        }
      } catch (err) {
        console.error('[AD_BANNER_ERROR]', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAds();
  }, [position]);

  // Si on est en dev, on ne charge jamais les vrais scripts
  if (isDev) {
    return (
      <div className={`ad-placeholder bg-gray-800 border border-dashed border-gray-600 flex items-center justify-center text-gray-400 text-xs ${className}`}
           style={{ minHeight: ad?.height || 90, minWidth: ad?.width || 300 }}>
        [DEV MODE] Publicité : {ad?.name || position}
      </div>
    );
  }

  if (loading) return null;

  // Si une pub est trouvée avec un code
  if (ad && ad.adCode) {
    return (
      <div className={`ad-container ${className}`}>
        <AdScript adCode={ad.adCode} />
      </div>
    );
  }

  // Placeholder par défaut si rien n'est trouvé
  return (
    <div className={`ad-placeholder bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-700 text-[10px] uppercase font-bold tracking-wider ${className}`}
         style={{ minHeight: 90 }}>
      Espace Publicitaire
    </div>
  );
}
