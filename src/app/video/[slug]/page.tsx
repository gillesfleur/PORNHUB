'use client';

import { useState, useEffect, use } from 'react';
import { api } from '@/lib/api-client';
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard';
import AdBanner from '@/components/ads/AdBanner';
import { useAuth } from '@/contexts/AuthContext';

interface VideoDetailProps {
  params: Promise<{ slug: string }>;
}

export default function VideoDetailPage({ params }: VideoDetailProps) {
  const { slug } = use(params);
  const [video, setVideo] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États d'interaction
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [hasVoted, setHasVoted] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchVideo() {
      setLoading(true);
      try {
        const [videoRes, relatedRes, commentsRes] = await Promise.all([
          api.getVideo(slug),
          api.getRelatedVideos(slug),
          api.getComments(slug)
        ]);

        if (videoRes.success) {
          setVideo(videoRes.data);
          setLikes(videoRes.data.likes);
          setDislikes(videoRes.data.dislikes);
          setHasVoted(videoRes.data.hasVoted);
          setIsFavorite(videoRes.data.isFavorite);
          // Enregistrer l'historique
          api.recordHistory(slug).catch(() => {});
        }
        setRelated(relatedRes.data || []);
        setComments(commentsRes.data?.comments || commentsRes.data || []);
      } catch (err) {
        console.error('[VIDEO_FETCH_ERROR]', err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
  }, [slug]);

  const handleVote = async (type: 'LIKE' | 'DISLIKE') => {
    if (!isAuthenticated) return window.alert('Connectez-vous pour voter !');
    if (isActionLoading) return;

    setIsActionLoading(true);
    try {
      const res = await api.voteVideo(slug, type.toLowerCase() as any);
      if (res.success && res.data) {
        setLikes(res.data.likes);
        setDislikes(res.data.dislikes);
        setHasVoted(res.data.userVote);
      }
    } catch (err) {
      console.error('[VOTE_ERROR]', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) return window.alert('Connectez-vous pour ajouter aux favoris !');
    if (isActionLoading) return;

    setIsActionLoading(true);
    try {
      const res = await api.toggleFavorite(slug);
      if (res.success) {
        setIsFavorite(res.data.isFavorite);
      }
    } catch (err) {
      console.error('[FAVORITE_ERROR]', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="aspect-video bg-zinc-900 rounded-2xl w-full mb-8" />
        <div className="h-8 bg-zinc-900 w-1/2 mb-4" />
        <div className="h-4 bg-zinc-900 w-1/4 mb-8" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-black mb-4">Vidéo Introuvable</h2>
        <p className="text-zinc-500">Cette vidéo a peut-être été supprimée ou n'existe pas.</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE: PLAYER + INFOS */}
        <div className="lg:col-span-2 space-y-6">
          {/* REAL IFRAME PLAYER */}
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
            <iframe 
              src={video.embedUrl} 
              width="100%" 
              height="100%" 
              allowFullScreen 
              frameBorder="0"
              scrolling="no"
              title={video.title}
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-tight">
              {video.title}
            </h1>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-zinc-900">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-orange-500 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" /></svg>
                       {video.likes}
                    </button>
                    <button className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-red-500 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.37-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" /></svg>
                       {video.dislikes}
                    </button>
                 </div>
                 <div className="h-6 w-px bg-zinc-800" />
                 <button className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-orange-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    Favoris
                 </button>
              </div>
              <div className="text-zinc-500 text-xs font-bold uppercase">
                {video.viewsInternal.toLocaleString()} Vues • {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : 'Date inconnue'}
              </div>
            </div>

            {/* Description / Tags */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900">
               <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                 {video.description || "Aucune description fournie pour cette vidéo."}
               </p>
               <div className="flex flex-wrap gap-2">
                  {video.tags?.map((t: any) => (
                    <span key={t.tag.id} className="text-[10px] font-black uppercase text-zinc-500 hover:text-orange-500 cursor-pointer bg-zinc-900 px-2 py-1 rounded transition-colors">
                      #{t.tag.name}
                    </span>
                  ))}
               </div>
            </div>

            {/* Section Commentaires */}
            <div className="pt-8">
              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                Commentaires <span className="text-zinc-600 text-sm">({comments.length})</span>
              </h3>
              
              {!isAuthenticated && (
                <div className="bg-orange-600/10 border border-orange-500/20 p-6 rounded-2xl text-center mb-8">
                  <p className="text-sm font-bold mb-4">Connectez-vous pour rejoindre la discussion !</p>
                  <a href="/login" className="bg-orange-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase">Connexion</a>
                </div>
              )}

              <div className="space-y-8">
                {comments.length === 0 ? (
                  <p className="text-zinc-600 text-sm italic">Sois le premier à donner ton avis !</p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{c.user.username}</span>
                          <span className="text-[10px] text-zinc-600">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-zinc-400">{c.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE: SUGGESTIONS + PUBS */}
        <div className="space-y-8">
          <AdBanner position="video_sidebar" />

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-600" />
              Vidéos suggérées
            </h3>
            <div className="space-y-6">
              {related.map(r => (
                <VideoCard key={r.id} video={r} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
