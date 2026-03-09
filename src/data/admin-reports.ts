export interface AdminReport {
  id: string;
  type: 'contenu_illegal' | 'spam' | 'dmca' | 'autre';
  reporterName: string;
  reporterEmail: string;
  contentType: 'vidéo' | 'commentaire';
  contentId: string;
  contentTitle: string;
  contentThumbnail?: string;
  description: string;
  date: string;
  statut: 'en_attente' | 'en_cours' | 'traité' | 'rejeté';
  assignedTo: string | null;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  dmcaDetails?: {
    originalUrl: string;
    statement: string;
  };
  notes?: string[];
}

export const adminReports: AdminReport[] = [
  {
    id: 'rep-1',
    type: 'dmca',
    reporterName: 'Copyright Protection Ltd',
    reporterEmail: 'legal@copyright-prot.com',
    contentType: 'vidéo',
    contentId: 'v1',
    contentTitle: 'Lana Rhoades - Best of 2024',
    contentThumbnail: 'https://picsum.photos/seed/v1/400/250',
    description: 'Cette vidéo contient du contenu protégé par le droit d\'auteur appartenant à notre client sans autorisation préalable.',
    date: '09/03/2026 10:45',
    statut: 'en_attente',
    assignedTo: null,
    priority: 'Haute',
    dmcaDetails: {
      originalUrl: 'https://official-studio.com/videos/lana-rhoades-exclusive',
      statement: 'Je déclare sous peine de parjure que je suis autorisé à agir au nom du titulaire du droit d\'auteur exclusif qui aurait été enfreint.'
    }
  },
  {
    id: 'rep-2',
    type: 'contenu_illegal',
    reporterName: 'Jean Dupont',
    reporterEmail: 'j.dupont@email.fr',
    contentType: 'vidéo',
    contentId: 'v5',
    contentTitle: 'Mia Malkova - Outdoor Fun',
    contentThumbnail: 'https://picsum.photos/seed/v5/400/250',
    description: 'Contenu filmé dans un lieu public sans autorisation et présentant des comportements dangereux.',
    date: '09/03/2026 09:12',
    statut: 'en_cours',
    assignedTo: 'Admin Sarah',
    priority: 'Haute'
  },
  {
    id: 'rep-3',
    type: 'spam',
    reporterName: 'User123',
    reporterEmail: 'user123@gmail.com',
    contentType: 'commentaire',
    contentId: 'c2',
    contentTitle: 'Riley Reid - New Release Exclusive',
    description: 'Ce commentaire est un spam publicitaire pour un site de crypto-monnaie frauduleux.',
    date: '09/03/2026 11:30',
    statut: 'en_attente',
    assignedTo: null,
    priority: 'Basse'
  },
  {
    id: 'rep-4',
    type: 'dmca',
    reporterName: 'Studio X Legal',
    reporterEmail: 'dmca@studiox.com',
    contentType: 'vidéo',
    contentId: 'v2',
    contentTitle: 'Riley Reid - New Release Exclusive',
    contentThumbnail: 'https://picsum.photos/seed/v2/400/250',
    description: 'Violation de copyright sur l\'intégralité de la scène.',
    date: '08/03/2026 22:15',
    statut: 'en_attente',
    assignedTo: null,
    priority: 'Haute',
    dmcaDetails: {
      originalUrl: 'https://studiox.com/riley-reid-exclusive',
      statement: 'Déclaration de conformité DMCA standard.'
    }
  },
  {
    id: 'rep-5',
    type: 'autre',
    reporterName: 'Marc L.',
    reporterEmail: 'marc.l@yahoo.fr',
    contentType: 'vidéo',
    contentId: 'v4',
    contentTitle: 'Johnny Sins - The Doctor Is In',
    contentThumbnail: 'https://picsum.photos/seed/v4/400/250',
    description: 'Mauvaise catégorie, cette vidéo devrait être dans "Humour" plutôt que "Action".',
    date: '08/03/2026 15:40',
    statut: 'traité',
    assignedTo: 'Admin Boss',
    priority: 'Basse'
  },
  {
    id: 'rep-6',
    type: 'contenu_illegal',
    reporterName: 'Anonyme',
    reporterEmail: 'anon@protonmail.com',
    contentType: 'vidéo',
    contentId: 'v3',
    contentTitle: 'Abella Danger - Hardcore Scene',
    contentThumbnail: 'https://picsum.photos/seed/v3/400/250',
    description: 'Propos haineux détectés dans la description de la vidéo.',
    date: '09/03/2026 08:00',
    statut: 'en_attente',
    assignedTo: null,
    priority: 'Haute'
  },
  {
    id: 'rep-7',
    type: 'spam',
    reporterName: 'Modérateur Auto',
    reporterEmail: 'bot@tubesite.com',
    contentType: 'commentaire',
    contentId: 'c13',
    contentTitle: 'Lana Rhoades - Best of 2024',
    description: 'Détection automatique de liens de phishing répétitifs.',
    date: '09/03/2026 12:05',
    statut: 'en_attente',
    assignedTo: null,
    priority: 'Moyenne'
  },
  {
    id: 'rep-8',
    type: 'dmca',
    reporterName: 'Content ID System',
    reporterEmail: 'noreply@contentid.net',
    contentType: 'vidéo',
    contentId: 'v1',
    contentTitle: 'Lana Rhoades - Best of 2024',
    contentThumbnail: 'https://picsum.photos/seed/v1/400/250',
    description: 'Match automatique avec la base de données de droits d\'auteur.',
    date: '07/03/2026 18:20',
    statut: 'en_cours',
    assignedTo: 'Admin Sarah',
    priority: 'Haute',
    dmcaDetails: {
      originalUrl: 'https://official.com/v/12345',
      statement: 'Automated DMCA claim.'
    }
  },
  {
    id: 'rep-9',
    type: 'autre',
    reporterName: 'Lucie M.',
    reporterEmail: 'lucie@outlook.com',
    contentType: 'commentaire',
    contentId: 'c7',
    contentTitle: 'Johnny Sins - The Doctor Is In',
    description: 'L\'utilisateur usurpe l\'identité d\'une personnalité connue.',
    date: '09/03/2026 11:50',
    statut: 'en_attente',
    assignedTo: null,
    priority: 'Moyenne'
  },
  {
    id: 'rep-10',
    type: 'contenu_illegal',
    reporterName: 'Cyber Vigilance',
    reporterEmail: 'contact@cyber-vigilance.org',
    contentType: 'vidéo',
    contentId: 'v2',
    contentTitle: 'Riley Reid - New Release Exclusive',
    contentThumbnail: 'https://picsum.photos/seed/v2/400/250',
    description: 'Contenu suspecté d\'être non consensuel.',
    date: '09/03/2026 07:30',
    statut: 'en_attente',
    assignedTo: null,
    priority: 'Haute'
  }
];
