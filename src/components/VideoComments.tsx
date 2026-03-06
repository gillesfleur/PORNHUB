import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockComments, Comment } from '../data/comments';
import { AdBanner } from './AdBanner';

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, isReply = false }) => {
  return (
    <div className={`flex gap-3 sm:gap-4 ${isReply ? 'mt-4' : 'mt-6'}`}>
      <img 
        src={comment.avatar} 
        alt={comment.username} 
        className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover flex-shrink-0 border border-muted/10`}
        referrerPolicy="no-referrer"
      />
      <div className="flex-grow space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-black text-main hover:text-primary transition-colors cursor-pointer">
            {comment.username}
          </span>
          <span className="text-[11px] font-bold text-muted uppercase tracking-tighter">
            {comment.date}
          </span>
        </div>
        <p className="text-sm text-muted leading-relaxed break-words">
          {comment.text}
        </p>
        <div className="flex items-center gap-4 pt-1">
          <button className="flex items-center gap-1.5 text-muted hover:text-primary transition-colors text-xs font-black">
            <ThumbsUp size={14} />
            {comment.likes}
          </button>
          <button className="flex items-center gap-1.5 text-muted hover:text-red-500 transition-colors text-xs font-black">
            <ThumbsDown size={14} />
          </button>
          <button className="text-muted hover:text-main transition-colors text-xs font-black">
            Répondre
          </button>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="border-l-2 border-muted/10 pl-4 mt-2">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const VideoComments: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showAll, setShowAll] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const visibleComments = showAll ? mockComments : mockComments.slice(0, 5);
  const remainingCount = mockComments.length - 5;

  const handleCancel = () => {
    setCommentText('');
    setIsFocused(false);
  };

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-muted/10 pb-4">
        <h3 className="text-xl font-black text-main">
          Commentaires <span className="text-muted text-sm font-bold ml-1">(24)</span>
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-muted uppercase tracking-widest hidden sm:inline">Trier par :</span>
          <select className="bg-surface border border-muted/10 text-main text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary/50 transition-colors">
            <option>Plus récents</option>
            <option>Plus populaires</option>
            <option>Plus anciens</option>
          </select>
        </div>
      </div>

      {/* Comment Form */}
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-muted/20 flex-shrink-0 flex items-center justify-center text-muted border border-muted/10">
          < AnimatePresence mode="wait">
            <motion.div 
              key="user-avatar"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              U
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex-grow space-y-3">
          <textarea
            ref={textareaRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Ajouter un commentaire..."
            className={`w-full bg-surface/50 border border-muted/10 rounded-2xl px-4 py-3 text-sm text-main placeholder:text-muted focus:outline-none focus:border-primary/50 transition-all duration-300 resize-none ${
              isFocused ? 'h-32' : 'h-12'
            }`}
          />
          
          <AnimatePresence>
            {isFocused && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
                    Vous devez être <Link to="/login" className="text-primary hover:underline">connecté</Link> pour commenter
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCancel}
                      className="px-6 py-2 rounded-xl text-muted font-bold text-sm hover:bg-muted/10 transition-all"
                    >
                      Annuler
                    </button>
                    <button 
                      disabled={!commentText.trim()}
                      className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                      Publier
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-2">
        {visibleComments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <CommentItem comment={comment} />
            {index === 2 && (
              <div className="py-8">
                <AdBanner size="leaderboard" position="comments-middle" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Show More Button */}
      {!showAll && remainingCount > 0 && (
        <button 
          onClick={() => setShowAll(true)}
          className="w-full py-4 mt-4 bg-surface/30 border border-muted/10 rounded-2xl text-main font-black text-sm hover:bg-muted/10 transition-all flex items-center justify-center gap-2 group"
        >
          < ChevronDown size={18} className="text-primary group-hover:translate-y-0.5 transition-transform" />
          Voir les {remainingCount} commentaires restants
        </button>
      )}

      {showAll && (
        <button 
          onClick={() => setShowAll(false)}
          className="w-full py-4 mt-4 bg-surface/30 border border-muted/10 rounded-2xl text-main font-black text-sm hover:bg-muted/10 transition-all flex items-center justify-center gap-2 group"
        >
          < ChevronUp size={18} className="text-primary group-hover:-translate-y-0.5 transition-transform" />
          Réduire les commentaires
        </button>
      )}
    </div>
  );
};
