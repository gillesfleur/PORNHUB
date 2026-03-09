import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  Users, 
  FolderTree, 
  Tag, 
  MessageSquare, 
  AlertTriangle, 
  Megaphone, 
  Settings, 
  ExternalLink, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen 
}) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Video, label: 'Vidéos', path: '/admin/videos' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: FolderTree, label: 'Catégories', path: '/admin/categories' },
    { icon: Tag, label: 'Tags', path: '/admin/tags' },
    { icon: MessageSquare, label: 'Commentaires', path: '/admin/comments' },
    { icon: AlertTriangle, label: 'Signalements', path: '/admin/reports' },
    { icon: Megaphone, label: 'Publicités', path: '/admin/ads' },
    { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111111] text-white border-r border-white/5">
      {/* Logo Section */}
      <div className={`p-6 flex items-center gap-3 border-b border-white/5 ${isCollapsed ? 'justify-center px-0' : ''}`}>
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <Shield size={24} className="text-white" fill="currentColor" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-xl font-black tracking-tighter leading-none">Vibe<span className="text-primary">Admin</span></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted opacity-60">Administration</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-grow py-6 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                active 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              {active && (
                <motion.div 
                  layoutId="adminActiveNav"
                  className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-full"
                />
              )}
              <item.icon size={20} className={active ? 'text-primary' : 'text-muted group-hover:text-white'} />
              {!isCollapsed && (
                <span className="text-sm font-bold truncate">{item.label}</span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-surface border border-white/10 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        <div className="h-px bg-white/5 my-6 mx-3" />

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all group relative"
        >
          <ExternalLink size={20} />
          {!isCollapsed && <span className="text-sm font-bold">Voir le site</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-surface border border-white/10 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Voir le site
            </div>
          )}
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all group relative"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-bold">Déconnexion</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-surface border border-white/10 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Déconnexion
            </div>
          )}
        </button>
      </nav>

      {/* Toggle Button (Desktop Only) */}
      <div className="p-4 border-t border-white/5 hidden lg:block">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted hover:text-white transition-all"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:block fixed top-0 left-0 bottom-0 z-50 transition-all duration-300 ${
          isCollapsed ? 'w-[70px]' : 'w-[260px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[260px] z-[70] lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
