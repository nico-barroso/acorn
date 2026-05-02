import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase';
import { queryKeys } from '../../../lib/queryKeys';
import { useCurrentUserId } from '../../../hooks/useCurrentUserId';
import type { FolderResource } from '../FolderDetail.types';
import { createTagColorMap, mapFolderResource, type ResourceRow } from '../../../lib/mappers';

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

  const tagColorMap = createTagColorMap((tagRows ?? []) as { name: string; slug: string | null; color_hex: string | null }[]);

  const rows = (itemData ?? []) as unknown as ResourceRow[];
  const mapped: FolderResource[] = rows.map((row) => mapFolderResource(row, tagColorMap));

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
