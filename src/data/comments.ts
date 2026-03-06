export interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

export const mockComments: Comment[] = [
  {
    id: '1',
    username: 'JeanDupont92',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    text: 'Incroyable performance ! La qualité 4K est vraiment au rendez-vous sur VibeTube.',
    date: 'il y a 2 heures',
    likes: 42,
    replies: [
      {
        id: '1-1',
        username: 'VibeLover',
        avatar: 'https://picsum.photos/seed/user2/100/100',
        text: 'Entièrement d\'accord, le rendu est bluffant.',
        date: 'il y a 1 heure',
        likes: 5
      }
    ]
  },
  {
    id: '2',
    username: 'MarieCurieuse',
    avatar: 'https://picsum.photos/seed/user3/100/100',
    text: 'Quelqu\'un connaît la musique de l\'intro ? Elle est géniale !',
    date: 'il y a 5 heures',
    likes: 12
  },
  {
    id: '3',
    username: 'TechFan_01',
    avatar: 'https://picsum.photos/seed/user4/100/100',
    text: 'Le montage est super propre, bravo à l\'équipe de production.',
    date: 'il y a 1 jour',
    likes: 85,
    replies: [
      {
        id: '3-1',
        username: 'EditorPro',
        avatar: 'https://picsum.photos/seed/user5/100/100',
        text: 'Merci ! On a passé beaucoup de temps sur l\'étalonnage.',
        date: 'il y a 12 heures',
        likes: 15
      }
    ]
  },
  {
    id: '4',
    username: 'Anonyme_77',
    avatar: 'https://picsum.photos/seed/user6/100/100',
    text: 'Pas mal, mais j\'aurais aimé voir plus de scènes en extérieur.',
    date: 'il y a 2 jours',
    likes: 3
  },
  {
    id: '5',
    username: 'SuperFan_Vibe',
    avatar: 'https://picsum.photos/seed/user7/100/100',
    text: 'Encore une pépite ! Je ne m\'en lasse pas.',
    date: 'il y a 3 jours',
    likes: 128
  },
  {
    id: '6',
    username: 'CritiqueVideo',
    avatar: 'https://picsum.photos/seed/user8/100/100',
    text: 'Le rythme est un peu lent au début, mais la fin rattrape tout.',
    date: 'il y a 4 jours',
    likes: 7
  },
  {
    id: '7',
    username: 'User999',
    avatar: 'https://picsum.photos/seed/user9/100/100',
    text: 'Top ! Vivement la prochaine vidéo.',
    date: 'il y a 1 semaine',
    likes: 21
  },
  {
    id: '8',
    username: 'LeVoyageur',
    avatar: 'https://picsum.photos/seed/user10/100/100',
    text: 'Une ambiance vraiment unique, j\'adore le style.',
    date: 'il y a 1 semaine',
    likes: 14
  }
];
