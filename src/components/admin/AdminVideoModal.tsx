import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { categories } from '../../data/categories';
import { actors } from '../../data/actors';

interface AdminVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (video: any) => void;
  video?: any; // If provided, we are editing
}

export const AdminVideoModal: React.FC<AdminVideoModalProps> = ({ isOpen, onClose, onSave, video }) => {
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    category: video?.category || categories[0].name,
    tags: video?.tags || [],
    actor: video?.actor || actors[0].name,
    duration: video?.duration || '00:00',
    quality: video?.quality || 'Full HD',
    url: video?.url || '',
    status: video?.status || 'Publiée',
    isFeatured: video?.isFeatured || false,
    thumbnail: video?.thumbnail || ''
  });

  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-surface border border-muted/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-muted/10 flex items-center justify-between bg-background/50">
            <h2 className="text-xl font-black text-main uppercase tracking-tighter">
              {video ? 'Modifier la vidéo' : 'Ajouter une vidéo manuellement'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-muted/10 rounded-xl text-muted hover:text-main transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 no-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Titre de la vidéo</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Lana Rhoades - Best of 2024"
                    className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Description</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Décrivez le contenu de la vidéo..."
                    className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Catégorie</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none"
                    >
                      {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Acteur / Actrice</label>
                    <select 
                      value={formData.actor}
                      onChange={e => setFormData({...formData, actor: e.target.value})}
                      className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none"
                    >
                      {actors.map(actor => <option key={actor.id} value={actor.name}>{actor.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Tags (Appuyez sur Entrée)</label>
                  <div className="min-h-[48px] bg-background border border-muted/20 rounded-xl p-2 flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={12} /></button>
                      </span>
                    ))}
                    <input 
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="flex-grow bg-transparent border-none outline-none text-sm font-bold text-main min-w-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Miniature (Thumbnail)</label>
                  <div className="aspect-video w-full bg-background border-2 border-dashed border-muted/20 rounded-2xl flex flex-col items-center justify-center gap-3 group hover:border-primary/50 transition-all cursor-pointer overflow-hidden relative">
                    {formData.thumbnail ? (
                      <img src={formData.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="p-4 rounded-full bg-muted/5 group-hover:bg-primary/10 transition-colors">
                          <Upload size={32} className="text-muted group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-xs font-bold text-muted group-hover:text-main">Glissez une image ici ou cliquez pour sélectionner</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Durée</label>
                    <input 
                      type="text" 
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value})}
                      placeholder="MM:SS"
                      className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Qualité</label>
                    <select 
                      value={formData.quality}
                      onChange={e => setFormData({...formData, quality: e.target.value})}
                      className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none"
                    >
                      <option value="SD">SD</option>
                      <option value="HD">HD</option>
                      <option value="Full HD">Full HD</option>
                      <option value="4K">4K</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">URL Source (Fictif)</label>
                  <input 
                    type="url" 
                    value={formData.url}
                    onChange={e => setFormData({...formData, url: e.target.value})}
                    placeholder="https://api.partner.com/v1/stream/..."
                    className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Statut</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none"
                    >
                      <option value="Publiée">Publiée</option>
                      <option value="En attente">En attente</option>
                      <option value="Brouillon">Brouillon</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                      className={`w-12 h-6 rounded-full transition-all relative ${formData.isFeatured ? 'bg-primary' : 'bg-muted/20'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isFeatured ? 'left-7' : 'left-1'}`} />
                    </button>
                    <span className="text-xs font-bold text-main">Mettre en avant</span>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-muted/10 bg-background/50 flex items-center justify-end gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-muted hover:text-main hover:bg-muted/10 transition-all"
            >
              Annuler
            </button>
            <button 
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest bg-primary text-white hover:bg-orange-600 shadow-lg shadow-primary/20 transition-all"
            >
              Sauvegarder
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
