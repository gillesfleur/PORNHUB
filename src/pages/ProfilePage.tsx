import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Eye, Heart, ListMusic, MessageSquare, Edit3, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { UserSidebar } from '../components/UserSidebar';
import { Breadcrumb } from '../components/Breadcrumb';

import { SEO } from '../components/SEO';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO component handles title
  }, []);

  const stats = [
    { label: 'Vidéos vues', value: '1,284', icon: Eye, color: 'text-blue-500' },
    { label: 'Favoris', value: '42', icon: Heart, color: 'text-red-500' },
    { label: 'Playlists', value: '8', icon: ListMusic, color: 'text-primary' },
    { label: 'Commentaires', value: '15', icon: MessageSquare, color: 'text-emerald-500' },
  ];

  const recentActivity = [
    { type: 'like', text: 'Vous avez aimé "Lana Rhoades - Best of 2024"', time: 'Il y a 2 heures' },
    { type: 'favorite', text: 'Vous avez ajouté "Riley Reid - New Release" à vos favoris', time: 'Il y a 5 heures' },
    { type: 'playlist', text: 'Vous avez ajouté une vidéo à la playlist "Soirée"', time: 'Hier' },
    { type: 'comment', text: 'Vous avez commenté sur "Abella Danger - Exclusive"', time: 'Il y a 2 jours' },
    { type: 'view', text: 'Vous avez regardé "Johnny Sins - The Doctor"', time: 'Il y a 3 jours' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO title="Mon Profil" description="Gérez votre profil et vos préférences sur VibeTube." />
      <Breadcrumb items={[{ label: 'Mon profil', path: '/profile' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <UserSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-3xl p-8 border border-muted/20 shadow-xl shadow-black/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <User size={120} />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-2xl">
                  <img 
                    src={user?.avatar} 
                    alt={user?.username} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <Link 
                  to="/settings" 
                  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors"
                >
                  <Edit3 size={16} />
                </Link>
              </div>

              <div className="text-center md:text-left space-y-2">
                <h1 className="text-3xl font-black text-main tracking-tighter">{user?.username}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted font-bold">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-primary" />
                    {user?.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    Membre depuis Mars 2024
                  </div>
                </div>
                <div className="pt-2">
                  <Link 
                    to="/settings"
                    className="inline-flex items-center gap-2 bg-background border border-muted/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-main hover:bg-surface hover:border-primary/50 transition-all"
                  >
                    Modifier le profil
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface p-6 rounded-2xl border border-muted/10 shadow-lg shadow-black/5 text-center space-y-2"
              >
                <div className={`inline-flex p-3 rounded-xl bg-background ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-2xl font-black text-main tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface rounded-3xl border border-muted/20 overflow-hidden shadow-xl shadow-black/5"
          >
            <div className="p-6 border-b border-muted/10 flex items-center justify-between">
              <h2 className="text-lg font-black text-main uppercase tracking-tighter flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                Activité récente
              </h2>
            </div>
            <div className="divide-y divide-muted/10">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className="p-4 flex items-center justify-between hover:bg-background/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-bold text-main group-hover:text-primary transition-colors">
                        {activity.text}
                      </p>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              ))}
            </div>
            <div className="p-4 bg-background/30 text-center">
              <button className="text-xs font-black uppercase tracking-widest text-muted hover:text-primary transition-colors">
                Voir tout l'historique
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
