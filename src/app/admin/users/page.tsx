'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, perPage: 15, q: '' });
  const [pagination, setPagination] = useState<any>(null);

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await api.admin.getUsers(params);
      if (res.success) {
        setUsers(res.data?.users || res.data || []);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [params.page, params.perPage]);

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      const res = await api.admin.updateUser(id, { role });
      if (res.success) {
        setUsers(users.map(u => u.id === id ? { ...u, role } : u));
      }
    } catch (err) {
      alert('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleBan = async (id: string, isActive: boolean) => {
    const action = isActive ? 'désactiver' : 'réactiver';
    if (!confirm(`Voulez-vous vraiment ${action} cet utilisateur ?`)) return;
    try {
      const res = await api.admin.updateUser(id, { isActive: !isActive });
      if (res.success) {
        setUsers(users.map(u => u.id === id ? { ...u, isActive: !isActive } : u));
      }
    } catch (err) {
      alert('Erreur lors du changement de statut');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-900">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Utilisateurs</h1>
          <p className="text-zinc-500 font-medium text-xs tracking-widest uppercase italic">Database_Identity_Access.v1</p>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-[48px] overflow-hidden backdrop-blur-md shadow-2xl relative">
        <table className="w-full text-left">
          <thead className="bg-zinc-950/80">
            <tr>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Identité</th>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Contact</th>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Rôle & Statut</th>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {loading ? (
               Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="p-12"><div className="h-14 bg-zinc-800/50 rounded-2xl" /></td>
                </tr>
              ))
            ) : users.map((user) => (
              <tr key={user.id} className="group hover:bg-zinc-800/20 transition-all">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[20px] bg-zinc-800 flex items-center justify-center font-black text-white italic text-xl shadow-2xl border border-zinc-700/50 overflow-hidden">
                       {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-base font-black italic tracking-tight text-white uppercase">{user.username}</p>
                      <p className="text-[10px] text-zinc-600 font-bold tracking-widest mt-0.5 font-mono">ID: {user.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                   <p className="text-sm font-medium text-zinc-300">{user.email}</p>
                   <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1 italic">Créé: {new Date(user.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="p-8">
                  <div className="flex flex-col gap-2">
                    <select 
                      value={user.role} 
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 text-[10px] font-black text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-orange-500 transition-all uppercase tracking-widest italic"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black text-center uppercase tracking-[0.2em] ${user.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {user.isActive ? 'ACTIF' : 'SUSPENDU'}
                    </span>
                  </div>
                </td>
                <td className="p-8 text-right">
                   <button 
                     onClick={() => handleBan(user.id, user.isActive)}
                     className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic border ${user.isActive ? 'border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white' : 'border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white'}`}
                   >
                     {user.isActive ? 'BANNIR' : 'RÉACTIVER'}
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
