import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase';
import { queryKeys } from '../../../lib/queryKeys';
import { useCurrentUserId } from '../../../hooks/useCurrentUserId';
import { formatSavedDate } from '../../../lib/formatSavedDate';
import type { FolderResource } from '../FolderDetail.types';

const FILE_ICON = require('../../../../assets/config/favicon.png');

function isImageUrl(url: string): boolean {
  return /\.(jpe?g|png|gif|webp|heic|bmp|tiff?)(\?|$)/i.test(url);
}

type ItemRow = {
  id: string;
  type: string | null;
  title: string | null;
  is_read: boolean;
  created_at: string;
  url: string | null;
  domain: string | null;
  tags: string[] | null;
  og_image_url: string | null;
  preview_image_url: string | null;
  favicon_url: string | null;
  metadata: { og_title: string | null }[] | null;
};

type SmartRuleRow = {
  field: string;
  operator: string;
  value: unknown;
  value_type: string;
  is_negated: boolean | null;
};

function applySmartRules(
  items: FolderResource[],
  rules: SmartRuleRow[],
  logic: string,
): FolderResource[] {
  if (rules.length === 0) return items;

  return items.filter((item) => {
    const results = rules.map((rule) => {
      const ruleValue =
        typeof rule.value === 'string' ? rule.value : String(rule.value ?? '');

      let matches = false;
      if (rule.field === 'tag') {
        matches = item.tags.some((t) => t.name === ruleValue);
      } else if (rule.field === 'domain') {
        matches = Boolean(
          item.domain && item.domain.toLowerCase() === ruleValue.toLowerCase(),
        );
      }

      return rule.is_negated ? !matches : matches;
    });

    return logic === 'ANY' ? results.some(Boolean) : results.every(Boolean);
  });
}

type FolderDetailData = {
  folderName: string;
  folderDescription: string;
  resources: FolderResource[];
};

async function fetchFolderDetail(userId: string, folderId: string): Promise<FolderDetailData> {
  const { data: folderData, error: folderError } = await supabase
    .from('smart_folders')
    .select('name, description, logic')
    .eq('id', folderId)
    .eq('user_id', userId)
    .single();

  if (folderError) throw new Error('No se pudo cargar la carpeta.');

  const [
    { data: itemData, error: itemError },
    { data: tagRows },
    { data: rulesData },
  ] = await Promise.all([
    supabase
      .from('items_with_links')
      .select(
        'id,type,title,is_read,created_at,url,domain,tags,og_image_url,preview_image_url,favicon_url,metadata(og_title)',
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(200),
    supabase.from('tags').select('name,slug,color_hex').eq('user_id', userId),
    supabase
      .from('smart_folder_rules')
      .select('field,operator,value,value_type,is_negated')
      .eq('folder_id', folderId)
      .order('position'),
  ]);

  if (itemError) throw new Error('No se pudieron cargar los recursos.');

  const tagColorMap = new Map<string, string | null>();
  ((tagRows ?? []) as { name: string; slug: string | null; color_hex: string | null }[]).forEach((t) => {
    tagColorMap.set(t.name, t.color_hex);
    if (t.slug) tagColorMap.set(t.slug, t.color_hex);
    tagColorMap.set(t.name.toLowerCase(), t.color_hex);
  });

  const rows = (itemData ?? []) as unknown as ItemRow[];
  const mapped: FolderResource[] = rows.map((row): FolderResource => {
    const isFile = row.type === 'file';
    const fileUrl = row.url ?? undefined;
    const fileThumbnail = isFile && fileUrl && isImageUrl(fileUrl) ? fileUrl : undefined;
    return {
      id: row.id,
      title: row.title?.trim() || row.metadata?.[0]?.og_title?.trim() || row.domain || 'Recurso sin título',
      source: isFile ? 'Archivo' : row.domain ? `Enlace / ${row.domain}` : 'Enlace',
      domain: row.domain ?? undefined,
      tags: (row.tags ?? []).map((name) => ({
        name,
        color_hex: tagColorMap.get(name) ?? null,
      })),
      savedDate: formatSavedDate(row.created_at),
      status: row.is_read ? 'Visto' : 'No visto',
      isRead: Boolean(row.is_read),
      url: fileUrl,
      thumbnailUri: fileThumbnail ?? (row.og_image_url ?? row.preview_image_url ?? undefined),
      faviconUri: row.favicon_url ?? (row.domain ? `https://www.google.com/s2/favicons?domain=${row.domain}&sz=64` : undefined),
      isFile,
    };
  });

  const folderLogic = (folderData.logic as string) ?? 'ALL';
  const smartRules = (rulesData ?? []) as SmartRuleRow[];

  return {
    folderName: folderData.name || 'Carpeta',
    folderDescription: folderData.description?.trim() || '',
    resources: applySmartRules(mapped, smartRules, folderLogic),
  };
}

export function useFolderDetail(folderId: string) {
  const userId = useCurrentUserId();
  const [activeQuickFilter, setActiveQuickFilter] = useState('all');

  const { data, isLoading: loading, error: queryError } = useQuery({
    queryKey: queryKeys.folderDetail(userId ?? '', folderId),
    queryFn: () => fetchFolderDetail(userId!, folderId),
    enabled: Boolean(userId),
    staleTime: 3 * 60 * 1000,
  });

  const error = queryError ? 'No se pudo cargar la carpeta.' : '';

  const filteredResources = useMemo(() => {
    const resources = data?.resources ?? [];
    if (activeQuickFilter === 'all') return resources;

    if (activeQuickFilter === 'unread') return resources.filter((r) => !r.isRead);

    if (activeQuickFilter === 'new') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return resources.filter((r) => new Date(r.savedDate) >= sevenDaysAgo);
    }

    return resources;
  }, [data?.resources, activeQuickFilter]);

  return {
    folderName: data?.folderName ?? '',
    folderDescription: data?.folderDescription ?? '',
    loading,
    resources: filteredResources,
    error,
    activeQuickFilter,
    hasActiveFilters: activeQuickFilter !== 'all',
    onQuickFilter: setActiveQuickFilter,
  };
}
