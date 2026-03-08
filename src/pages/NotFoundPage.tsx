import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, TrendingUp } from 'lucide-react';
import { VideoCard } from '../components/VideoCard';
import { videos } from '../data/videos';

import { SEO } from '../components/SEO';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO component handles title
  }, []);

  // Get 4 random videos
  const suggestedVideos = [...videos].sort(() => 0.5 - Math.random()).slice(0, 4);

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-12 px-4 min-h-[70vh]">
      <SEO title="Page Non Trouvée" />
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* 404 Visual */}
        <div className="relative inline-block">
          <motion.h1 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: 'spring', 
              stiffness: 100,
              damping: 10
            }}
            className="text-[150px] md:text-[220px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-orange-700 drop-shadow-[0_20px_50px_rgba(242,125,38,0.3)] select-none"
          >
            404
          </motion.h1>
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 15, -15, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl md:text-8xl absolute -bottom-2 -right-2 md:-bottom-6 md:-right-6 drop-shadow-xl"
          >
            😏
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-black text-main uppercase tracking-tighter"
          >
            Oups ! Cette page n'existe pas
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted font-medium max-w-md mx-auto"
          >
            La page que vous cherchez a peut-être été déplacée ou supprimée. 
            Mais ne vous inquiétez pas, il y a plein d'autres choses à voir !
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link 
            to="/" 
            className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-2 group"
          >
            <Home size={20} className="group-hover:-translate-y-0.5 transition-transform" />
            Retour à l'accueil
          </Link>
          <Link 
            to="/populaires" 
            className="w-full sm:w-auto border-2 border-muted/20 text-main px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-surface transition-all flex items-center justify-center gap-2 group"
          >
            <TrendingUp size={20} className="group-hover:scale-110 transition-transform" />
            Vidéos populaires
          </Link>
        </motion.div>

        {/* Suggested Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="pt-16 space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="h-px flex-grow bg-muted/20" />
            <h3 className="text-sm font-black text-muted uppercase tracking-widest whitespace-nowrap">
              Peut-être que ceci vous intéressera :
            </h3>
            <div className="h-px flex-grow bg-muted/20" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
