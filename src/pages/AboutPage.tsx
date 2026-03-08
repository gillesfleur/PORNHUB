import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdBanner } from '../components/AdBanner';
import { Shield, Search, Play, Users, Mail, Heart, Globe, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

import { SEO } from '../components/SEO';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO component handles title
  }, []);

  const steps = [
    {
      icon: Search,
      title: 'Parcourez',
      description: 'Explorez des milliers de vidéos classées par catégories, tags et pornstars.'
    },
    {
      icon: Heart,
      title: 'Découvrez',
      description: 'Trouvez vos contenus préférés grâce à notre algorithme de recommandation intelligent.'
    },
    {
      icon: Play,
      title: 'Regardez',
      description: 'Profitez d\'une expérience de visionnage fluide en haute définition gratuitement.'
    }
  ];

  const team = [
    {
      name: 'Marc Lefebvre',
      role: 'Fondateur & CEO',
      avatar: 'https://picsum.photos/seed/marc/200'
    },
    {
      name: 'Sophie Durand',
      role: 'Directrice Produit',
      avatar: 'https://picsum.photos/seed/sophie/200'
    },
    {
      name: 'Thomas Martin',
      role: 'Lead Developer',
      avatar: 'https://picsum.photos/seed/thomas/200'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO title="À propos" description="En savoir plus sur VibeTube, votre destination ultime pour le divertissement adulte." />
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: 'À propos', path: '/about' }]} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-16"
        >
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-main tracking-tighter uppercase">
              À propos de <span className="text-primary">Vibe</span>Tube
            </h1>
            <p className="text-lg text-muted font-medium max-w-2xl mx-auto leading-relaxed">
              La destination ultime pour le meilleur du divertissement adulte, 
              regroupant les contenus les plus populaires du web en un seul endroit.
            </p>
          </div>

          {/* Mission Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Globe size={24} />
              </div>
              <h2 className="text-2xl font-black text-main uppercase tracking-tighter">Notre mission</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted leading-relaxed font-medium">
                VibeTube a été conçu avec une idée simple : simplifier l'accès au divertissement adulte de qualité. 
                En tant qu'agrégateur gratuit, nous parcourons le web pour vous proposer une sélection rigoureuse 
                des meilleures vidéos, organisées de manière intuitive. Notre plateforme ne stocke pas de contenu 
                directement mais indexe les liens publics, vous offrant ainsi une porte d'entrée unique vers 
                un univers de plaisir sans fin, le tout sans frais d'abonnement.
              </p>
            </div>
          </section>

          {/* How it works */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-black text-main uppercase tracking-tighter">Comment ça marche</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="bg-surface p-8 rounded-3xl border border-muted/20 text-center space-y-4 shadow-xl shadow-black/5">
                  <div className="inline-flex p-4 bg-primary/10 text-primary rounded-2xl mb-2">
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-lg font-black text-main uppercase tracking-tighter">{step.title}</h3>
                  <p className="text-sm text-muted font-medium leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Commitment Section */}
          <section className="bg-surface rounded-3xl p-8 border border-muted/20 shadow-xl shadow-black/5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-black text-main uppercase tracking-tighter">Notre engagement</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-black text-main uppercase">Vérification de l'âge</h4>
                    <p className="text-xs text-muted font-medium mt-1">Nous appliquons strictement les politiques de vérification de l'âge pour garantir un environnement conforme à la loi.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-black text-main uppercase">Respect du DMCA</h4>
                    <p className="text-xs text-muted font-medium mt-1">Nous respectons les droits d'auteur et traitons rapidement toute demande de retrait conforme au DMCA.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-black text-main uppercase">Zéro contenu illégal</h4>
                    <p className="text-xs text-muted font-medium mt-1">Nous avons une politique de tolérance zéro envers tout contenu illégal ou non consenti.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-black text-main uppercase">Confidentialité</h4>
                    <p className="text-xs text-muted font-medium mt-1">Vos données sont protégées et nous ne vendons jamais vos informations personnelles à des tiers.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Users size={24} />
              </div>
              <h2 className="text-2xl font-black text-main uppercase tracking-tighter">L'équipe</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <div key={index} className="group bg-surface rounded-3xl p-6 border border-muted/20 text-center space-y-4 hover:border-primary/30 transition-all shadow-lg shadow-black/5">
                  <div className="relative inline-block">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-xl group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-main uppercase tracking-tight">{member.name}</h3>
                    <p className="text-xs text-primary font-bold">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center bg-primary/5 rounded-3xl p-12 border border-primary/10 space-y-6">
            <h2 className="text-2xl font-black text-main uppercase tracking-tighter">Une question ?</h2>
            <p className="text-muted font-medium max-w-md mx-auto">
              Notre équipe support est à votre disposition pour répondre à toutes vos interrogations ou suggestions.
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-orange-600 transition-all"
            >
              <Mail size={18} />
              Nous contacter
            </Link>
          </section>

          <div className="pt-8">
            <AdBanner size="leaderboard" position="about-bottom" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
