import { formatSavedDate } from './formatSavedDate';
import type { ContentCardData } from '@/screens/Home/Home.types';
import type { SearchResult, SearchRow } from '@/screens/Search/types';
import type { FolderResource } from '@/screens/FolderDetail/FolderDetail.types';

const FILE_ICON = require('@mobile/assets/favicon.png');

export type TagRow = { name: string; slug: string | null; color_hex: string | null };

export type ResourceRow = {
  id: string;
  type: string | null;
  title: string | null;
  is_read: boolean;
  created_at: string;
  url: string | null;
  domain: string | null;
  favicon_url: string | null;
  preview_image_url: string | null;
  og_image_url: string | null;
  tags: string[] | null;
  description: string | null;
  metadata: { og_title: string | null }[] | null;
};

export function createTagColorMap(tagRows: TagRow[]): Map<string, string | null> {
  const map = new Map<string, string | null>();
  tagRows.forEach((t) => {
    map.set(t.name, t.color_hex);
    if (t.slug) map.set(t.slug, t.color_hex);
    map.set(t.name.toLowerCase(), t.color_hex);
  });
  return map;
}

export function mapResource(
  row: ResourceRow,
  tagColorMap: Map<string, string | null>,
): ContentCardData {
  const isFile = row.type === 'file';
  const fileUrl = row.url ?? undefined;
  return {
    id: row.id,
    title:
      row.title?.trim() ||
      row.metadata?.[0]?.og_title?.trim() ||
      row.domain ||
      'Recurso sin titulo',
    source: isFile ? 'Archivo' : row.domain ? `Enlace / ${row.domain}` : 'Enlace',
    tags: (row.tags ?? []).map((name) => ({ name, color_hex: tagColorMap.get(name) ?? null })),
    savedDate: formatSavedDate(row.created_at),
    status: row.is_read ? 'Visto' : 'No visto',
    isRead: Boolean(row.is_read),
    url: fileUrl,
    thumbnailUri: isFile ? undefined : (row.og_image_url ?? row.preview_image_url ?? undefined),
    faviconUri: row.domain
      ? `https://www.google.com/s2/favicons?domain=${row.domain}&sz=64`
      : (row.favicon_url ?? undefined),
    faviconFallbackUri: row.favicon_url ?? undefined,
    iconSource: isFile ? FILE_ICON : undefined,
    isFile,
    note: row.description?.trim() || undefined,
  };
}

export function mapSearchResult(
  row: SearchRow,
  tagColorMap: Map<string, string | null>,
): SearchResult {
  const isFile = row.type === 'file';
  const fileUrl = row.url || '';
  return {
    id: row.id,
    title:
      row.title?.trim() ||
      row.og_title?.trim() ||
      row.domain ||
      'Recurso sin titulo',
    rawDomain: isFile ? null : (row.domain ?? null),
    domain: isFile ? 'Archivo' : row.domain ? `Enlace / ${row.domain}` : 'Enlace',
    snippet: row.description?.trim() || row.url || 'Sin descripcion',
    url: fileUrl,
    createdAt: row.created_at,
    savedDate: formatSavedDate(row.created_at),
    isRead: Boolean(row.is_read),
    tags: (row.tags ?? [])
      .filter(Boolean)
      .map((name) => ({ name, color_hex: tagColorMap.get(name) ?? null })),
    thumbnailUri: isFile ? undefined : (row.og_image_url ?? row.preview_image_url ?? undefined),
    faviconUri: row.domain
      ? `https://www.google.com/s2/favicons?domain=${row.domain}&sz=64`
      : (row.favicon_url ?? undefined),
    faviconFallbackUri: row.favicon_url ?? undefined,
    isFile,
    note: row.description?.trim() || undefined,
  };
}

export function mapFolderResource(
  row: ResourceRow,
  tagColorMap: Map<string, string | null>,
): FolderResource {
  const isFile = row.type === 'file';
  const fileUrl = row.url ?? undefined;
  return {
    id: row.id,
    title:
      row.title?.trim() ||
      row.metadata?.[0]?.og_title?.trim() ||
      row.domain ||
      'Recurso sin título',
    source: isFile ? 'Archivo' : row.domain ? `Enlace / ${row.domain}` : 'Enlace',
    domain: row.domain ?? undefined,
    tags: (row.tags ?? []).map((name) => ({ name, color_hex: tagColorMap.get(name) ?? null })),
    savedDate: formatSavedDate(row.created_at),
    createdAt: row.created_at,
    status: row.is_read ? 'Visto' : 'No visto',
    isRead: Boolean(row.is_read),
    url: fileUrl,
    thumbnailUri: isFile ? undefined : (row.og_image_url ?? row.preview_image_url ?? undefined),
    faviconUri:
      row.favicon_url ??
      (row.domain ? `https://www.google.com/s2/favicons?domain=${row.domain}&sz=64` : undefined),
    isFile,
  };
}
