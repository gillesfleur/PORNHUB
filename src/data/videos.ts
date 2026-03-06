import { Video } from '../types';

export const videos: Video[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `${i + 1}`,
  title: [
    "Exploration intense en studio",
    "Rencontre imprévue au bureau",
    "Session matinale ensoleillée",
    "Secret partagé entre voisins",
    "Leçon particulière de yoga",
    "Casting sauvage en ville",
    "Weekend détente au chalet",
    "Première fois devant la caméra",
    "Retrouvailles après le travail",
    "Expérience inédite à deux"
  ][i % 10] + ` #${i + 1}`,
  duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 50) + 10}`,
  views: `${(Math.random() * 500 + 10).toFixed(1)}K`,
  likes: `${Math.floor(Math.random() * 90) + 10}%`,
  date: `${Math.floor(Math.random() * 11) + 1} mois`,
  category: ['Amateur', 'MILF', 'Teen', 'POV', 'Hardcore'][i % 5],
  tags: ['HD', 'New', 'Popular'],
  thumbnail: `https://picsum.photos/seed/video${i}/320/180`,
  actor: ['Lana Rhoades', 'Mia Khalifa', 'Riley Reid', 'Abella Danger', 'Angela White'][i % 5],
  actorId: `${(i % 5) + 1}`
}));
