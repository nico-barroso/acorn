import { ImageSourcePropType } from 'react-native';

export type TagItem = { name: string; color_hex: string | null };

export type ContentCardData = {
  id: string;
  title: string;
  source: string;
  tags: TagItem[];
  savedDate: string;
  status: 'No visto' | 'Visto';
  isRead: boolean;
  url?: string;
  thumbnailUri?: string;
  faviconUri?: string;
  faviconFallbackUri?: string;
  iconSource?: ImageSourcePropType;
  isFile?: boolean;
};
