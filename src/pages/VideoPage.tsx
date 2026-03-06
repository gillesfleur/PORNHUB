import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videos } from '../data/videos';
import { actors } from '../data/actors';
import { VideoPlayer } from '../components/VideoPlayer';
import { Breadcrumb } from '../components/Breadcrumb';
import { AdBanner } from '../components/AdBanner';
import { VideoActions } from '../components/VideoActions';
import { VideoTags } from '../components/VideoTags';
import { SuggestedVideos } from '../components/SuggestedVideos';
import { VideoComments } from '../components/VideoComments';
import { Eye, Calendar, Clock, CheckCircle2, ThumbsUp } from 'lucide-react';
import { motion } from 'motion/react';

export const VideoPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const video = videos.find(v => 
    v.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') === slug
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (video) {
      document.title = `${video.title} - VibeTube`;
    }
  }, [video]);

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-black text-main mb-4">Oups ! Vidéo non trouvée</h1>
        <p className="text-muted mb-8">Le contenu que vous recherchez n'existe pas ou a été déplacé.</p>
        <Link to="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-12"
    >
      {/* Player Section - Full Width Background */}
      <div className="bg-black">
        <div className="container mx-auto">
          <VideoPlayer thumbnail={video.thumbnail} />
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: video.category, href: `/category/${video.category.toLowerCase()}` },
            { label: video.title }
          ]} 
        />

        {/* Main Layout Grid */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Player Info & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Metrics */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black text-main leading-tight">
                {video.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted font-medium border-b border-muted/10 pb-4">
                <div className="flex items-center gap-1.5">
                  <Eye size={18} className="text-primary" />
                  <span className="text-main font-bold">{video.views}</span> vues
                </div>
                <div className="flex items-center gap-1.5">
                  <ThumbsUp size={18} className="text-primary" />
                  <span className="text-main font-bold">{video.likes}</span> likes
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={18} />
                  Publié il y a {video.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={18} />
                  {video.duration}
                </div>
              </div>
            </div>

            {/* Actor Info */}
            <div className="flex items-center justify-between bg-surface/50 p-4 rounded-2xl border border-muted/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xl border-2 border-primary/20">
                  {video.actor.charAt(0)}
                </div>
                <div>
                  <Link 
                    to={`/pornstar/${actors.find(a => a.id === video.actorId)?.slug || video.actorId}`}
                    className="flex items-center gap-1.5 text-main font-black hover:text-primary transition-colors"
                  >
                    {video.actor}
                    <CheckCircle2 size={16} className="text-blue-500 fill-blue-500/10" />
                  </Link>
                  <span className="text-xs text-muted font-bold uppercase tracking-wider">Acteur Vérifié</span>
                </div>
              </div>
              <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-6 py-2 rounded-full font-bold text-sm transition-all border border-primary/20">
                S'abonner
              </button>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-main">Description</h3>
              <p className="text-muted leading-relaxed">
                Découvrez cette scène incroyable mettant en vedette <span className="text-primary font-bold">{video.actor}</span> dans une performance époustouflante. 
                Une production exclusive <span className="text-main font-medium">VibeTube Originals</span> tournée en haute définition 4K pour une expérience immersive totale.
                N'oubliez pas de liker et de partager si vous avez aimé !
              </p>
            </div>

            {/* Video Action Bar */}
            <VideoActions initialLikes={video.likes} />

            {/* Category & Tags Section */}
            <VideoTags category={video.category} tags={video.tags} />

            {/* Ad Banner */}
            <div className="py-4">
              <AdBanner size="leaderboard" position="video-page-under-info" />
            </div>

            {/* Comments Section */}
            <VideoComments />

            {/* Mobile Suggestions (Hidden on Desktop) */}
            <div className="lg:hidden">
              <SuggestedVideos 
                currentVideoId={video.id} 
                category={video.category} 
                tags={video.tags} 
              />
            </div>
          </div>

          {/* Right Column: Sidebar Suggestions (Hidden on Mobile) */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-surface/30 p-4 rounded-2xl border border-muted/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted mb-4">Publicité</h3>
              <AdBanner size="rectangle" position="video-sidebar" />
            </div>
            
            <SuggestedVideos 
              currentVideoId={video.id} 
              category={video.category} 
              tags={video.tags} 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
