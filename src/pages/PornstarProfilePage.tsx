import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdBanner } from '../components/AdBanner';
import { VideoCard } from '../components/VideoCard';
import { Pagination } from '../components/Pagination';
import { actors } from '../data/actors';
import { videos } from '../data/videos';
import { 
  Users, 
  Play, 
  Eye, 
  Heart, 
  Info, 
  Image as ImageIcon, 
  CheckCircle2, 
  ArrowUpDown, 
  TrendingUp,
  MapPin,
  Calendar,
  Briefcase,
  Ruler,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TabType = 'videos' | 'about' | 'photos';
type SortOption = 'recent' | 'popular' | 'top-rated';

import { SEO } from '../components/SEO';

export const PornstarProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('videos');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const actor = useMemo(() => actors.find(a => a.slug === slug), [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (actor) {
      // SEO component handles title
    }
  }, [actor]);

  const actorVideos = useMemo(() => {
    if (!actor) return [];
    return videos.filter(v => v.actorId === actor.id);
  }, [actor]);

  const stats = useMemo(() => {
    if (!actor) return { totalViews: 0, subscribers: '0' };
    const totalViews = actorVideos.reduce((acc, v) => {
      const views = parseFloat(v.views.replace('K', '')) * (v.views.includes('K') ? 1000 : 1);
      return acc + views;
    }, 0);
    // Fake subscribers based on video count
    const subscribers = (actor.videoCount * 12.5).toFixed(1) + 'K';
    return { totalViews, subscribers };
  }, [actor, actorVideos]);

  const sortedVideos = useMemo(() => {
    const result = [...actorVideos];
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => parseInt(a.date) - parseInt(b.date));
        break;
      case 'popular':
        result.sort((a, b) => {
          const viewsA = parseFloat(a.views.replace('K', '')) * (a.views.includes('K') ? 1000 : 1);
          const viewsB = parseFloat(b.views.replace('K', '')) * (b.views.includes('K') ? 1000 : 1);
          return viewsB - viewsA;
        });
        break;
      case 'top-rated':
        result.sort((a, b) => parseInt(b.likes) - parseInt(a.likes));
        break;
    }
    return result;
  }, [actorVideos, sortBy]);

  const totalPages = Math.ceil(sortedVideos.length / itemsPerPage);
  const paginatedVideos = sortedVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const similarActors = useMemo(() => {
    if (!actor) return [];
    return actors
      .filter(a => a.id !== actor.id && a.gender === actor.gender)
      .slice(0, 4);
  }, [actor]);

  const specialties = ['Anal', 'POV', 'Creampie', 'Hardcore', 'Teen'];

  const formatViews = (views: number) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
  };

  if (!actor) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface border border-muted/20 mb-6">
          <AlertCircle size={40} className="text-primary" />
        </div>
        <h1 className="text-3xl font-black text-main uppercase tracking-tighter mb-4">Profil Introuvable</h1>
        <p className="text-muted mb-8">Désolé, nous n'avons pas trouvé le profil de ce pornstar.</p>
        <Link 
          to="/pornstars" 
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-primary/20"
        >
          Retour aux pornstars
        </Link>
      </div>
    );
  }

  // Random cover color
  const coverColors = ['bg-rose-900', 'bg-indigo-900', 'bg-emerald-900', 'bg-amber-900', 'bg-violet-900'];
  const coverColor = coverColors[parseInt(actor.id) % coverColors.length];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20"
    >
      <SEO 
        title={actor.name} 
        description={`Découvrez le profil de ${actor.name} sur VibeTube. Vidéos, photos et biographie.`} 
      />
      {/* Hero Section */}
      <div className="relative mb-24">
        {/* Cover Banner */}
        <div className={`h-[200px] w-full ${coverColor} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          <div className="relative -mt-16 flex flex-col md:flex-row items-end md:items-center gap-6">
            {/* Profile Photo */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background overflow-hidden bg-surface shadow-2xl relative z-10">
                <img 
                  src={actor.photo} 
                  alt={actor.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full border-4 border-background z-20">
                <CheckCircle2 size={20} fill="currentColor" className="text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 pt-4 md:pt-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-main uppercase tracking-tighter flex items-center gap-3">
                    {actor.name}
                  </h1>
                  <p className="text-muted text-sm font-medium mt-1 max-w-2xl line-clamp-2">
                    {actor.bio}
                  </p>
                </div>
                
                <button 
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${
                    isSubscribed 
                      ? 'bg-surface border border-muted/20 text-muted' 
                      : 'bg-primary text-white hover:bg-orange-600 shadow-primary/20'
                  }`}
                >
                  {isSubscribed ? (
                    <>
                      <CheckCircle2 size={18} />
                      Abonné
                    </>
                  ) : (
                    <>
                      <Heart size={18} />
                      S'abonner
                    </>
                  )}
                </button>
              </div>

              {/* Stats & Tags */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <Play size={14} className="text-primary" />
                    <span className="text-xs font-black text-main uppercase tracking-wider">{actor.videoCount} Vidéos</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye size={14} className="text-primary" />
                    <span className="text-xs font-black text-main uppercase tracking-wider">{formatViews(stats.totalViews)} Vues</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-primary" />
                    <span className="text-xs font-black text-main uppercase tracking-wider">{stats.subscribers} Abonnés</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {specialties.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-surface border border-muted/10 rounded-full text-[10px] font-black text-muted uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb 
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Pornstars', href: '/pornstars' },
              { label: actor.name }
            ]} 
          />
        </div>

        {/* Ad Banner Leaderboard */}
        <AdBanner size="leaderboard" position="pornstar-profile-top" className="mb-12" />

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-surface/50 border border-muted/10 p-1.5 rounded-2xl mb-8 w-fit">
              {[
                { id: 'videos', label: 'Vidéos', icon: Play, count: actor.videoCount },
                { id: 'about', label: 'À propos', icon: Info },
                { id: 'photos', label: 'Photos', icon: ImageIcon, count: 16 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    activeTab === tab.id 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-muted hover:text-main hover:bg-background'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`ml-1 text-[10px] opacity-60 ${activeTab === tab.id ? 'text-white' : ''}`}>
                      ({tab.count})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'videos' && (
                <motion.div
                  key="videos"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-main uppercase tracking-tighter">Vidéos de {actor.name}</h2>
                    <div className="flex items-center gap-2">
                      <ArrowUpDown size={16} className="text-muted" />
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="bg-background border border-muted/20 rounded-xl py-2 px-4 text-xs font-bold text-main focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                      >
                        <option value="popular">Plus populaires</option>
                        <option value="recent">Plus récentes</option>
                        <option value="top-rated">Mieux notées</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paginatedVideos.map(video => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination 
                      totalPages={totalPages} 
                      initialPage={currentPage} 
                      onPageChange={(page) => setCurrentPage(page)} 
                    />
                  )}
                </motion.div>
              )}

              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-surface/30 rounded-3xl border border-muted/10 p-8"
                >
                  <h2 className="text-2xl font-black text-main uppercase tracking-tighter mb-8">Informations détaillées</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-3 border-b border-muted/10">
                        <div className="flex items-center gap-3 text-muted font-bold uppercase tracking-widest text-[10px]">
                          <MapPin size={14} className="text-primary" />
                          Nationalité
                        </div>
                        <span className="text-sm font-black text-main uppercase tracking-tight">Américaine</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-muted/10">
                        <div className="flex items-center gap-3 text-muted font-bold uppercase tracking-widest text-[10px]">
                          <Calendar size={14} className="text-primary" />
                          Date de naissance
                        </div>
                        <span className="text-sm font-black text-main uppercase tracking-tight">15 Mars 1996</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-muted/10">
                        <div className="flex items-center gap-3 text-muted font-bold uppercase tracking-widest text-[10px]">
                          <Briefcase size={14} className="text-primary" />
                          Carrière depuis
                        </div>
                        <span className="text-sm font-black text-main uppercase tracking-tight">2016</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-3 border-b border-muted/10">
                        <div className="flex items-center gap-3 text-muted font-bold uppercase tracking-widest text-[10px]">
                          <Ruler size={14} className="text-primary" />
                          Taille
                        </div>
                        <span className="text-sm font-black text-main uppercase tracking-tight">168 cm</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-muted/10">
                        <div className="flex items-center gap-3 text-muted font-bold uppercase tracking-widest text-[10px]">
                          <Heart size={14} className="text-primary" />
                          Mensurations
                        </div>
                        <span className="text-sm font-black text-main uppercase tracking-tight">34D-24-36</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-muted/10">
                        <div className="flex items-center gap-3 text-muted font-bold uppercase tracking-widest text-[10px]">
                          <TrendingUp size={14} className="text-primary" />
                          Popularité
                        </div>
                        <span className="text-sm font-black text-main uppercase tracking-tight">Top 0.1%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12">
                    <h3 className="text-sm font-black text-main uppercase tracking-widest mb-4">Biographie</h3>
                    <p className="text-muted leading-relaxed">
                      {actor.bio} Reconnue pour son talent exceptionnel et sa présence charismatique devant la caméra, 
                      elle est devenue l'une des personnalités les plus influentes de l'industrie. 
                      Avec plus de {actor.videoCount} productions à son actif, elle continue de repousser les limites 
                      et de captiver des millions de fans à travers le monde.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'photos' && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                >
                  {Array.from({ length: 16 }).map((_, i) => {
                    const colors = ['bg-rose-500/10', 'bg-indigo-500/10', 'bg-emerald-500/10', 'bg-amber-500/10', 'bg-violet-500/10'];
                    const color = colors[i % colors.length];
                    return (
                      <div 
                        key={i} 
                        className={`aspect-square rounded-2xl ${color} border border-muted/10 flex items-center justify-center group cursor-pointer hover:border-primary/50 transition-all`}
                      >
                        <ImageIcon size={24} className="text-muted group-hover:text-primary transition-colors" />
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-10">
            {/* Similar Actors */}
            <div className="bg-surface/30 rounded-3xl border border-muted/10 p-6">
              <h3 className="text-sm font-black text-main uppercase tracking-widest mb-6 flex items-center gap-2">
                <Users size={16} className="text-primary" />
                Pornstars similaires
              </h3>
              <div className="space-y-4">
                {similarActors.map(similar => (
                  <Link 
                    key={similar.id}
                    to={`/pornstar/${similar.slug}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-transparent group-hover:border-primary transition-all">
                      <img 
                        src={similar.photo} 
                        alt={similar.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-main uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                        {similar.name}
                      </h4>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
                        {similar.videoCount} Vidéos
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-muted group-hover:text-primary transition-all" />
                  </Link>
                ))}
              </div>
              <Link 
                to="/pornstars" 
                className="mt-6 block text-center py-3 rounded-xl bg-background border border-muted/10 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary hover:border-primary transition-all"
              >
                Voir tout
              </Link>
            </div>

            {/* Rectangle Ad */}
            <AdBanner size="rectangle" position="pornstar-profile-sidebar" />
          </aside>
        </div>
      </div>
    </motion.div>
  );
};
