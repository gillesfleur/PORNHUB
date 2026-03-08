import { Playlist } from '../types';

export const playlists: Playlist[] = [
  { 
    id: '1', 
    name: 'Mes coups de cœur', 
    videoCount: 12, 
    thumbnail: 'https://picsum.photos/seed/pl1/320/180',
    isPrivate: false,
    createdAt: '12/01/2024',
    description: 'Mes vidéos préférées de tous les temps.'
  },
  { 
    id: '2', 
    name: 'À regarder plus tard', 
    videoCount: 5, 
    thumbnail: 'https://picsum.photos/seed/pl2/320/180',
    isPrivate: true,
    createdAt: '05/02/2024',
    description: 'Vidéos à voir quand j\'ai le temps.'
  },
  { 
    id: '3', 
    name: 'Best of 2024', 
    videoCount: 24, 
    thumbnail: 'https://picsum.photos/seed/pl3/320/180',
    isPrivate: false,
    createdAt: '15/03/2024',
    description: 'Le meilleur de l\'année en cours.'
  },
];
