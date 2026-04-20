import { ImageSourcePropType } from 'react-native';

export type ContentCardData = {
  id: string;
  title: string;
  source: string;
  tag: string;
  savedDate: string;
  status: 'No visto' | 'Visto';
  isRead: boolean;
  url?: string;
  thumbnailUri?: string;
  iconSource?: ImageSourcePropType;
};
