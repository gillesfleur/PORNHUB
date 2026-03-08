import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, AlertTriangle, CheckCircle, Send, Loader2, Info, FileText } from 'lucide-react';

import { SEO } from '../components/SEO';

export const DMCAPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    urlsToRemove: '',
    originalUrl: '',
    description: '',
    declaration: false,
    signature: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO component handles title
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Le nom complet est obligatoire';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.urlsToRemove.trim()) newErrors.urlsToRemove = 'Les URLs à retirer sont obligatoires';
    if (!formData.declaration) newErrors.declaration = 'Vous devez accepter la déclaration';
    if (!formData.signature.trim()) newErrors.signature = 'La signature électronique est obligatoire';
    if (formData.signature.trim().toLowerCase() !== formData.fullName.trim().toLowerCase()) {
        newErrors.signature = 'La signature doit correspondre exactement à votre nom complet';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowToast(true);
    setFormData({
      fullName: '',
      email: '',
      urlsToRemove: '',
      originalUrl: '',
      description: '',
      declaration: false,
      signature: ''
    });
    
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO title="DMCA & Signalement" description="Signalez un contenu protégé par le droit d'auteur ou une violation de nos conditions." />
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: 'DMCA', path: '/dmca' }]} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-12"
        >
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-main uppercase tracking-tighter leading-none">
              Politique DMCA — Signalement de contenu
            </h1>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>

          {/* Intro */}
          <div className="prose prose-invert max-w-none space-y-4">
            <p className="text-muted leading-relaxed font-medium">
              VibeTube respecte les droits de propriété intellectuelle d'autrui et s'attend à ce que ses utilisateurs fassent de même. Conformément au Digital Millennium Copyright Act (DMCA), nous répondrons rapidement aux notifications de violation présumée du droit d'auteur qui nous sont signalées.
            </p>
            <p className="text-muted leading-relaxed font-medium">
              En tant qu'agrégateur de contenus, VibeTube n'héberge pas les vidéos indexées sur ses serveurs. Cependant, nous nous engageons à retirer tout lien vers un contenu protégé dès réception d'une notification valide. Veuillez noter que toute fausse déclaration peut vous exposer à des poursuites judiciaires.
            </p>
          </div>

          {/* Steps */}
          <section className="bg-surface rounded-3xl p-8 border border-muted/20 shadow-xl shadow-black/5 space-y-8">
            <h2 className="text-xl font-black text-main uppercase tracking-tighter flex items-center gap-3">
              <Info size={24} className="text-primary" />
              Comment signaler un contenu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black text-lg">1</div>
                <h3 className="text-sm font-black text-main uppercase">Identification</h3>
                <p className="text-xs text-muted font-medium leading-relaxed">Identifiez précisément l'œuvre protégée par le droit d'auteur que vous estimez avoir été violée.</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black text-lg">2</div>
                <h3 className="text-sm font-black text-main uppercase">Localisation</h3>
                <p className="text-xs text-muted font-medium leading-relaxed">Fournissez les URLs exactes des pages de VibeTube contenant les liens vers le contenu à retirer.</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black text-lg">3</div>
                <h3 className="text-sm font-black text-main uppercase">Notification</h3>
                <p className="text-xs text-muted font-medium leading-relaxed">Remplissez le formulaire ci-dessous avec toutes les informations requises pour une prise en charge rapide.</p>
              </div>
            </div>
          </section>

          {/* Form */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-primary" />
              <h2 className="text-2xl font-black text-main uppercase tracking-tighter">Formulaire de signalement</h2>
            </div>

            <div className="bg-surface p-8 rounded-3xl border border-muted/20 shadow-xl shadow-black/5">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted flex justify-between">
                      Votre nom complet
                      {errors.fullName && <span className="text-red-500 normal-case tracking-normal font-bold">{errors.fullName}</span>}
                    </label>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full bg-background border rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all ${errors.fullName ? 'border-red-500/50' : 'border-muted/20'}`}
                      placeholder="Prénom et Nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted flex justify-between">
                      Votre email
                      {errors.email && <span className="text-red-500 normal-case tracking-normal font-bold">{errors.email}</span>}
                    </label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full bg-background border rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all ${errors.email ? 'border-red-500/50' : 'border-muted/20'}`}
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted flex justify-between">
                    URL(s) du contenu à retirer
                    {errors.urlsToRemove && <span className="text-red-500 normal-case tracking-normal font-bold">{errors.urlsToRemove}</span>}
                  </label>
                  <textarea 
                    rows={4}
                    value={formData.urlsToRemove}
                    onChange={(e) => setFormData({ ...formData, urlsToRemove: e.target.value })}
                    className={`w-full bg-background border rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all resize-none ${errors.urlsToRemove ? 'border-red-500/50' : 'border-muted/20'}`}
                    placeholder="https://vibetube.com/video/123..."
                  />
                  <p className="text-[10px] text-muted font-medium italic">Une URL par ligne.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted">URL du contenu original (preuve de propriété)</label>
                  <input 
                    type="text" 
                    value={formData.originalUrl}
                    onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                    className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all"
                    placeholder="https://votre-site.com/original-video..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted">Description détaillée de la réclamation</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all resize-none"
                    placeholder="Expliquez en quoi ce contenu viole vos droits..."
                  />
                </div>

                <div className="space-y-4 bg-background/50 p-6 rounded-2xl border border-muted/10">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center mt-1">
                      <input 
                        type="checkbox" 
                        checked={formData.declaration}
                        onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className={`w-5 h-5 border-2 rounded transition-all ${formData.declaration ? 'bg-primary border-primary' : 'border-muted/30 group-hover:border-primary/50'}`} />
                      <CheckCircle size={14} className={`absolute inset-0 m-auto text-white transition-opacity ${formData.declaration ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                    <span className="text-xs font-bold text-muted leading-relaxed">
                      Je déclare sous serment que les informations fournies sont exactes et que je suis le titulaire des droits ou autorisé à agir en son nom.
                    </span>
                  </label>
                  {errors.declaration && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.declaration}</p>}

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted flex justify-between">
                      Signature électronique
                      {errors.signature && <span className="text-red-500 normal-case tracking-normal font-bold">{errors.signature}</span>}
                    </label>
                    <input 
                      type="text" 
                      value={formData.signature}
                      onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                      className={`w-full bg-background border rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all ${errors.signature ? 'border-red-500/50' : 'border-muted/20'}`}
                      placeholder="Tapez votre nom complet comme signature"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Soumettre le signalement
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* Counter-notification */}
          <section className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} className="text-blue-500" />
              <h2 className="text-xl font-black text-main uppercase tracking-tighter">Contre-notification</h2>
            </div>
            <p className="text-sm text-muted font-medium leading-relaxed">
              Si vous estimez qu'un contenu que vous avez mis en ligne a été retiré par erreur ou suite à une mauvaise identification, vous pouvez nous envoyer une contre-notification. Pour être valide, celle-ci doit inclure votre identification complète, l'identification du contenu retiré, une déclaration sous peine de parjure que vous avez une croyance de bonne foi que le contenu a été retiré par erreur, et votre consentement à la juridiction des tribunaux compétents.
            </p>
          </section>

          <div className="pb-12 text-center">
            <p className="text-xs text-muted/60">
              Pour toute autre question, veuillez consulter nos <a href="/terms" className="text-primary hover:underline">Conditions Générales d'Utilisation</a>.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-8 right-8 z-[110] bg-surface border border-green-500/20 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3 min-w-[350px]"
          >
            <div className="bg-green-500/10 text-green-500 p-2 rounded-full">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-main uppercase tracking-tight">Signalement reçu</p>
              <p className="text-xs text-muted font-medium">Nous traiterons votre demande sous 48h.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
