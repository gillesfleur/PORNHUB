import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Edit2, Trash2, Plus, Clock, ListMusic, Lock, Globe, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { UserSidebar } from '../components/UserSidebar';
import { Breadcrumb } from '../components/Breadcrumb';
import { VideoCard } from '../components/VideoCard';
import { AdBanner } from '../components/AdBanner';
import { playlists } from '../data/playlists';
import { videos } from '../data/videos';
import { Playlist, Video } from '../types';

import { SEO } from '../components/SEO';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlistVideos, setPlaylistVideos] = useState<Video[]>([]);

  useEffect(() => {
    const found = playlists.find(p => p.id === id);
    if (found) {
      setPlaylist(found);
      // Mock 8 videos for the playlist
      const shuffled = [...videos].sort(() => 0.5 - Math.random());
      setPlaylistVideos(shuffled.slice(0, 8));
      // SEO component handles title
    } else {
      navigate('/playlists');
    }
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (!playlist) return null;

  const totalDuration = "1h 42m"; // Mock total duration

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO title={playlist.name} description={`Découvrez la playlist ${playlist.name} sur VibeTube.`} />
      <Breadcrumb items={[
        { label: 'Mon profil', path: '/profile' },
        { label: 'Mes playlists', path: '/playlists' },
        { label: playlist.name, path: `/playlist/${id}` }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <UserSidebar />
          <AdBanner size="rectangle" position="playlist-detail-sidebar" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Header Section */}
          <div className="bg-surface rounded-3xl p-8 border border-muted/20 shadow-xl shadow-black/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <ListMusic size={120} />
            </div>

            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="w-full md:w-64 aspect-video bg-muted rounded-2xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-2 grid-rows-2 h-full">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/pl${id}-${i}/160/90`}
                      alt=""
                      className="w-full h-full object-cover border-[0.5px] border-black/10"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              </div>

              <div className="flex-grow space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                    {playlist.isPrivate ? <Lock size={14} /> : <Globe size={14} />}
                    {playlist.isPrivate ? 'Playlist Privée' : 'Playlist Publique'}
                  </div>
                  <h1 className="text-3xl font-black text-main tracking-tighter">{playlist.name}</h1>
                  {playlist.description && (
                    <p className="text-sm text-muted font-medium max-w-2xl">{playlist.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-muted">
                  <div className="flex items-center gap-2">
                    <ListMusic size={18} className="text-primary" />
                    {playlistVideos.length} vidéos
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-primary" />
                    {totalDuration}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all">
                    <Play size={18} className="fill-white" />
                    Lire tout
                  </button>
                  <button className="flex items-center gap-2 bg-background border border-muted/20 text-main px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-surface transition-all">
                    <Edit2 size={18} />
                    Modifier
                  </button>
                  <button className="flex items-center gap-2 bg-red-500/10 text-red-500 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={18} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-main uppercase tracking-tighter">Vidéos</h2>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-orange-600 transition-colors">
                <Plus size={16} />
                Ajouter des vidéos
              </button>
            </div>

            <div className="space-y-2">
              {playlistVideos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  variant="horizontal"
                  index={index}
                  showDragHandle={true}
                  onRemove={(id) => setPlaylistVideos(prev => prev.filter(v => v.id !== id))}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
