import React, { useState } from 'react';
import { Search, Menu, Moon, Sun, User, X } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import { useAuth } from '../lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, History, ListMusic, Settings, LogOut, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user, logout, toggleLogin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b border-muted shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo & Menu Toggle */}
        <div className="flex items-center gap-2">
          <button 
            className="lg:hidden p-2 text-main hover:bg-background rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center" onContextMenu={(e) => { e.preventDefault(); toggleLogin(); }}>
            <span className="text-primary">Vibe</span>
            <span className="text-main">Tube</span>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <SearchBar />
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className="text-main hover:text-primary font-medium transition-colors">Accueil</Link>
          <Link to="/categories" className="text-main hover:text-primary font-medium transition-colors">Catégories</Link>
          <Link to="/tags" className="text-main hover:text-primary font-medium transition-colors">Tags</Link>
          <Link to="/pornstars" className="text-main hover:text-primary font-medium transition-colors">Pornstars</Link>
          <Link to="/popular" className="text-main hover:text-primary font-medium transition-colors">Populaires</Link>
          <Link to="/trending" className="text-main hover:text-primary font-medium transition-colors">Tendances</Link>
          <Link to="/recent" className="text-main hover:text-primary font-medium transition-colors">Récents</Link>
          <Link to="/top-rated" className="text-main hover:text-primary font-medium transition-colors">Mieux notés</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-4">
          {/* Mobile Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-full hover:bg-background text-main transition-colors"
          >
            <Search size={22} />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-background text-main transition-colors"
            title={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-background transition-all border border-muted/20"
              >
                <img
                  src={user?.avatar}
                  alt={user?.username}
                  className="w-8 h-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
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
                      <div className="p-4 bg-background/50 border-b border-muted/10">
                        <p className="text-sm font-black text-main truncate">{user?.username}</p>
                        <p className="text-xs font-medium text-muted truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-surface border-t border-muted overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <Link to="/" className="text-main font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
              <Link to="/categories" className="text-main font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Catégories</Link>
              <Link to="/tags" className="text-main font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Tags</Link>
              <Link to="/pornstars" className="text-main font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Pornstars</Link>
              <Link to="/popular" className="text-main font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Populaires</Link>
              <Link to="/trending" className="text-main font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Tendances</Link>
              <Link to="/recent" className="text-main font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Récents</Link>
              <Link to="/top-rated" className="text-main font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Mieux notés</Link>
              <div className="h-px bg-muted/10 my-2" />
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="text-main font-bold" onClick={() => setIsMenuOpen(false)}>Mon profil</Link>
                  <button onClick={handleLogout} className="text-red-500 font-bold text-left">Se déconnecter</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-primary font-bold" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
                  <Link to="/register" className="text-main font-bold" onClick={() => setIsMenuOpen(false)}>Inscription</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
