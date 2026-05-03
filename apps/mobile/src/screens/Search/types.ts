import type { TagItem } from '@/screens/Home/Home.types';
export type { TagItem };

export type SearchResult = {
  id: string;
  title: string;
  rawDomain: string | null;
  domain: string;
  snippet: string;
  url: string;
  createdAt: string;
  savedDate: string;
  isRead: boolean;
  tags: TagItem[];
  thumbnailUri?: string;
  faviconUri?: string;
  faviconFallbackUri?: string;
  isFile: boolean;
  note?: string;
};

export type SearchRow = {
  id: string;
  type: string | null;
  title: string | null;
  og_title: string | null;
  description: string | null;
  domain: string | null;
  url: string | null;
  created_at: string;
  is_read: boolean;
  tags: string[] | null;
  og_image_url: string | null;
  preview_image_url: string | null;
  favicon_url: string | null;
};

export type SearchScreenProps = {
  onBack: () => void;
  onOpenDetail: (itemId: string) => void;
};

export type DateFilterValue = 'all' | '7d' | '30d' | '365d';
export type ReadFilterValue = 'all' | 'unread' | 'read';
export type TypeFilterValue = 'all' | 'link' | 'file';

export type FilterPanelProps = {
  domains: string[];
  tags: string[];
  selectedDomain: string | null;
  selectedTag: string | null;
  selectedDate: DateFilterValue;
  selectedRead: ReadFilterValue;
  selectedType: TypeFilterValue;
  onSelectDomain: (domain: string | null) => void;
  onSelectTag: (tag: string | null) => void;
  onSelectDate: (date: DateFilterValue) => void;
  onSelectRead: (status: ReadFilterValue) => void;
  onSelectType: (type: TypeFilterValue) => void;
  onClear: () => void;
};
