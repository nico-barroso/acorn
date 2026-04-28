import { ImageSourcePropType } from 'react-native';

export type ContentCardData = {
  id: string;
  title: string;
  source: string;
  tags: string[];
  savedDate: string;
  status: 'No visto' | 'Visto';
  isRead: boolean;
  url?: string;
  thumbnailUri?: string;
  faviconUri?: string;
  iconSource?: ImageSourcePropType;
  isFile?: boolean;
};
