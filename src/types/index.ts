export type Video = {
  id: string;
  title: string;
  duration: string;
  views: string;
  likes: string;
  date: string;
  category: string;
  tags: string[];
  thumbnail: string;
  actor: string;
  actorId: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  videoCount: number;
  description?: string;
  image?: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  videoCount: number;
};

export type Actor = {
  id: string;
  name: string;
  slug: string;
  photo: string;
  videoCount: number;
  bio: string;
  gender: 'female' | 'male';
};

export type AdPlacement = {
  id: string;
  type: 'banner' | 'sidebar' | 'native' | 'preroll';
  dimensions: string;
  position: string;
};

export type Playlist = {
  id: string;
  name: string;
  videoCount: number;
  thumbnail: string;
};

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isPremium: boolean;
};
