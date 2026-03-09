import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  ChevronRight,
  Home
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface AdminHeaderProps {
  setIsMobileOpen: (value: boolean) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Nouveau signalement', message: 'La vidéo #1234 a été signalée pour contenu inapproprié.', time: 'Il y a 12 min', unread: true },
    { id: 2, title: 'Nouvel utilisateur', message: 'Marie_92 vient de s\'inscrire sur la plateforme.', time: 'Il y a 34 min', unread: true },
    { id: 3, title: 'Mise à jour système', message: 'La maintenance hebdomadaire est terminée.', time: 'Il y a 2h', unread: false },
  ];

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(p => p);
    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      return { label, url };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-surface border-b border-muted/10 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 text-muted hover:text-main transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
          <Link to="/admin/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home size={14} />
            Admin
          </Link>
          {breadcrumbs.slice(1).map((crumb, idx) => (
            <React.Fragment key={crumb.url}>
              <ChevronRight size={12} className="opacity-40" />
              <Link 
                to={crumb.url} 
                className={`transition-colors ${idx === breadcrumbs.length - 2 ? 'text-main' : 'hover:text-primary'}`}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Search Bar */}
      <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input 
          type="text"
          placeholder="Rechercher vidéos, utilisateurs..."
          className="w-full bg-background border border-muted/20 rounded-xl py-2 pl-12 pr-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2.5 rounded-xl hover:bg-background text-muted hover:text-main transition-all relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface" />
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-surface border border-muted/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-muted/10 flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-main">Notifications</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">3 nouvelles</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-muted/5 hover:bg-background/50 transition-colors cursor-pointer ${notif.unread ? 'bg-primary/5' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-xs font-black text-main">{notif.title}</h4>
                          <span className="text-[10px] text-muted font-bold">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-muted leading-relaxed line-clamp-2">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full p-3 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors bg-background/30">
                    Voir toutes les notifications
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-background transition-all border border-muted/10"
          >
            <img 
              src={user?.avatar} 
              alt={user?.username} 
              className="w-8 h-8 rounded-lg object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-black text-main leading-none mb-1">{user?.username}</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">Admin</p>
            </div>
            <ChevronDown size={14} className={`text-muted transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isUserDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-surface border border-muted/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 bg-background/50 border-b border-muted/10">
                    <p className="text-xs font-black text-main">{user?.username}</p>
                    <p className="text-[10px] font-bold text-muted truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-muted hover:text-main hover:bg-background transition-all"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <User size={16} />
                      Mon Profil
                    </Link>
                    <Link 
                      to="/admin/settings" 
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-muted hover:text-main hover:bg-background transition-all"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <Settings size={16} />
                      Paramètres
                    </Link>
                    <div className="h-px bg-muted/10 my-1 mx-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
