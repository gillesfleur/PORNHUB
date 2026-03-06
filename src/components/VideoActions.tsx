import React, { useState, useRef, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  Plus, 
  Share2, 
  Flag, 
  MoreHorizontal,
  Check,
  Link as LinkIcon,
  Twitter,
  Mail,
  X,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoActionsProps {
  initialLikes: string;
}

export const VideoActions: React.FC<VideoActionsProps> = ({ initialLikes }) => {
  // State for Rating
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(parseInt(initialLikes.replace('K', '000')) || 4200);
  const [dislikesCount, setDislikesCount] = useState(182);

  // State for Actions
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Refs for closing dropdowns on outside click
  const playlistRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playlistRef.current && !playlistRef.current.contains(event.target as Node)) {
        setShowPlaylistDropdown(false);
      }
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShowShareDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
      if (disliked) {
        setDisliked(false);
        setDislikesCount(prev => prev - 1);
      }
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      setDislikesCount(prev => prev - 1);
    } else {
      setDisliked(true);
      setDislikesCount(prev => prev + 1);
      if (liked) {
        setLiked(false);
        setLikesCount(prev => prev - 1);
      }
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  const totalVotes = likesCount + dislikesCount;
  const likeRatio = (likesCount / totalVotes) * 100;

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReportModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="py-6 space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Group 1: Rating */}
        <div className="flex items-center bg-surface/40 rounded-xl p-1 border border-muted/10">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold text-sm ${
              liked ? 'text-green-500 bg-green-500/10' : 'text-main hover:bg-muted/10'
            }`}
          >
            <ThumbsUp size={18} fill={liked ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">Like</span>
            <span className="text-xs opacity-70">{formatCount(likesCount)}</span>
          </button>
          
          <div className="w-px h-6 bg-muted/20 mx-1" />
          
          <button 
            onClick={handleDislike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold text-sm ${
              disliked ? 'text-red-500 bg-red-500/10' : 'text-main hover:bg-muted/10'
            }`}
          >
            <ThumbsDown size={18} fill={disliked ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">Dislike</span>
            <span className="text-xs opacity-70">{formatCount(dislikesCount)}</span>
          </button>
        </div>

        {/* Group 2: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-muted/10 font-bold text-sm transition-all ${
              isFavorite ? 'text-red-500 bg-red-500/5 border-red-500/20' : 'text-main hover:bg-muted/10'
            }`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">Favoris</span>
          </button>

          <div className="relative" ref={playlistRef}>
            <button 
              onClick={() => setShowPlaylistDropdown(!showPlaylistDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-muted/10 text-main font-bold text-sm hover:bg-muted/10 transition-all"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Playlist</span>
            </button>
            
            <AnimatePresence>
              {showPlaylistDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 left-0 w-56 bg-surface border border-muted/20 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden"
                >
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted px-3 py-2">Ajouter à...</div>
                  {['Mes Préférées', 'À regarder plus tard', 'Soirée entre amis'].map(playlist => (
                    <button key={playlist} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-sm font-bold text-main">
                      {playlist}
                      <div className="w-4 h-4 border-2 border-muted/30 rounded" />
                    </button>
                  ))}
                  <div className="h-px bg-muted/10 my-1" />
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-sm font-bold text-main">
                    <Plus size={16} />
                    Créer une playlist
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={shareRef}>
            <button 
              onClick={() => setShowShareDropdown(!showShareDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-muted/10 text-main font-bold text-sm hover:bg-muted/10 transition-all"
            >
              <Share2 size={18} />
              <span className="hidden sm:inline">Partager</span>
            </button>

            <AnimatePresence>
              {showShareDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 left-0 w-48 bg-surface border border-muted/20 rounded-2xl shadow-2xl z-50 p-2"
                >
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-sm font-bold text-main">
                    <LinkIcon size={16} />
                    Copier le lien
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-sm font-bold text-main">
                    <Twitter size={16} />
                    Twitter
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-sm font-bold text-main">
                    <MoreHorizontal size={16} />
                    Reddit
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-sm font-bold text-main">
                    <Mail size={16} />
                    Email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-muted/10 text-muted hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20 font-bold text-sm transition-all"
          >
            <Flag size={18} />
            <span className="hidden sm:inline">Signaler</span>
          </button>
        </div>
      </div>

      {/* Ratio Bar */}
      <div className="w-full max-w-xs space-y-1">
        <div className="h-1 w-full bg-red-500 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-green-500 transition-all duration-500" 
            style={{ width: `${likeRatio}%` }} 
          />
        </div>
        <div className="flex justify-between text-[10px] font-black text-muted uppercase tracking-tighter">
          <span>{Math.round(likeRatio)}% Apprécient</span>
          <span>{totalVotes} Votes</span>
        </div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface w-full max-w-md rounded-3xl border border-muted/20 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="text-xl font-black text-main">Signaler la vidéo</h3>
                </div>
                <button onClick={() => setShowReportModal(false)} className="text-muted hover:text-main transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleReport} className="p-6 space-y-6">
                <p className="text-muted text-sm font-medium">Pourquoi souhaitez-vous signaler ce contenu ?</p>
                
                <div className="space-y-3">
                  {['Contenu illégal', 'Spam ou tromperie', 'Autre'].map(option => (
                    <label key={option} className="flex items-center gap-3 p-4 rounded-2xl border border-muted/10 hover:border-primary/30 cursor-pointer transition-all group">
                      <input 
                        type="radio" 
                        name="report" 
                        className="w-5 h-5 accent-primary" 
                        required 
                        onChange={() => setReportReason(option)}
                      />
                      <span className="text-main font-bold group-hover:text-primary transition-colors">{option}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 px-6 py-3 rounded-2xl border border-muted/20 text-main font-bold hover:bg-muted/10 transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-orange-600 transition-all shadow-lg shadow-primary/20"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
          >
            <Check size={20} />
            Signalement envoyé avec succès
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
