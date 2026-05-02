import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase';
import { queryKeys } from '../../../lib/queryKeys';
import { queryClient } from '../../../lib/queryClient';
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

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function evalStringOp(actual: string | null | undefined, op: string, expected: string | string[]): boolean {
  const a = (actual ?? '').toLowerCase();
  const e = Array.isArray(expected) ? expected.map((v) => v.toLowerCase()) : expected.toLowerCase();
  switch (op) {
    case 'equals': return a === e;
    case 'not_equals': return a !== e;
    case 'contains': return a.includes(e as string);
    case 'starts_with': return a.startsWith(e as string);
    case 'ends_with': return a.endsWith(e as string);
    case 'in': return (e as string[]).includes(a);
    case 'not_in': return !(e as string[]).includes(a);
    default: return false;
  }
}

function evalTagOp(tagNames: string[], op: string, expected: string | string[]): boolean {
  const tagSlugs = tagNames.map(slugify);
  const vals = (Array.isArray(expected) ? expected : [expected]).map((v) => v.toLowerCase());
  switch (op) {
    case 'equals':
    case 'contains':
    case 'in':
      return vals.some((v) => tagNames.some((n) => n.toLowerCase() === v) || tagSlugs.includes(v));
    case 'all_in':
      return vals.every((v) => tagNames.some((n) => n.toLowerCase() === v) || tagSlugs.includes(v));
    case 'not_equals':
    case 'not_contains':
    case 'not_in':
      return !vals.some((v) => tagNames.some((n) => n.toLowerCase() === v) || tagSlugs.includes(v));
    default:
      return false;
  }
}

function evalDateOp(isoDate: string, op: string, expected: unknown): boolean {
  const actual = new Date(isoDate).getTime();
  if (typeof expected === 'string' || typeof expected === 'number') {
    const exp = new Date(expected as string).getTime();
    switch (op) {
      case 'equals': return actual === exp;
      case 'gt': return actual > exp;
      case 'gte': return actual >= exp;
      case 'lt': return actual < exp;
      case 'lte': return actual <= exp;
    }
  }
  if (op === 'between' && Array.isArray(expected) && expected.length === 2) {
    const [from, to] = (expected as string[]).map((d) => new Date(d).getTime());
    return actual >= from && actual <= to;
  }
  return false;
}

function applySmartRules(
  items: FolderResource[],
  rules: SmartRuleRow[],
  logic: string,
): FolderResource[] {
  if (rules.length === 0) return items;

  return items.filter((item) => {
    const results = rules.map((rule) => {
      const field = rule.field.toLowerCase();
      const op = (rule.operator ?? 'equals').toLowerCase();
      const val = rule.value;
      const strVal = typeof val === 'string' ? val : String(val ?? '');

      let matches = false;

      if (field === 'domain') {
        matches = evalStringOp(item.domain, op, Array.isArray(val) ? (val as string[]) : strVal);
      } else if (field === 'tag' || field === 'tag_slug' || field === 'tags' || field === 'tag_name') {
        const tagNames = item.tags.map((t) => t.name);
        matches = evalTagOp(tagNames, op, Array.isArray(val) ? (val as string[]) : strVal);
      } else if (field === 'is_read' || field === 'status' || field === 'visto') {
        const boolVal = typeof val === 'boolean' ? val : ['true', '1', 'yes', 'visto', 'read'].includes(strVal.toLowerCase());
        matches = op === 'not_equals' ? item.isRead !== boolVal : item.isRead === boolVal;
      } else if (field === 'created_at' || field === 'date') {
        matches = evalDateOp(item.createdAt, op, val);
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

  const handleToggleRead = useCallback(async (itemId: string, nextRead: boolean) => {
    const queryKey = queryKeys.folderDetail(userId!, folderId);

    queryClient.setQueryData<{ folderName: string; folderDescription: string; resources: FolderResource[] }>(queryKey, (old) => {
      if (!old) return old;
      return {
        ...old,
        resources: old.resources.map((r) =>
          r.id === itemId ? { ...r, isRead: nextRead, status: nextRead ? 'Visto' : 'No visto' } : r,
        ),
      };
    });

    const { error: updateError } = await supabase
      .from('items')
      .update({ is_read: nextRead, updated_at: new Date().toISOString() })
      .eq('id', itemId);

    if (updateError) {
      queryClient.setQueryData<{ folderName: string; folderDescription: string; resources: FolderResource[] }>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          resources: old.resources.map((r) =>
            r.id === itemId ? { ...r, isRead: !nextRead, status: !nextRead ? 'Visto' : 'No visto' } : r,
          ),
        };
      });
    }
  }, [userId, folderId]);

  return {
    folderName: data?.folderName ?? '',
    folderDescription: data?.folderDescription ?? '',
    loading,
    resources: filteredResources,
    error,
    activeQuickFilter,
    hasActiveFilters: activeQuickFilter !== 'all',
    onQuickFilter: setActiveQuickFilter,
    handleToggleRead,
  };
}
