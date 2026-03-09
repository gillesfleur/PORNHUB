export interface AdminComment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  videoId: string;
  videoTitle: string;
  text: string;
  date: string;
  likes: number;
  status: 'Publié' | 'En attente' | 'Signalé' | 'Supprimé';
  reportReason?: string;
}

export const adminComments: AdminComment[] = [
  {
    id: 'c1',
    userId: 'u1',
    username: 'AlexVibe',
    avatar: 'https://picsum.photos/seed/u1/100/100',
    videoId: 'v1',
    videoTitle: 'Lana Rhoades - Best of 2024',
    text: 'Incroyable vidéo, la qualité est folle ! Merci pour le partage.',
    date: 'il y a 2h',
    likes: 12,
    status: 'Publié'
  },
  {
    id: 'c2',
    userId: 'u4',
    username: 'TrollMaster',
    avatar: 'https://picsum.photos/seed/u4/100/100',
    videoId: 'v2',
    videoTitle: 'Riley Reid - New Release Exclusive',
    text: 'Allez voir mon site de crypto sur bit-scam.com !!!',
    date: 'il y a 15 min',
    likes: 0,
    status: 'Signalé',
    reportReason: 'Spam / Publicité non sollicitée'
  },
  {
    id: 'c3',
    userId: 'u14',
    username: 'Newbie_2026',
    avatar: 'https://picsum.photos/seed/u14/100/100',
    videoId: 'v3',
    videoTitle: 'Abella Danger - Hardcore Scene',
    text: 'C\'est ma première fois sur le site, j\'adore le design !',
    date: 'il y a 1h',
    likes: 2,
    status: 'En attente'
  },
  {
    id: 'c4',
    userId: 'u7',
    username: 'DarkKnight',
    avatar: 'https://picsum.photos/seed/u7/100/100',
    videoId: 'v1',
    videoTitle: 'Lana Rhoades - Best of 2024',
    text: 'Quelqu\'un connait la musique à 04:20 ?',
    date: 'il y a 5h',
    likes: 8,
    status: 'Publié'
  },
  {
    id: 'c5',
    userId: 'u12',
    username: 'AngryUser',
    avatar: 'https://picsum.photos/seed/u12/100/100',
    videoId: 'v5',
    videoTitle: 'Mia Malkova - Outdoor Fun',
    text: 'Nul, j\'ai déjà vu ça 100 fois.',
    date: 'il y a 1 jour',
    likes: -5,
    status: 'Supprimé'
  },
  {
    id: 'c6',
    userId: 'u9',
    username: 'Sophie_K',
    avatar: 'https://picsum.photos/seed/u9/100/100',
    videoId: 'v2',
    videoTitle: 'Riley Reid - New Release Exclusive',
    text: 'Riley est vraiment la meilleure, indétrônable.',
    date: 'il y a 3h',
    likes: 45,
    status: 'Publié'
  },
  {
    id: 'c7',
    userId: 'u20',
    username: 'Banned_Again',
    avatar: 'https://picsum.photos/seed/u20/100/100',
    videoId: 'v4',
    videoTitle: 'Johnny Sins - The Doctor Is In',
    text: 'Insultes gratuites et propos haineux envers les acteurs.',
    date: 'il y a 12h',
    likes: 0,
    status: 'Signalé',
    reportReason: 'Discours de haine'
  },
  {
    id: 'c8',
    userId: 'u11',
    username: 'LateNightWatcher',
    avatar: 'https://picsum.photos/seed/u11/100/100',
    videoId: 'v3',
    videoTitle: 'Abella Danger - Hardcore Scene',
    text: 'La scène finale est juste époustouflante.',
    date: 'il y a 8h',
    likes: 15,
    status: 'Publié'
  },
  {
    id: 'c9',
    userId: 'u15',
    username: 'OldSchool_Fan',
    avatar: 'https://picsum.photos/seed/u15/100/100',
    videoId: 'v1',
    videoTitle: 'Lana Rhoades - Best of 2024',
    text: 'Ça me rappelle les classiques des années 2010.',
    date: 'il y a 2 jours',
    likes: 22,
    status: 'Publié'
  },
  {
    id: 'c10',
    userId: 'u6',
    username: 'CinemaFan',
    avatar: 'https://picsum.photos/seed/u6/100/100',
    videoId: 'v5',
    videoTitle: 'Mia Malkova - Outdoor Fun',
    text: 'Est-ce que c\'est du 4K natif ?',
    date: 'il y a 4h',
    likes: 3,
    status: 'En attente'
  },
  {
    id: 'c11',
    userId: 'u13',
    username: 'VibePremium_1',
    avatar: 'https://picsum.photos/seed/u13/100/100',
    videoId: 'v2',
    videoTitle: 'Riley Reid - New Release Exclusive',
    text: 'Le contenu premium est vraiment un cran au-dessus.',
    date: 'il y a 30 min',
    likes: 5,
    status: 'Publié'
  },
  {
    id: 'c12',
    userId: 'u19',
    username: 'Video_Collector',
    avatar: 'https://picsum.photos/seed/u19/100/100',
    videoId: 'v4',
    videoTitle: 'Johnny Sins - The Doctor Is In',
    text: 'Ajouté direct à ma playlist "Favoris" !',
    date: 'il y a 1h',
    likes: 1,
    status: 'Publié'
  },
  {
    id: 'c13',
    userId: 'u8',
    username: 'Spammer_Bot',
    avatar: 'https://picsum.photos/seed/u8/100/100',
    videoId: 'v1',
    videoTitle: 'Lana Rhoades - Best of 2024',
    text: 'Gagnez 5000€ par jour en travaillant de chez vous ! Cliquez ici !',
    date: 'il y a 1 jour',
    likes: 0,
    status: 'Signalé',
    reportReason: 'Arnaque / Scam'
  },
  {
    id: 'c14',
    userId: 'u2',
    username: 'Marie_92',
    avatar: 'https://picsum.photos/seed/u2/100/100',
    videoId: 'v3',
    videoTitle: 'Abella Danger - Hardcore Scene',
    text: 'J\'adore cette actrice, elle donne toujours tout.',
    date: 'il y a 12 min',
    likes: 4,
    status: 'Publié'
  },
  {
    id: 'c15',
    userId: 'u17',
    username: 'Report_Magnet',
    avatar: 'https://picsum.photos/seed/u17/100/100',
    videoId: 'v5',
    videoTitle: 'Mia Malkova - Outdoor Fun',
    text: 'Lien externe vers un site malveillant.',
    date: 'il y a 3h',
    likes: 0,
    status: 'En attente'
  },
  {
    id: 'c16',
    userId: 'u1',
    username: 'AlexVibe',
    avatar: 'https://picsum.photos/seed/u1/100/100',
    videoId: 'v4',
    videoTitle: 'Johnny Sins - The Doctor Is In',
    text: 'Le scénario est un peu cliché mais ça passe.',
    date: 'il y a 6h',
    likes: 2,
    status: 'Publié'
  },
  {
    id: 'c17',
    userId: 'u4',
    username: 'TrollMaster',
    avatar: 'https://picsum.photos/seed/u4/100/100',
    videoId: 'v3',
    videoTitle: 'Abella Danger - Hardcore Scene',
    text: 'Commentaire insultant masqué par la modération.',
    date: 'il y a 10h',
    likes: -10,
    status: 'Supprimé'
  },
  {
    id: 'c18',
    userId: 'u11',
    username: 'LateNightWatcher',
    avatar: 'https://picsum.photos/seed/u11/100/100',
    videoId: 'v1',
    videoTitle: 'Lana Rhoades - Best of 2024',
    text: 'Je ne m\'en lasse pas, déjà 3ème visionnage.',
    date: 'il y a 15h',
    likes: 18,
    status: 'Publié'
  },
  {
    id: 'c19',
    userId: 'u14',
    username: 'Newbie_2026',
    avatar: 'https://picsum.photos/seed/u14/100/100',
    videoId: 'v2',
    videoTitle: 'Riley Reid - New Release Exclusive',
    text: 'Est-ce qu\'il y a une version longue ?',
    date: 'il y a 20h',
    likes: 0,
    status: 'En attente'
  },
  {
    id: 'c20',
    userId: 'u9',
    username: 'Sophie_K',
    avatar: 'https://picsum.photos/seed/u9/100/100',
    videoId: 'v4',
    videoTitle: 'Johnny Sins - The Doctor Is In',
    text: 'Johnny Sins est vraiment polyvalent haha.',
    date: 'il y a 1 jour',
    likes: 30,
    status: 'Publié'
  }
];
