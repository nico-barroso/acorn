import type { TagItem } from '@/screens/Home/Home.types';
export type { TagItem };

export type FolderResource = {
  id: string;
  title: string;
  source: string;
  domain?: string;
  tags: TagItem[];
  savedDate: string;
  createdAt: string;
  status: 'Visto' | 'No visto';
  url?: string;
  thumbnailUri?: string;
  faviconUri?: string;
  isFile: boolean;
  isRead: boolean;
};

export type FolderDetailScreenProps = {
  folderId: string;
  onBack: () => void;
  onOpenDetail: (itemId: string) => void;
};