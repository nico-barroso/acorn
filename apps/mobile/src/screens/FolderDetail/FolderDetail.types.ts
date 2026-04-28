export type FolderResource = {
  id: string;
  title: string;
  source: string;
  tag: string;
  savedDate: string;
  status: 'Visto' | 'No visto';
  url?: string;
  thumbnailUri?: string;
  isRead: boolean;
};

export type FolderDetailScreenProps = {
  folderId: string;
  onBack: () => void;
  onOpenDetail: (itemId: string) => void;
};