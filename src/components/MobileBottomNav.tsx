import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Flame, Folder, Star, User } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { motion } from 'motion/react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const navItems = [
    { label: 'Accueil', path: '/', icon: Home },
    { label: 'Populaires', path: '/popular', icon: Flame },
    { label: 'Catégories', path: '/categories', icon: Folder },
    { label: 'Pornstars', path: '/pornstars', icon: Star },
    { label: isLoggedIn ? 'Profil' : 'Connexion', path: isLoggedIn ? '/profile' : '/login', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-14 bg-surface/95 backdrop-blur-md border-t border-muted/20 flex items-center justify-around px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center flex-1 h-full relative group"
          >
            <div className={`transition-all duration-300 ${active ? 'text-primary scale-110' : 'text-muted group-hover:text-main'}`}>
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] mt-1 font-bold transition-colors ${active ? 'text-primary' : 'text-muted group-hover:text-main'}`}>
              {item.label}
            </span>
            {active && (
              <motion.div
                layoutId="bottomNavActive"
                className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
