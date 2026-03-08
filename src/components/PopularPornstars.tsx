import React from 'react';
import { Actor } from '../types';
import { PornstarCard } from './PornstarCard';
import { ArrowRight } from 'lucide-react';

interface PopularPornstarsProps {
  actors: Actor[];
}

export const PopularPornstars: React.FC<PopularPornstarsProps> = ({ actors }) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-primary">⭐</span> Pornstars populaires
        </h2>
      </div>

      <div className="relative">
        {/* Left Shadow Indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity md:hidden" />
        
        {/* Right Shadow Indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none md:hidden" />

        {/* Mobile: Scroll Horizontal | Desktop: Grid 6 */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-6 gap-6 pb-4 md:pb-0 no-scrollbar snap-x touch-pan-x">
          {actors.map((actor, index) => (
            <div key={actor.id} className="min-w-[100px] snap-start">
              <PornstarCard actor={actor} index={index} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <a 
          href="/pornstars" 
          className="flex items-center gap-2 text-primary font-bold hover:underline transition-all group"
        >
          Voir tous les pornstars
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  );
};
