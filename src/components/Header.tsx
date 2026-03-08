import React, { useState, useEffect } from 'react';
import { Search, Menu, Moon, Sun, User, X, Shield } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import { useAuth } from '../lib/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, History, ListMusic, Settings, LogOut, ChevronDown, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsCompact(true);
      } else {
        setIsCompact(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isSearchOpen]);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
    setShowLogoutToast(true);
    setTimeout(() => setShowLogoutToast(false), 3000);
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Catégories', path: '/categories' },
    { label: 'Tags', path: '/tags' },
    { label: 'Pornstars', path: '/pornstars' },
    { label: 'Populaires', path: '/popular' },
    { label: 'Tendances', path: '/trending' },
    { label: 'Récents', path: '/recent' },
    { label: 'Mieux notés', path: '/top-rated' },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-md border-b border-muted shadow-md transition-all duration-300 ${isCompact ? 'h-14' : 'h-16'}`}>
        <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">
          {/* Logo & Menu Toggle */}
          <div className="flex items-center gap-2">
            <button 
              className="lg:hidden p-3 -ml-2 text-main hover:bg-background rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center transition-all duration-300">
              <span className="text-primary">Vibe</span>
              <span className={`text-main transition-all duration-300 ${isCompact ? 'scale-90 origin-left' : ''}`}>Tube</span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className={`hidden md:flex flex-1 justify-center px-4 transition-all duration-300 ${isCompact ? 'max-w-md' : 'max-w-xl'}`}>
            <SearchBar />
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-sm font-bold transition-all relative py-1 ${
                  isActive(link.path) ? 'text-primary' : 'text-main hover:text-primary'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-4">
            {/* Mobile Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-3 rounded-full hover:bg-background text-main transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Search size={22} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-full hover:bg-background text-main transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              title={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-background transition-all border border-muted/20 min-w-[44px] min-h-[44px] justify-center relative"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {user?.role === 'admin' && (
                    <div className="absolute -top-1 -right-1 bg-primary text-white p-0.5 rounded-full border-2 border-surface shadow-lg">
                      <Shield size={10} fill="currentColor" />
                    </div>
                  )}
                  <ChevronDown size={16} className={`text-muted transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsUserDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-surface border border-muted/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 bg-background/50 border-b border-muted/10 flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={user?.avatar}
                              alt={user?.username}
                              className="w-10 h-10 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {user?.role === 'admin' && (
                              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 rounded-full border-2 border-surface shadow-lg">
                                <Shield size={10} fill="currentColor" />
                              </div>
                            )}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-black text-main truncate flex items-center gap-1">
                              {user?.username}
                              {user?.role === 'admin' && <Shield size={12} className="text-primary" fill="currentColor" />}
                            </p>
                            <p className="text-xs font-medium text-muted truncate">{user?.email}</p>
                          </div>
                        </div>
                        <div className="p-2">
                          {user?.role === 'admin' && (
                            <>
                              <Link
                                to="/admin/dashboard"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-black text-primary hover:bg-primary/5 transition-all"
                                onClick={() => setIsUserDropdownOpen(false)}
                              >
                                <Shield size={18} fill="currentColor" />
                                Administration
                              </Link>
                              <div className="h-px bg-muted/10 my-1 mx-2" />
                            </>
                          )}
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-muted hover:text-main hover:bg-background transition-all"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <User size={18} />
                            Mon profil
                          </Link>
                          <Link
                            to="/favorites"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-muted hover:text-main hover:bg-background transition-all"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Heart size={18} />
                            Mes favoris
                          </Link>
                          <Link
                            to="/history"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-muted hover:text-main hover:bg-background transition-all"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <History size={18} />
                            Mon historique
                          </Link>
                          <Link
                            to="/playlists"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-muted hover:text-main hover:bg-background transition-all"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <ListMusic size={18} />
                            Mes playlists
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-muted hover:text-main hover:bg-background transition-all"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Settings size={18} />
                            Paramètres
                          </Link>
                          <div className="h-px bg-muted/10 my-1 mx-2" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/5 transition-all"
                          >
                            <LogOut size={18} />
                            Se déconnecter
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link 
                  to="/register"
                  className="hidden sm:flex items-center gap-2 text-main hover:text-primary font-bold transition-colors"
                >
                  Inscription
                </Link>
                <Link 
                  to="/login"
                  className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-full font-bold transition-colors shadow-lg shadow-primary/20"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">Connexion</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md p-4 flex flex-col items-center"
          >
            <div className="w-full flex justify-end mb-8">
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-3 text-main hover:bg-surface rounded-full transition-colors"
              >
                <X size={32} />
              </button>
            </div>
            <SearchBar isMobile onClose={() => setIsSearchOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[100] w-[280px] bg-surface shadow-2xl lg:hidden overflow-y-auto custom-scrollbar overscroll-contain border-r border-muted/10"
            >
              <div className="p-6 flex flex-col gap-1 min-h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center" onClick={() => setIsMenuOpen(false)}>
                    <span className="text-primary">Vibe</span>
                    <span className="text-main">Tube</span>
                  </Link>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-muted hover:text-main hover:bg-background rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.path}
                      to={link.path} 
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        isActive(link.path) 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted hover:text-main hover:bg-background'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-muted/10 my-4 mx-4" />
                
                <div className="space-y-1">
                  {isLoggedIn ? (
                    <>
                      {user?.role === 'admin' && (
                        <>
                          <Link 
                            to="/admin/dashboard" 
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-black text-primary bg-primary/5 transition-all`} 
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Shield size={18} fill="currentColor" />
                            Administration
                          </Link>
                          <div className="h-px bg-muted/10 my-2 mx-4" />
                        </>
                      )}
                      <Link 
                        to="/profile" 
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive('/profile') ? 'text-primary bg-primary/10' : 'text-muted hover:text-main hover:bg-background'}`} 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={18} />
                        Mon profil
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/5 transition-all"
                      >
                        <LogOut size={18} />
                        Se déconnecter
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive('/login') ? 'text-primary bg-primary/10' : 'text-muted hover:text-main hover:bg-background'}`} 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={18} />
                        Connexion
                      </Link>
                      <Link 
                        to="/register" 
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive('/register') ? 'text-primary bg-primary/10' : 'text-muted hover:text-main hover:bg-background'}`} 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={18} />
                        Inscription
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Toast */}
      <AnimatePresence>
        {showLogoutToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-surface border border-muted/20 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm text-main"
          >
            <CheckCircle2 size={20} className="text-emerald-500" />
            Vous avez été déconnecté
          </motion.div>
        )}
      </AnimatePresence>
    </>

  );
};
