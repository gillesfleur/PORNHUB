'use client';

import Link from 'next/link';
import { Quality } from '../../types/api';

interface VideoCardProps {
  video: {
    title: string;
    slug: string;
    thumbnailUrl: string;
    durationFormatted: string;
    viewsInternal: number;
    quality: Quality;
    publishedAt: string | Date;
  };
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/video/${video.slug}`} className="group block space-y-3">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-orange-500/50 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]">
        <img
          src={video.thumbnailUrl || '/placeholder-video.jpg'}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Durée */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm text-[10px] font-bold rounded text-white border border-white/10">
          {video.durationFormatted}
        </div>

        {/* Badge Qualité */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-orange-600 text-[10px] font-black italic rounded text-white shadow-lg">
          {video.quality}
        </div>

        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
           </div>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-sm text-zinc-100 line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">
          <span>{video.viewsInternal.toLocaleString()} Vues</span>
          <span className="w-1 h-1 bg-zinc-700 rounded-full" />
          <span>{new Date(video.publishedAt).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>
    </Link>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="aspect-video rounded-2xl bg-zinc-900" />
      <div className="space-y-2">
        <div className="h-4 bg-zinc-900 rounded w-full" />
        <div className="h-4 bg-zinc-900 rounded w-2/3" />
        <div className="h-3 bg-zinc-900 rounded w-1/3" />
      </div>
    </div>
  );
}
