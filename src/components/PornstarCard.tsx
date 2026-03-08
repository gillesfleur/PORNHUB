import React from 'react';
import { Link } from 'react-router-dom';
import { Actor } from '../types';
import { motion } from 'motion/react';

interface PornstarCardProps {
  actor: Actor;
  index: number;
}

const colors = [
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-fuchsia-500',
];

export const PornstarCard: React.FC<PornstarCardProps> = ({ actor, index }) => {
  const bgColor = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: (index % 6) * 0.05, duration: 0.3 }}
    >
      <Link 
        to={`/pornstar/${actor.slug}`}
        className="flex flex-col items-center group transition-all"
      >
        {/* Avatar Circle */}
        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${bgColor} flex items-center justify-center text-white text-2xl font-black border-4 border-transparent group-hover:border-primary transition-all shadow-lg mb-3 overflow-hidden`}>
          {/* Placeholder Initials or Icon */}
          <span className="drop-shadow-md uppercase">{actor.name.charAt(0)}</span>
        </div>
        
        {/* Name */}
        <span className="text-sm font-bold text-main group-hover:text-primary transition-colors text-center line-clamp-1">
          {actor.name}
        </span>
        
        {/* Video Count */}
        <span className="text-[10px] text-muted font-medium">
          {actor.videoCount} vidéos
        </span>
      </Link>
    </motion.div>
  );
};
