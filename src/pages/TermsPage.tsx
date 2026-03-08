import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, BookOpen, Scale, ShieldCheck, AlertCircle } from 'lucide-react';

import { SEO } from '../components/SEO';

export const TermsPage: React.FC = () => {
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

  const articles = [
    {
      id: 'article-1',
      title: 'Article 1 : Objet',
      content: `Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont pour objet de définir les modalités et conditions dans lesquelles le site VibeTube (ci-après "le Site") met à la disposition des utilisateurs son service d'agrégation de contenus audiovisuels pour adultes. 
      
      L'accès et l'utilisation du Site impliquent l'acceptation pleine et entière par l'utilisateur des présentes CGU. Si l'utilisateur n'accepte pas tout ou partie des présentes conditions, il doit renoncer à tout usage du Site.`
    },
    {
      id: 'article-2',
      title: 'Article 2 : Accès au service',
      content: `L'accès au Site est strictement réservé aux personnes physiques majeures (18 ans ou plus, ou l'âge de la majorité légale dans leur pays de résidence). En accédant au Site, l'utilisateur certifie sur l'honneur être majeur.
      
      Le Site s'efforce de permettre l'accès au service 24 heures sur 24, 7 jours sur 7, sauf en cas de force majeure ou d'un événement hors du contrôle du Site, et sous réserve des éventuelles pannes et interventions de maintenance nécessaires au bon fonctionnement du service.`
    },
    {
      id: 'article-3',
      title: 'Article 3 : Conditions d\'utilisation',
      content: `L'utilisateur s'engage à utiliser le Site conformément aux lois et règlements en vigueur. Il est strictement interdit d'utiliser le Site pour diffuser, promouvoir ou accéder à des contenus illégaux, notamment des contenus mettant en scène des mineurs, des contenus non consentis, ou des contenus incitant à la haine ou à la violence.
      
      Toute utilisation abusive du Site, telle que le scraping automatisé de données, l'injection de code malveillant ou la tentative d'intrusion dans les systèmes informatiques du Site, pourra donner lieu à des poursuites judiciaires.`
    },
    {
      id: 'article-4',
      title: 'Article 4 : Propriété intellectuelle',
      content: `VibeTube est un agrégateur de contenus. Les marques, logos, graphismes, photographies, animations, vidéos et textes contenus sur le Site sont la propriété intellectuelle de VibeTube ou de ses partenaires et ne peuvent être reproduits, utilisés ou représentés sans l'autorisation expresse de VibeTube ou de ses partenaires, sous peine de poursuites judiciaires.
      
      Les vidéos indexées par le Site restent la propriété exclusive de leurs auteurs ou ayants droit respectifs. VibeTube n'héberge pas ces vidéos et ne saurait être tenu responsable de leur contenu.`
    },
    {
      id: 'article-5',
      title: 'Article 5 : Contenus et responsabilités',
      content: `En tant qu'agrégateur, VibeTube n'exerce aucun contrôle a priori sur les contenus indexés. La responsabilité du Site ne saurait être engagée du fait des contenus présents sur les sites tiers vers lesquels le Site renvoie.
      
      Toutefois, VibeTube s'engage à retirer promptement tout lien vers un contenu manifestement illicite dès qu'il en a connaissance. Les utilisateurs sont invités à signaler tout contenu inapproprié via notre formulaire de contact.`
    },
    {
      id: 'article-6',
      title: 'Article 6 : Données personnelles',
      content: `Le Site collecte certaines données personnelles nécessaires au bon fonctionnement du service et à l'amélioration de l'expérience utilisateur. Ces données sont traitées conformément à notre Politique de Confidentialité et au Règlement Général sur la Protection des Données (RGPD).
      
      L'utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de ses données personnelles, qu'il peut exercer via les paramètres de son compte ou en nous contactant directement.`
    },
    {
      id: 'article-7',
      title: 'Article 7 : Publicité',
      content: `Le Site peut afficher des publicités provenant de régies publicitaires tierces. VibeTube ne contrôle pas le contenu de ces publicités et ne saurait être tenu responsable des produits ou services promus par ces tiers.
      
      L'utilisateur reconnaît que l'affichage de publicités est nécessaire au maintien de la gratuité du service proposé par VibeTube.`
    },
    {
      id: 'article-8',
      title: 'Article 8 : Limitation de responsabilité',
      content: `VibeTube ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation du Site ou de l'impossibilité d'y accéder. Le service est fourni "en l'état" sans aucune garantie de quelque nature que ce soit.
      
      Le Site ne garantit pas que les contenus indexés sont exempts d'erreurs, de virus ou d'autres composants nuisibles.`
    },
    {
      id: 'article-9',
      title: 'Article 9 : Modification des CGU',
      content: `VibeTube se réserve le droit de modifier, à tout moment et sans préavis, les présentes CGU afin de les adapter aux évolutions du Site et/ou de son exploitation.
      
      L'utilisateur est invité à consulter régulièrement la dernière version des CGU disponible sur le Site. L'utilisation continue du Site après modification des CGU vaut acceptation de celles-ci.`
    },
    {
      id: 'article-10',
      title: 'Article 10 : Droit applicable et juridiction',
      content: `Les présentes CGU sont soumises au droit français. En cas de litige relatif à l'interprétation ou à l'exécution des présentes conditions, et à défaut d'accord amiable, les tribunaux français seront seuls compétents.
      
      Si une disposition des présentes CGU est jugée invalide par un tribunal compétent, l'invalidité de cette disposition n'affectera pas la validité des autres dispositions des présentes CGU.`
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO title="Conditions d'utilisation" description="Conditions générales d'utilisation de VibeTube. Règles et responsabilités." />
      <div className="max-w-3xl mx-auto">
        <Breadcrumb items={[{ label: 'CGU', path: '/terms' }]} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-12"
        >
          {/* Header */}
          <div className="space-y-4 border-b border-muted/10 pb-8">
            <h1 className="text-3xl md:text-4xl font-black text-main uppercase tracking-tighter leading-none">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-sm text-muted font-bold italic">
              Dernière mise à jour : 15 Janvier 2026
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-surface rounded-3xl p-6 border border-muted/20 shadow-xl shadow-black/5">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={20} className="text-primary" />
              <h2 className="text-lg font-black text-main uppercase tracking-tighter">Table des matières</h2>
            </div>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
              {articles.map((article) => (
                <a 
                  key={article.id} 
                  href={`#${article.id}`}
                  className="text-sm font-bold text-muted hover:text-primary transition-colors flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  {article.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Warning Box */}
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6 flex gap-4 items-start">
            <AlertCircle className="text-orange-500 shrink-0 mt-1" size={24} />
            <div className="space-y-1">
              <h3 className="text-sm font-black text-orange-500 uppercase">Avertissement important</h3>
              <p className="text-xs text-muted font-medium leading-relaxed">
                L'accès à ce site est strictement interdit aux mineurs. En poursuivant votre navigation, vous confirmez être majeur selon la législation de votre pays.
              </p>
            </div>
          </div>

          {/* Articles */}
          <div className="space-y-16 pb-20">
            {articles.map((article) => (
              <section key={article.id} id={article.id} className="scroll-mt-24 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Scale size={20} />
                  </div>
                  <h2 className="text-xl font-black text-main uppercase tracking-tighter">{article.title}</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  {article.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-muted leading-relaxed font-medium text-sm md:text-base">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
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
