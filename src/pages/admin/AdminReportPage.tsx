import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Eye, 
  Trash2, 
  Slash, 
  User, 
  Mail, 
  Calendar, 
  ExternalLink, 
  X, 
  Check, 
  RotateCcw, 
  MessageSquare,
  ShieldAlert,
  FileText,
  History,
  Send,
  Save,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminReports as initialReports, AdminReport } from '../../data/admin-reports';
import { AdminPagination } from '../../components/admin/AdminPagination';

export const AdminReportPage: React.FC = () => {
  const [reports, setReports] = useState<AdminReport[]>(initialReports);
  const [statusFilter, setStatusFilter] = useState('en_attente');
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [noteText, setNoteText] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const stats = useMemo(() => ({
    pending: reports.filter(r => r.statut === 'en_attente').length,
    inProgress: reports.filter(r => r.statut === 'en_cours').length,
    treatedMonth: 24, // Mocked stat
  }), [reports]);

  const filteredReports = useMemo(() => {
    if (statusFilter === 'Tous') return reports;
    return reports.filter(r => r.statut === statusFilter);
  }, [reports, statusFilter]);

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, currentPage, pageSize]);

  const handleStatusChange = (id: string, newStatus: AdminReport['statut']) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, statut: newStatus } : r));
    showToast(`Signalement marqué comme ${newStatus.replace('_', ' ')}`);
    if (selectedReport?.id === id) {
      setSelectedReport(prev => prev ? { ...prev, statut: newStatus } : null);
    }
  };

  const getTypeBadge = (type: AdminReport['type']) => {
    switch (type) {
      case 'dmca': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest border border-red-500/20"><ShieldAlert size={10} /> DMCA</span>;
      case 'contenu_illegal': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 text-[8px] font-black uppercase tracking-widest border border-orange-500/20"><AlertTriangle size={10} /> Contenu illégal</span>;
      case 'spam': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase tracking-widest border border-yellow-500/20"><MessageSquare size={10} /> Spam</span>;
      default: return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/10 text-muted text-[8px] font-black uppercase tracking-widest border border-muted/20"><Info size={10} /> Autre</span>;
    }
  };

  const getPriorityBadge = (priority: AdminReport['priority']) => {
    switch (priority) {
      case 'Haute': return <span className="text-red-500 font-black">Haute</span>;
      case 'Moyenne': return <span className="text-orange-500 font-black">Moyenne</span>;
      default: return <span className="text-muted font-black">Basse</span>;
    }
  };

  const getStatusBadge = (status: AdminReport['statut']) => {
    switch (status) {
      case 'en_attente': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest">En attente</span>;
      case 'en_cours': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest">En cours</span>;
      case 'traité': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">Traité</span>;
      case 'rejeté': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest">Rejeté</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-main uppercase tracking-tighter mb-1">Signalements & DMCA</h1>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted">
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> {stats.pending} en attente</span>
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {stats.inProgress} en cours</span>
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {stats.treatedMonth} traités ce mois</span>
            </div>
          </div>
          {stats.pending > 5 && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
              <AlertTriangle size={12} /> Alerte : Charge élevée
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface p-1 rounded-2xl border border-muted/10 overflow-x-auto no-scrollbar">
        {[
          { id: 'en_attente', label: 'En attente', count: stats.pending },
          { id: 'en_cours', label: 'En cours', count: stats.inProgress },
          { id: 'traité', label: 'Traités' },
          { id: 'rejeté', label: 'Rejetés' },
          { id: 'Tous', label: 'Tous' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`relative px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
              statusFilter === tab.id 
                ? 'bg-background text-primary shadow-lg shadow-black/20' 
                : 'text-muted hover:text-main'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${
                tab.id === 'en_attente' ? 'bg-yellow-500 text-white' : 'bg-orange-500 text-white'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table Area */}
      <div className="bg-surface rounded-3xl border border-muted/10 overflow-hidden shadow-xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background/50 text-[10px] font-black uppercase tracking-widest text-muted border-b border-muted/10">
                <th className="px-6 py-4 w-12">#</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Contenu signalé</th>
                <th className="px-6 py-4">Signalé par</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Priorité</th>
                <th className="px-6 py-4">Assigné à</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/5">
              {paginatedReports.map((report, idx) => (
                <tr key={report.id} className="hover:bg-background/30 transition-colors group">
                  <td className="px-6 py-4 text-xs font-bold text-muted">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="px-6 py-4">{getTypeBadge(report.type)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {report.contentType === 'vidéo' && report.contentThumbnail && (
                        <div className="w-12 h-8 rounded bg-background overflow-hidden border border-muted/10 shrink-0">
                          <img src={report.contentThumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-black text-main truncate max-w-[150px]">{report.contentTitle}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{report.contentType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-main truncate max-w-[120px]">{report.reporterName}</p>
                      <p className="text-[10px] font-bold text-muted truncate max-w-[120px]">{report.reporterEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-muted whitespace-nowrap">{report.date}</td>
                  <td className="px-6 py-4">{getStatusBadge(report.statut)}</td>
                  <td className="px-6 py-4 text-[10px] uppercase tracking-widest">{getPriorityBadge(report.priority)}</td>
                  <td className="px-6 py-4 text-xs font-bold text-muted">{report.assignedTo || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => setSelectedReport(report)}
                        className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        title="Voir le détail"
                      >
                        <Eye size={16} />
                      </button>
                      <div className="relative group/menu">
                        <button className="p-2 text-muted hover:text-main hover:bg-muted/10 rounded-lg transition-all">
                          <MoreVertical size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-muted/20 rounded-xl shadow-2xl z-50 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all">
                          <div className="p-2 space-y-1">
                            <button onClick={() => handleStatusChange(report.id, 'traité')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted hover:text-emerald-500 hover:bg-emerald-500/5 transition-all">
                              <Check size={14} /> Marquer traité
                            </button>
                            <button onClick={() => handleStatusChange(report.id, 'en_cours')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted hover:text-orange-500 hover:bg-orange-500/5 transition-all">
                              <RotateCcw size={14} /> Mettre en cours
                            </button>
                            <button onClick={() => handleStatusChange(report.id, 'rejeté')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted hover:text-red-500 hover:bg-red-500/5 transition-all">
                              <X size={14} /> Rejeter
                            </button>
                            <div className="h-px bg-muted/10 my-1" />
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all">
                              <Trash2 size={14} /> Supprimer contenu
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all">
                              <Slash size={14} /> Bannir proprio
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminPagination 
          currentPage={currentPage}
          totalPages={Math.ceil(filteredReports.length / pageSize)}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={filteredReports.length}
        />
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedReport && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[500px] bg-surface border-l border-muted/20 z-[110] flex flex-col"
            >
              <div className="p-6 border-b border-muted/10 flex items-center justify-between bg-background/50">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-black uppercase tracking-widest text-main">Détail du signalement</h2>
                  {getTypeBadge(selectedReport.type)}
                </div>
                <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-muted/10 rounded-xl text-muted hover:text-main transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 no-scrollbar space-y-8">
                {/* Reporter Info */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                    <User size={12} /> Informations du signaleur
                  </h4>
                  <div className="bg-background p-4 rounded-2xl border border-muted/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted uppercase">Nom</span>
                      <span className="text-xs font-black text-main">{selectedReport.reporterName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted uppercase">Email</span>
                      <span className="text-xs font-black text-main flex items-center gap-1">
                        {selectedReport.reporterEmail} <ExternalLink size={10} className="text-primary" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted uppercase">Date</span>
                      <span className="text-xs font-black text-main">{selectedReport.date}</span>
                    </div>
                  </div>
                </div>

                {/* Content Info */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                    <FileText size={12} /> Contenu signalé
                  </h4>
                  <div className="bg-background p-4 rounded-2xl border border-muted/10">
                    <div className="flex items-start gap-4">
                      {selectedReport.contentType === 'vidéo' && selectedReport.contentThumbnail && (
                        <div className="w-24 aspect-video rounded-lg bg-surface overflow-hidden border border-muted/10 shrink-0">
                          <img src={selectedReport.contentThumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-black text-main mb-1">{selectedReport.contentTitle}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Type : {selectedReport.contentType}</p>
                        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
                          Voir le contenu <ExternalLink size={10} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-muted/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Description du problème</p>
                      <p className="text-xs font-bold text-main leading-relaxed bg-surface/50 p-3 rounded-xl">
                        {selectedReport.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DMCA Specific */}
                {selectedReport.type === 'dmca' && selectedReport.dmcaDetails && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                      <ShieldAlert size={12} /> Détails DMCA
                    </h4>
                    <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl space-y-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">URL Originale</p>
                        <a href={selectedReport.dmcaDetails.originalUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-main hover:text-primary flex items-center gap-1 break-all">
                          {selectedReport.dmcaDetails.originalUrl} <ExternalLink size={10} />
                        </a>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">Déclaration sous serment</p>
                        <p className="text-xs font-bold text-main italic leading-relaxed">
                          "{selectedReport.dmcaDetails.statement}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                    <History size={12} /> Historique du traitement
                  </h4>
                  <div className="space-y-4 pl-2">
                    <div className="flex items-start gap-4 relative">
                      <div className="absolute top-2 left-[7px] bottom-[-20px] w-px bg-muted/20" />
                      <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-surface z-10" />
                      <div>
                        <p className="text-xs font-black text-main">Signalement reçu</p>
                        <p className="text-[10px] text-muted">{selectedReport.date}</p>
                      </div>
                    </div>
                    {selectedReport.assignedTo && (
                      <div className="flex items-start gap-4 relative">
                        <div className="absolute top-2 left-[7px] bottom-[-20px] w-px bg-muted/20" />
                        <div className="w-4 h-4 rounded-full bg-orange-500 border-4 border-surface z-10" />
                        <div>
                          <p className="text-xs font-black text-main">Assigné à {selectedReport.assignedTo}</p>
                          <p className="text-[10px] text-muted">09/03/2026 11:00</p>
                        </div>
                      </div>
                    )}
                    {selectedReport.statut === 'traité' && (
                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-surface z-10" />
                        <div>
                          <p className="text-xs font-black text-main">Marqué comme traité</p>
                          <p className="text-[10px] text-muted">À l'instant</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                    <Save size={12} /> Notes internes
                  </h4>
                  <div className="space-y-3">
                    <textarea 
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      placeholder="Ajouter une note pour l'équipe..."
                      className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all resize-none"
                      rows={3}
                    />
                    <button 
                      onClick={() => { if(noteText.trim()) { showToast('Note sauvegardée'); setNoteText(''); } }}
                      className="w-full py-2 rounded-xl bg-background border border-muted/10 text-[10px] font-black uppercase tracking-widest text-main hover:bg-muted/5 transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={14} /> Sauvegarder la note
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4 pt-4 border-t border-muted/10">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Actions rapides</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleStatusChange(selectedReport.id, 'traité')}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      <Check size={14} /> Traiter
                    </button>
                    <button 
                      onClick={() => handleStatusChange(selectedReport.id, 'rejeté')}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/10 text-muted text-[10px] font-black uppercase tracking-widest hover:bg-muted hover:text-white transition-all"
                    >
                      <X size={14} /> Rejeter
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={14} /> Supprimer
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-background border border-muted/10 text-main text-[10px] font-black uppercase tracking-widest hover:bg-muted/5 transition-all">
                      <Send size={14} /> Contacter
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed bottom-8 right-8 z-[300] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border ${
              toast.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-red-500 text-white border-red-400'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
