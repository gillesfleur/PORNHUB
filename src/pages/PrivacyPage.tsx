import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, Shield, Eye, Database, Lock, UserCheck, Cookie, Info } from 'lucide-react';

import { SEO } from '../components/SEO';

export const PrivacyPage: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO component handles title

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    {
      id: 'collecte',
      title: 'Données collectées',
      icon: Database,
      content: `Nous collectons différentes catégories de données personnelles lorsque vous utilisez notre Site :
      
      • Données d'identification : Nom d'utilisateur, adresse email (si vous créez un compte).
      • Données de connexion : Adresse IP, type de navigateur, système d'exploitation, pages consultées.
      • Données d'usage : Historique de visionnage, vidéos favorites, playlists créées, commentaires postés.
      • Données techniques : Cookies et traceurs (voir section dédiée).`
    },
    {
      id: 'utilisation',
      title: 'Utilisation des données',
      icon: Eye,
      content: `Vos données sont traitées pour les finalités suivantes :
      
      • Fourniture du service : Gestion de votre compte, personnalisation de votre expérience, lecture des vidéos.
      • Amélioration du service : Analyse statistique de l'audience, détection de bugs, optimisation de l'interface.
      • Communication : Envoi de notifications (si activées), réponses à vos demandes de support.
      • Sécurité : Prévention de la fraude, détection d'activités malveillantes, respect de nos obligations légales.`
    },
    {
      id: 'cookies',
      title: 'Cookies et traceurs',
      icon: Cookie,
      content: `Nous utilisons des cookies pour améliorer votre navigation et mesurer l'audience du Site. Certains cookies sont strictement nécessaires au fonctionnement du Site, tandis que d'autres nécessitent votre consentement.`
    },
    {
      id: 'partage',
      title: 'Partage avec des tiers',
      icon: Shield,
      content: `Nous ne vendons jamais vos données personnelles à des tiers. Cependant, nous pouvons partager certaines données avec :
      
      • Prestataires de services : Hébergeurs, outils d'analyse d'audience (ex: Google Analytics), régies publicitaires.
      • Autorités légales : Uniquement en cas d'obligation légale ou de demande judiciaire formelle.
      • Partenaires commerciaux : Uniquement si vous y avez expressément consenti (ex: offres partenaires).`
    },
    {
      id: 'conservation',
      title: 'Durée de conservation',
      icon: Lock,
      content: `Nous conservons vos données uniquement le temps nécessaire aux finalités pour lesquelles elles ont été collectées :
      
      • Données de compte : Jusqu'à la suppression de votre compte par vos soins.
      • Historique et favoris : Liés à votre compte, supprimés lors de la clôture de celui-ci.
      • Logs de connexion : Conservés pendant une durée maximale de 12 mois.
      • Cookies : Durée de vie maximale de 13 mois conformément aux recommandations de la CNIL.`
    },
    {
      id: 'droits',
      title: 'Vos droits (RGPD)',
      icon: UserCheck,
      content: `Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
      
      • Droit d'accès : Obtenir une copie de vos données.
      • Droit de rectification : Corriger des données inexactes.
      • Droit à l'effacement : Demander la suppression de vos données.
      • Droit à la portabilité : Recevoir vos données dans un format structuré.
      • Droit d'opposition : Vous opposer au traitement de vos données pour des motifs légitimes.
      
      Vous pouvez exercer ces droits directement depuis les paramètres de votre compte ou en contactant notre DPO.`
    },
    {
      id: 'securite',
      title: 'Sécurité des données',
      icon: Lock,
      content: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou altération. 
      
      Cela inclut le chiffrement des données sensibles (SSL/TLS), des audits de sécurité réguliers et une gestion stricte des accès au sein de notre équipe.`
    },
    {
      id: 'contact',
      title: 'Contact DPO',
      icon: Info,
      content: `Pour toute question relative à la protection de vos données personnelles ou pour exercer vos droits, vous pouvez contacter notre Délégué à la Protection des Données (DPO) :
      
      • Par email : privacy@vibetube.com
      • Par courrier : VibeTube SAS, Service DPO, 123 Rue de la Confidentialité, 75000 Paris, France.`
    }
  ];

  const cookieTable = [
    { name: 'session_id', purpose: 'Maintien de la connexion utilisateur', duration: 'Session', type: 'Essentiel' },
    { name: 'theme_pref', purpose: 'Mémorisation du thème (clair/sombre)', duration: '1 an', type: 'Préférence' },
    { name: '_ga', purpose: 'Analyse d\'audience anonymisée', duration: '2 ans', type: 'Statistique' },
    { name: 'ad_consent', purpose: 'Mémorisation des choix publicitaires', duration: '6 mois', type: 'Marketing' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO title="Confidentialité" description="Politique de confidentialité de VibeTube. Comment nous protégeons vos données." />
      <div className="max-w-3xl mx-auto">
        <Breadcrumb items={[{ label: 'Confidentialité', path: '/privacy' }]} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-12"
        >
          {/* Header */}
          <div className="space-y-4 border-b border-muted/10 pb-8">
            <h1 className="text-3xl md:text-4xl font-black text-main uppercase tracking-tighter leading-none">
              Politique de Confidentialité
            </h1>
            <p className="text-sm text-muted font-bold italic">
              Dernière mise à jour : 20 Février 2026
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-surface rounded-3xl p-6 border border-muted/20 shadow-xl shadow-black/5">
            <h2 className="text-lg font-black text-main uppercase tracking-tighter mb-6 flex items-center gap-3">
              <Eye size={20} className="text-primary" />
              Sommaire
            </h2>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
              {sections.map((section) => (
                <a 
                  key={section.id} 
                  href={`#${section.id}`}
                  className="text-sm font-bold text-muted hover:text-primary transition-colors flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  {section.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Sections */}
          <div className="space-y-16 pb-20">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <section.icon size={20} />
                  </div>
                  <h2 className="text-xl font-black text-main uppercase tracking-tighter">{section.title}</h2>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  {section.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-muted leading-relaxed font-medium text-sm md:text-base">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>

                {/* Special Table for Cookies */}
                {section.id === 'cookies' && (
                  <div className="mt-6 overflow-hidden rounded-2xl border border-muted/20">
                    <table className="w-full text-left text-xs md:text-sm">
                      <thead className="bg-background">
                        <tr>
                          <th className="px-4 py-3 font-black text-main uppercase tracking-widest">Nom</th>
                          <th className="px-4 py-3 font-black text-main uppercase tracking-widest">Finalité</th>
                          <th className="px-4 py-3 font-black text-main uppercase tracking-widest">Durée</th>
                          <th className="px-4 py-3 font-black text-main uppercase tracking-widest">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/10">
                        {cookieTable.map((cookie, idx) => (
                          <tr key={idx} className="bg-surface hover:bg-background/50 transition-colors">
                            <td className="px-4 py-3 font-mono text-primary">{cookie.name}</td>
                            <td className="px-4 py-3 text-muted">{cookie.purpose}</td>
                            <td className="px-4 py-3 text-muted">{cookie.duration}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                cookie.type === 'Essentiel' ? 'bg-green-500/10 text-green-500' :
                                cookie.type === 'Préférence' ? 'bg-blue-500/10 text-blue-500' :
                                cookie.type === 'Statistique' ? 'bg-purple-500/10 text-purple-500' :
                                'bg-orange-500/10 text-orange-500'
                              }`}>
                                {cookie.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-primary text-white rounded-2xl shadow-2xl shadow-primary/40 hover:bg-orange-600 transition-all group"
            title="Retour en haut"
          >
            <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
