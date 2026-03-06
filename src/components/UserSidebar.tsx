import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Heart, History, ListMusic, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export const UserSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: User, label: 'Mon profil', path: '/profile' },
    { icon: Heart, label: 'Mes favoris', path: '/favorites' },
    { icon: History, label: 'Mon historique', path: '/history' },
    { icon: ListMusic, label: 'Mes playlists', path: '/playlists' },
    { icon: Settings, label: 'Paramètres', path: '/settings' },
  ];

  return (
    <div className="space-y-2">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-surface rounded-2xl border border-muted/20 overflow-hidden">
        <div className="p-4 border-b border-muted/10">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted">Espace Personnel</h3>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-muted hover:text-main hover:bg-background'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
          <div className="h-px bg-muted/10 my-2 mx-4" />
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={18} />
            Se déconnecter
          </button>
        </nav>
      </div>

      {/* Mobile Navigation (Tabs) */}
      <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 no-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                isActive 
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                  : 'bg-surface text-muted border-muted/20'
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
