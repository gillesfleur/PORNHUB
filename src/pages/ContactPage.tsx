import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { 
  Mail, Shield, HelpCircle, Clock, 
  ChevronDown, Send, Loader2, CheckCircle, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

import { SEO } from '../components/SEO';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Question générale',
    message: '',
    acceptPrivacy: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO component handles title
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est obligatoire';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (formData.message.length < 20) {
      newErrors.message = 'Le message doit faire au moins 20 caractères';
    }
    if (!formData.acceptPrivacy) {
      newErrors.privacy = 'Vous devez accepter la politique de confidentialité';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowToast(true);
    setFormData({
      name: '',
      email: '',
      subject: 'Question générale',
      message: '',
      acceptPrivacy: false
    });
    
    setTimeout(() => setShowToast(false), 3000);
  };

  const faqs: FAQItem[] = [
    {
      question: "Comment supprimer une vidéo ?",
      answer: (
        <span>
          Si vous êtes l'ayant droit d'un contenu indexé sur notre plateforme et que vous souhaitez son retrait, 
          veuillez soumettre une demande formelle via notre page <Link to="/dmca" className="text-primary hover:underline font-bold">DMCA / Signalement</Link>. 
          Nous traitons les demandes de retrait sous 24h à 48h.
        </span>
      )
    },
    {
      question: "Comment devenir partenaire ?",
      answer: "Nous collaborons avec de nombreux studios et créateurs indépendants. Pour devenir partenaire officiel, sélectionnez 'Partenariat / Publicité' dans le sujet du formulaire et présentez-nous brièvement votre activité. Notre équipe commerciale vous recontactera avec nos différentes offres de visibilité."
    },
    {
      question: "Problème de lecture vidéo ?",
      answer: "La plupart des problèmes de lecture sont liés au cache du navigateur ou à des extensions tierces (bloqueurs de publicité). Nous vous recommandons de vider votre cache, de mettre à jour votre navigateur ou d'essayer en mode navigation privée. Si le problème persiste sur une vidéo spécifique, signalez-la via le bouton 'Signaler' sous le lecteur."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO title="Contact" description="Contactez l'équipe de VibeTube pour toute question ou suggestion." />
      <div className="max-w-5xl mx-auto">
        <Breadcrumb items={[{ label: 'Contact', path: '/contact' }]} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black text-main tracking-tighter uppercase">Contactez-nous</h1>
            <p className="text-muted font-medium max-w-xl mx-auto">
              Une question sur notre service ? Un problème technique ? 
              Notre équipe est là pour vous aider.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Form */}
            <div className="bg-surface p-8 rounded-3xl border border-muted/20 shadow-xl shadow-black/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted flex justify-between">
                    Nom complet
                    {errors.name && <span className="text-red-500 normal-case tracking-normal font-bold">{errors.name}</span>}
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full bg-background border rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all ${errors.name ? 'border-red-500/50' : 'border-muted/20'}`}
                    placeholder="Votre nom"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted flex justify-between">
                    Email
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

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted">Sujet</label>
                  <div className="relative">
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-background border border-muted/20 rounded-2xl px-4 py-3 text-sm font-bold text-main appearance-none focus:outline-none focus:border-primary transition-all"
                    >
                      <option>Question générale</option>
                      <option>Problème technique</option>
                      <option>Signalement de contenu (DMCA)</option>
                      <option>Partenariat / Publicité</option>
                      <option>Autre</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted flex justify-between">
                    Message
                    {errors.message && <span className="text-red-500 normal-case tracking-normal font-bold">{errors.message}</span>}
                  </label>
                  <textarea 
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full bg-background border rounded-2xl px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary transition-all resize-none ${errors.message ? 'border-red-500/50' : 'border-muted/20'}`}
                    placeholder="Comment pouvons-nous vous aider ? (min. 20 caractères)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center mt-1">
                      <input 
                        type="checkbox" 
                        checked={formData.acceptPrivacy}
                        onChange={(e) => setFormData({ ...formData, acceptPrivacy: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className={`w-5 h-5 border-2 rounded transition-all ${formData.acceptPrivacy ? 'bg-primary border-primary' : 'border-muted/30 group-hover:border-primary/50'}`} />
                      <CheckCircle size={14} className={`absolute inset-0 m-auto text-white transition-opacity ${formData.acceptPrivacy ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                    <span className="text-xs font-medium text-muted leading-relaxed">
                      J'accepte la <Link to="/privacy" className="text-primary hover:underline">politique de confidentialité</Link> et j'autorise VibeTube à traiter mes données pour répondre à ma demande.
                    </span>
                  </label>
                  {errors.privacy && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.privacy}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column - Info & FAQ */}
            <div className="space-y-8">
              {/* Quick Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface p-6 rounded-3xl border border-muted/20 shadow-lg shadow-black/5 flex flex-col gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-main uppercase tracking-tight">Email direct</h3>
                    <p className="text-xs text-muted font-bold mt-1">contact@vibetube.com</p>
                  </div>
                </div>

                <div className="bg-surface p-6 rounded-3xl border border-muted/20 shadow-lg shadow-black/5 flex flex-col gap-3">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl w-fit">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-main uppercase tracking-tight">Temps de réponse</h3>
                    <p className="text-xs text-muted font-bold mt-1">Généralement sous 48h</p>
                  </div>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <HelpCircle size={20} className="text-primary" />
                  <h2 className="text-lg font-black text-main uppercase tracking-tighter">FAQ Rapide</h2>
                </div>
                
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div 
                      key={index}
                      className="bg-surface rounded-2xl border border-muted/10 overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-background/50 transition-colors"
                      >
                        <span className="text-sm font-black text-main uppercase tracking-tight">{faq.question}</span>
                        <ChevronDown 
                          size={18} 
                          className={`text-muted transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      <AnimatePresence>
                        {openFaqIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="p-4 pt-0 text-xs text-muted font-medium leading-relaxed border-t border-muted/5">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* DMCA Warning */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 flex gap-4 items-start">
                <Shield className="text-red-500 shrink-0 mt-1" size={24} />
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-red-500 uppercase">Signalement DMCA</h3>
                  <p className="text-xs text-muted font-medium leading-relaxed">
                    Pour toute demande de retrait de contenu protégé par le droit d'auteur, merci d'utiliser exclusivement notre adresse dédiée : <span className="font-bold text-red-500">dmca@vibetube.com</span> ou notre formulaire dédié.
                  </p>
                </div>
              </div>
            </div>
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
            className="fixed bottom-8 right-8 z-[110] bg-surface border border-green-500/20 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3 min-w-[300px]"
          >
            <div className="bg-green-500/10 text-green-500 p-2 rounded-full">
              <CheckCircle size={20} />
            </div>
            <p className="text-sm font-bold text-main">Message envoyé avec succès !</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
