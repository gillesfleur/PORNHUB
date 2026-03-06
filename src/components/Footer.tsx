import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export const Footer: React.FC = () => {
  const { toggleLogin, isLoggedIn } = useAuth();
  return (
    <footer className="bg-surface border-t border-muted mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Categories */}
          <div>
            <h3 className="text-main font-bold mb-4 uppercase text-sm tracking-wider">Navigation</h3>
            <ul className="space-y-2 text-muted text-sm">
              <li><Link to="/" className="hover:text-primary">Accueil</Link></li>
              <li><Link to="/categories" className="hover:text-primary">Catégories</Link></li>
              <li><Link to="/tags" className="hover:text-primary">Tags populaires</Link></li>
              <li><Link to="/pornstars" className="hover:text-primary">Pornstars</Link></li>
              <li><Link to="/populaires" className="hover:text-primary">Vidéos populaires</Link></li>
            </ul>
          </div>

          {/* Col 2: Legal */}
          <div>
            <h3 className="text-main font-bold mb-4 uppercase text-sm tracking-wider">Pages légales</h3>
            <ul className="space-y-2 text-muted text-sm">
              <li><a href="#" className="hover:text-primary">CGU</a></li>
              <li><a href="#" className="hover:text-primary">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-primary">DMCA / Signalement</a></li>
              <li><a href="#" className="hover:text-primary">2257 Statement</a></li>
            </ul>
          </div>

          {/* Col 3: About */}
          <div>
            <h3 className="text-main font-bold mb-4 uppercase text-sm tracking-wider">À propos & Contact</h3>
            <ul className="space-y-2 text-muted text-sm">
              <li><a href="#" className="hover:text-primary">Qui sommes-nous ?</a></li>
              <li><a href="#" className="hover:text-primary">Contactez-nous</a></li>
              <li><a href="#" className="hover:text-primary">Publicité</a></li>
              <li><a href="#" className="hover:text-primary">Partenaires</a></li>
            </ul>
          </div>

          {/* Col 4: Social */}
          <div>
            <h3 className="text-main font-bold mb-4 uppercase text-sm tracking-wider">Suivez-nous</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted hover:text-primary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-muted hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-muted hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-muted hover:text-primary transition-colors"><Youtube size={20} /></a>
            </div>
            <div className="mt-6">
              <div className="inline-block border-2 border-red-600 text-red-600 font-bold px-3 py-1 rounded text-xl">
                18+
              </div>
              <p className="text-xs text-muted mt-2">Ce site contient du contenu réservé aux adultes.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-muted mt-12 pt-8 text-center text-xs text-muted relative">
          <p>© 2026 VibeTube. Tous droits réservés. Le contenu de ce site est simulé à des fins de démonstration.</p>
          
          {/* Developer Toggle - Hidden in plain sight */}
          <button 
            onClick={toggleLogin}
            className="absolute bottom-0 right-0 p-2 opacity-0 hover:opacity-10 transition-opacity cursor-default"
            title="Dev Toggle Auth"
          >
            <ShieldCheck size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
};
