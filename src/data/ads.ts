import { AdPlacement } from '../types';

export const ads: AdPlacement[] = [
  { id: '1', type: 'banner', dimensions: '728x90', position: 'Header Top' },
  { id: '2', type: 'sidebar', dimensions: '300x250', position: 'Sidebar Right' },
  { id: '3', type: 'native', dimensions: 'Fluid', position: 'In-feed Grid' },
  { id: '4', type: 'preroll', dimensions: '16:9', position: 'Video Player' },
  { id: '5', type: 'banner', dimensions: '320x50', position: 'Mobile Bottom' },
];
