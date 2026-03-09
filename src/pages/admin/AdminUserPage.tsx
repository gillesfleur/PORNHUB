import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Pause, 
  Play, 
  Slash, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  MessageSquare,
  Heart,
  Shield,
  User as UserIcon,
  Mail,
  Calendar,
  Activity,
  ChevronRight,
  Send,
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminUsers as initialUsers, AdminUser } from '../../data/admin-users';
import { AdminPagination } from '../../components/admin/AdminPagination';

export const AdminUserPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [roleFilter, setRoleFilter] = useState('Tous');
  const [periodFilter, setPeriodFilter] = useState('Toutes');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<AdminUser | null>(null);
  const [isBannirModalOpen, setIsBannirModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToActOn, setUserToActOn] = useState<AdminUser | null>(null);
  const [banReason, setBanReason] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'Tous' || u.status === statusFilter;
      const matchesRole = roleFilter === 'Tous' || u.role === roleFilter.toLowerCase();
      // Period filter is simplified for mock
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uId => uId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleExport = () => {
    showToast('Export généré avec succès');
  };

  const handleStatusChange = (id: string, newStatus: AdminUser['status']) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    showToast(`Statut de l'utilisateur mis à jour : ${newStatus}`);
  };

  const handleBannir = () => {
    if (userToActOn && banReason.trim()) {
      handleStatusChange(userToActOn.id, 'Banni');
      setIsBannirModalOpen(false);
      setUserToActOn(null);
      setBanReason('');
    }
  };

  const handleDelete = () => {
    if (userToActOn && deleteConfirmText === 'SUPPRIMER') {
      setUsers(users.filter(u => u.id !== userToActOn.id));
      setIsDeleteModalOpen(false);
      setUserToActOn(null);
      setDeleteConfirmText('');
      showToast('Compte utilisateur supprimé');
    }
  };

  const handleBulkAction = (action: 'Suspendre' | 'Bannir' | 'Supprimer') => {
    if (window.confirm(`${action} les ${selectedUsers.length} utilisateurs sélectionnés ?`)) {
      if (action === 'Supprimer') {
        setUsers(users.filter(u => !selectedUsers.includes(u.id)));
      } else {
        const newStatus = action === 'Suspendre' ? 'Suspendu' : 'Banni';
        setUsers(users.map(u => selectedUsers.includes(u.id) ? { ...u, status: newStatus as any } : u));
      }
      setSelectedUsers([]);
      showToast(`${selectedUsers.length} utilisateurs : action ${action} effectuée`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-main uppercase tracking-tighter mb-1">Gestion des utilisateurs</h1>
          <p className="text-muted text-sm font-medium">8,432 utilisateurs inscrits</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-surface hover:bg-muted/10 text-main border border-muted/20 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all"
        >
          <Download size={18} />
          Exporter la liste
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface rounded-3xl border border-muted/10 p-4 lg:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text"
              placeholder="Rechercher par nom / email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-muted/20 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-muted/10 overflow-x-auto no-scrollbar">
            {['Tous', 'Actif', 'Suspendu', 'Banni'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  statusFilter === status 
                    ? 'bg-surface text-primary shadow-sm' 
                    : 'text-muted hover:text-main'
                }`}
              >
                {status === 'Tous' ? 'Tous' : status + 's'}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-muted/10 hidden lg:block" />

          {/* Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-background border border-muted/20 rounded-xl px-4 py-2 text-xs font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="Tous">Tous les rôles</option>
              <option value="User">Utilisateurs</option>
              <option value="Admin">Administrateurs</option>
            </select>

            <select 
              value={periodFilter}
              onChange={e => setPeriodFilter(e.target.value)}
              className="bg-background border border-muted/20 rounded-xl px-4 py-2 text-xs font-bold text-main focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="Toutes">Toutes les périodes</option>
              <option value="Aujourd'hui">Aujourd'hui</option>
              <option value="Cette semaine">Cette semaine</option>
              <option value="Ce mois">Ce mois</option>
            </select>

            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('Tous'); setRoleFilter('Tous'); setPeriodFilter('Toutes'); }}
              className="p-2 text-muted hover:text-primary transition-colors"
              title="Réinitialiser les filtres"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedUsers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-black uppercase tracking-widest">{selectedUsers.length} utilisateur(s) sélectionné(s)</span>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <button onClick={() => handleBulkAction('Suspendre')} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Suspendre</button>
                <button onClick={() => handleBulkAction('Bannir')} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Bannir</button>
                <button onClick={() => handleBulkAction('Supprimer')} className="px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Supprimer</button>
              </div>
            </div>
            <button onClick={() => setSelectedUsers([])} className="p-1 hover:bg-white/10 rounded-full transition-all">
              <XCircle size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Area */}
      <div className="bg-surface rounded-3xl border border-muted/10 overflow-hidden shadow-xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background/50 text-[10px] font-black uppercase tracking-widest text-muted border-b border-muted/10">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    className="rounded border-muted/20 bg-background text-primary focus:ring-primary" 
                  />
                </th>
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Inscrit le</th>
                <th className="px-6 py-4">Dernière connexion</th>
                <th className="px-6 py-4">Comms</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/5">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-background/30 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-muted/20 bg-background text-primary focus:ring-primary" 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-muted/10 shrink-0">
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-main flex items-center gap-1.5">
                          {user.username}
                          {user.role === 'admin' && <Shield size={12} className="text-primary" fill="currentColor" />}
                        </p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-muted truncate max-w-[150px]">{user.email}</td>
                  <td className="px-6 py-4 text-xs font-bold text-muted">{user.joinedDate}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold ${user.lastLogin === 'En ligne' ? 'text-emerald-500' : 'text-muted'}`}>
                      {user.lastLogin}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-main">{user.commentsCount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.status === 'Actif' ? 'bg-emerald-500/10 text-emerald-500' :
                      user.status === 'Suspendu' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        user.status === 'Actif' ? 'bg-emerald-500' :
                        user.status === 'Suspendu' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => setSelectedUserForDetail(user)}
                        className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        title="Voir le profil"
                      >
                        <Eye size={16} />
                      </button>
                      <div className="relative group/menu">
                        <button className="p-2 text-muted hover:text-main hover:bg-muted/10 rounded-lg transition-all">
                          <MoreVertical size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-muted/20 rounded-xl shadow-2xl z-50 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all">
                          <div className="p-2 space-y-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted hover:text-main hover:bg-background transition-all">
                              <Edit3 size={14} /> Modifier
                            </button>
                            {user.status === 'Suspendu' ? (
                              <button onClick={() => handleStatusChange(user.id, 'Actif')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted hover:text-emerald-500 hover:bg-emerald-500/5 transition-all">
                                <Play size={14} /> Réactiver
                              </button>
                            ) : (
                              <button onClick={() => handleStatusChange(user.id, 'Suspendu')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted hover:text-yellow-500 hover:bg-yellow-500/5 transition-all">
                                <Pause size={14} /> Suspendre
                              </button>
                            )}
                            <button 
                              onClick={() => { setUserToActOn(user); setIsBannirModalOpen(true); }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
                            >
                              <Slash size={14} /> Bannir
                            </button>
                            <div className="h-px bg-muted/10 my-1" />
                            <button 
                              onClick={() => { setUserToActOn(user); setIsDeleteModalOpen(true); }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all"
                            >
                              <Trash2 size={14} /> Supprimer
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

        {/* Pagination */}
        <AdminPagination 
          currentPage={currentPage}
          totalPages={Math.ceil(filteredUsers.length / pageSize)}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={filteredUsers.length}
        />
      </div>

      {/* User Detail Drawer */}
      <AnimatePresence>
        {selectedUserForDetail && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUserForDetail(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-surface border-l border-muted/20 z-[110] flex flex-col"
            >
              <div className="p-6 border-b border-muted/10 flex items-center justify-between bg-background/50">
                <h2 className="text-sm font-black uppercase tracking-widest text-main">Détail Utilisateur</h2>
                <button onClick={() => setSelectedUserForDetail(null)} className="p-2 hover:bg-muted/10 rounded-xl text-muted hover:text-main transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 no-scrollbar space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-background shadow-2xl mb-4 relative">
                    <img src={selectedUserForDetail.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-surface ${
                      selectedUserForDetail.status === 'Actif' ? 'bg-emerald-500' :
                      selectedUserForDetail.status === 'Suspendu' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                  </div>
                  <h3 className="text-xl font-black text-main flex items-center gap-2">
                    {selectedUserForDetail.username}
                    {selectedUserForDetail.role === 'admin' && <Shield size={18} className="text-primary" fill="currentColor" />}
                  </h3>
                  <p className="text-sm font-bold text-muted">{selectedUserForDetail.email}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-2xl border border-muted/10">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted mb-1">
                      <Calendar size={12} /> Inscrit le
                    </div>
                    <p className="text-xs font-bold text-main">{selectedUserForDetail.joinedDate}</p>
                  </div>
                  <div className="bg-background p-4 rounded-2xl border border-muted/10">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted mb-1">
                      <Clock size={12} /> Connexion
                    </div>
                    <p className="text-xs font-bold text-main">{selectedUserForDetail.lastLogin}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Statistiques</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Activity size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-main">{selectedUserForDetail.viewsCount}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Vues</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Heart size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-main">{selectedUserForDetail.favoritesCount}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Favoris</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-main">{selectedUserForDetail.commentsCount}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Comms</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                        <AlertTriangle size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-main">{selectedUserForDetail.reportsReceived}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Signals</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Activité récente</h4>
                  <div className="space-y-3">
                    {[
                      { text: 'A ajouté "Best of 2024" en favoris', time: 'il y a 2h' },
                      { text: 'A commenté la vidéo #1234', time: 'il y a 5h' },
                      { text: 'S\'est connecté depuis Paris, FR', time: 'il y a 12h' },
                      { text: 'A mis à jour son avatar', time: 'il y a 1 jour' },
                      { text: 'A créé une nouvelle playlist', time: 'il y a 2 jours' },
                    ].map((act, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
                        <div>
                          <p className="text-xs font-bold text-main leading-none mb-1">{act.text}</p>
                          <p className="text-[10px] text-muted">{act.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Actions rapides</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-background border border-muted/10 text-xs font-black uppercase tracking-widest text-main hover:bg-muted/5 transition-all">
                      <Send size={14} /> Envoyer un message
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleStatusChange(selectedUserForDetail.id, 'Suspendu')}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500/20 transition-all"
                      >
                        <Pause size={14} /> Suspendre
                      </button>
                      <button 
                        onClick={() => { setUserToActOn(selectedUserForDetail); setIsBannirModalOpen(true); }}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                      >
                        <Slash size={14} /> Bannir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bannir Modal */}
      <AnimatePresence>
        {isBannirModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBannirModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-surface border border-muted/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 text-red-500 mb-6">
                <div className="p-3 rounded-2xl bg-red-500/10">
                  <Slash size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Bannir l'utilisateur</h3>
                  <p className="text-xs font-bold text-muted">Action irréversible pour {userToActOn?.username}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">Raison du bannissement</label>
                  <textarea 
                    value={banReason}
                    onChange={e => setBanReason(e.target.value)}
                    placeholder="Ex: Spam répétitif, contenu inapproprié..."
                    className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-main focus:outline-none focus:border-red-500/50 transition-all resize-none"
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsBannirModalOpen(false)} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted hover:bg-muted/10 transition-all">Annuler</button>
                  <button onClick={handleBannir} disabled={!banReason.trim()} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-all">Confirmer le bannissement</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-surface border border-muted/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 text-red-500 mb-6">
                <div className="p-3 rounded-2xl bg-red-500/10">
                  <Trash2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Supprimer le compte</h3>
                  <p className="text-xs font-bold text-muted">Toutes les données de {userToActOn?.username} seront effacées.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <p className="text-xs font-bold text-red-500 leading-relaxed">
                    Cette action est définitive. Pour confirmer, veuillez taper <span className="font-black underline">SUPPRIMER</span> ci-dessous.
                  </p>
                </div>
                <input 
                  type="text" 
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  placeholder="Tapez SUPPRIMER"
                  className="w-full bg-background border border-muted/20 rounded-xl py-3 px-4 text-sm font-black text-center text-main focus:outline-none focus:border-red-500/50 transition-all"
                />
                <div className="flex gap-3">
                  <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted hover:bg-muted/10 transition-all">Annuler</button>
                  <button onClick={handleDelete} disabled={deleteConfirmText !== 'SUPPRIMER'} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-all shadow-lg shadow-red-500/20">Supprimer définitivement</button>
                </div>
              </div>
            </motion.div>
          </div>
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
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
