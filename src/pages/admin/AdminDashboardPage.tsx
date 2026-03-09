import React from 'react';
import { 
  Video, 
  Users, 
  Eye, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock3
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const stats = [
    { label: 'Total vidéos', value: '1,247', trend: '+12 cette semaine', icon: Video, color: 'text-blue-500', border: 'border-blue-500', path: '/admin/videos' },
    { label: 'Utilisateurs inscrits', value: '8,432', trend: '+156 cette semaine', icon: Users, color: 'text-emerald-500', border: 'border-emerald-500', path: '/admin/users' },
    { label: 'Vues totales', value: '2.4M', trend: '+340K cette semaine', icon: Eye, color: 'text-primary', border: 'border-primary', path: '/admin/stats' },
    { label: 'Signalements en attente', value: '7', trend: '⚠️ requiert attention', icon: AlertTriangle, color: 'text-yellow-500', border: 'border-yellow-500', path: '/admin/reports' },
  ];

  const chartData = [
    { day: 'Lun', value: 340, height: '50%' },
    { day: 'Mar', value: 290, height: '42%' },
    { day: 'Mer', value: 410, height: '60%' },
    { day: 'Jeu', value: 380, height: '55%' },
    { day: 'Ven', value: 520, height: '76%' },
    { day: 'Sam', value: 680, height: '100%' },
    { day: 'Dim', value: 450, height: '66%' },
  ];

  const recentActivity = [
    { id: 1, type: 'user', text: 'Nouvel utilisateur inscrit : Marie_92', time: 'il y a 12 min', icon: '🆕' },
    { id: 2, type: 'report', text: 'Signalement reçu sur la vidéo #1234', time: 'il y a 34 min', icon: '⚠️' },
    { id: 3, type: 'comment', text: 'Nouveau commentaire signalé', time: 'il y a 1h', icon: '💬' },
    { id: 4, type: 'video', text: '12 nouvelles vidéos importées', time: 'il y a 2h', icon: '🎬' },
    { id: 5, type: 'user', text: 'Utilisateur banni : TrollMaster', time: 'il y a 4h', icon: '🚫' },
    { id: 6, type: 'ad', text: 'Campagne publicitaire "Summer" activée', time: 'il y a 5h', icon: '📢' },
    { id: 7, type: 'video', text: 'Vidéo #5678 supprimée (DMCA)', time: 'il y a 8h', icon: '🗑️' },
    { id: 8, type: 'settings', text: 'Paramètres du site mis à jour', time: 'il y a 12h', icon: '⚙️' },
  ];

  const topVideos = [
    { id: 1, title: 'Lana Rhoades - Best of 2024', views: '124K', thumb: 'https://picsum.photos/seed/v1/100/60' },
    { id: 2, title: 'Riley Reid - New Release Exclusive', views: '98K', thumb: 'https://picsum.photos/seed/v2/100/60' },
    { id: 3, title: 'Abella Danger - Hardcore Scene', views: '85K', thumb: 'https://picsum.photos/seed/v3/100/60' },
    { id: 4, title: 'Johnny Sins - The Doctor Is In', views: '76K', thumb: 'https://picsum.photos/seed/v4/100/60' },
    { id: 5, title: 'Mia Malkova - Outdoor Fun', views: '62K', thumb: 'https://picsum.photos/seed/v5/100/60' },
  ];

  const recentReports = [
    { id: 1, type: 'Contenu', content: 'Vidéo #1234', date: '09/03/2026', status: 'pending', statusLabel: 'En attente' },
    { id: 2, type: 'Commentaire', content: 'ID: 8842', date: '08/03/2026', status: 'resolved', statusLabel: 'Traité' },
    { id: 3, type: 'Utilisateur', content: 'User: Spammer', date: '08/03/2026', status: 'rejected', statusLabel: 'Rejeté' },
    { id: 4, type: 'Contenu', content: 'Vidéo #9921', date: '07/03/2026', status: 'pending', statusLabel: 'En attente' },
    { id: 5, type: 'Commentaire', content: 'ID: 7721', date: '07/03/2026', status: 'pending', statusLabel: 'En attente' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-main uppercase tracking-tighter mb-2">Dashboard</h1>
        <p className="text-muted text-sm font-medium">Bienvenue, voici l'état actuel de votre plateforme.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              to={stat.path}
              className={`block bg-surface p-6 rounded-2xl border-l-4 ${stat.border} border-y border-r border-muted/10 hover:shadow-xl hover:shadow-black/20 transition-all group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-background ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                  {stat.trend.includes('+') ? <TrendingUp size={12} /> : null}
                  {stat.trend}
                </div>
              </div>
              <p className="text-3xl font-black text-main tracking-tighter mb-1">{stat.value}</p>
              <p className="text-xs font-bold text-muted uppercase tracking-widest group-hover:text-primary transition-colors">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <div className="lg:col-span-2 bg-surface rounded-3xl border border-muted/10 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-lg font-black text-main uppercase tracking-tighter flex items-center gap-2">
              <Eye size={20} className="text-primary" />
              Vues des 7 derniers jours
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Vues quotidiennes</span>
            </div>
          </div>

          {/* Simulated Chart */}
          <div className="h-64 flex items-end justify-between gap-2 lg:gap-4 px-2">
            {chartData.map((data) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-4 group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-main text-background px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {data.value}K vues
                </div>
                {/* Bar */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: data.height }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="w-full max-w-[40px] bg-primary/20 group-hover:bg-primary rounded-t-lg transition-colors relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                </motion.div>
                {/* Label */}
                <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-main transition-colors">
                  {data.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Column */}
        <div className="bg-surface rounded-3xl border border-muted/10 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-muted/10 flex items-center justify-between">
            <h2 className="text-lg font-black text-main uppercase tracking-tighter flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              Activité récente
            </h2>
          </div>
          <div className="flex-grow overflow-y-auto no-scrollbar max-h-[400px]">
            <div className="divide-y divide-muted/5">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 flex items-start gap-4 hover:bg-background/50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-background border border-muted/10 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-main leading-relaxed mb-1 line-clamp-2">{activity.text}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                      <Clock3 size={10} />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="p-4 bg-background/30 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors border-t border-muted/10">
            Voir toute l'activité
          </button>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Videos */}
        <div className="bg-surface rounded-3xl border border-muted/10 overflow-hidden">
          <div className="p-6 border-b border-muted/10 flex items-center justify-between">
            <h2 className="text-lg font-black text-main uppercase tracking-tighter">Top 5 vidéos du jour</h2>
            <Link to="/admin/videos" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Voir tout</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background/50 text-[10px] font-black uppercase tracking-widest text-muted">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Vidéo</th>
                  <th className="px-6 py-4 text-right">Vues aujourd'hui</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/5">
                {topVideos.map((video, idx) => (
                  <tr key={video.id} className="hover:bg-background/30 transition-colors group">
                    <td className="px-6 py-4 text-xs font-black text-muted">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 border border-muted/10">
                          <img src={video.thumb} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-xs font-bold text-main truncate max-w-[200px] group-hover:text-primary transition-colors">{video.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-black text-primary">{video.views}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-surface rounded-3xl border border-muted/10 overflow-hidden">
          <div className="p-6 border-b border-muted/10 flex items-center justify-between">
            <h2 className="text-lg font-black text-main uppercase tracking-tighter">Signalements récents</h2>
            <Link to="/admin/reports" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Gérer</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background/50 text-[10px] font-black uppercase tracking-widest text-muted">
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Contenu</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/5">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-background/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-main">{report.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-muted">{report.content}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-muted">{report.date}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        report.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        report.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {report.status === 'pending' && <Clock3 size={10} />}
                        {report.status === 'resolved' && <CheckCircle2 size={10} />}
                        {report.status === 'rejected' && <XCircle size={10} />}
                        {report.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
