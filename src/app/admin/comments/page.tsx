'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, perPage: 20 });

  async function loadComments() {
    try {
      setLoading(true);
      const res = await api.admin.getComments(params);
      if (res.success) {
        setComments(res.data?.comments || res.data || []);
      }
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await api.admin.updateCommentStatus(id, status);
      if (res.success) {
        setComments(comments.map(c => c.id === id ? { ...c, status } : c));
      }
    } catch (err) {
      alert('Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    try {
      const res = await api.deleteComment(id);
      if (res.success) {
        setComments(comments.filter(c => c.id !== id));
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-12">
      <div className="pb-10 border-b border-zinc-900/50">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Commentaires</h1>
        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] font-mono">UGC_MODERATION_HUB.V1</p>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[48px] overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="grid grid-cols-1 divide-y divide-zinc-800/40">
          {loading ? (
             Array(5).fill(0).map((i) => <div key={i} className="p-10 animate-pulse h-32 bg-zinc-900" />)
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="p-10 flex flex-col md:flex-row gap-8 group hover:bg-zinc-800/20 transition-all">
                <div className="w-14 h-14 rounded-[24px] bg-zinc-800 flex items-center justify-center font-black text-white shrink-0 shadow-2xl overflow-hidden border border-zinc-700/50">
                  {comment.user?.avatarUrl ? <img src={comment.user.avatarUrl} className="w-full h-full object-cover" /> : (comment.user?.username?.[0] || '?')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-black italic uppercase text-white tracking-tight">{comment.user?.username || 'Utilisateur inconnu'}</span>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleString()}</span>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${comment.status === 'PUBLISHED' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                      {comment.status || 'PUBLISHED'}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-3xl mb-4 italic">"{comment.content}"</p>
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">Vidéo: {comment.video?.title || 'Inconnue'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   {comment.status !== 'PUBLISHED' ? (
                     <button onClick={() => handleUpdateStatus(comment.id, 'PUBLISHED')} className="p-3 bg-green-600/10 text-green-500 rounded-xl border border-green-500/20 hover:bg-green-600 hover:text-white transition-all">✅</button>
                   ) : (
                     <button onClick={() => handleUpdateStatus(comment.id, 'SPAM')} className="p-3 bg-orange-600/10 text-orange-500 rounded-xl border border-orange-500/20 hover:bg-orange-600 hover:text-white transition-all">🚫</button>
                   )}
                   <button onClick={() => handleDelete(comment.id)} className="p-3 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">🗑️</button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-32 text-center text-zinc-700 font-black uppercase tracking-widest text-xs italic">
              Aucun commentaire trouvé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
