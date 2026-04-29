import React from 'react';
import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { supabase } from '../../../../lib/supabase';
import { queryKeys } from '../../../lib/queryKeys';
import { useCurrentUserId } from '../../../hooks/useCurrentUserId';
import { useDebounce } from '../../../hooks/useDebounce';
import type { DateFilterValue, ReadFilterValue, SearchResult, SearchRow } from '../types';

const PAGE_SIZE = 10;

async function fetchSearchCount(userId: string, term: string): Promise<number> {
  const isTagQuery = term.trim().startsWith('#');
  const backendTerm = isTagQuery ? '' : term;

  let queryBuilder = supabase
    .from('items_with_links')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (backendTerm.trim()) {
    const termPattern = `%${backendTerm.trim().replace(/[%_]/g, '')}%`;
    queryBuilder = queryBuilder.or(
      `title.ilike.${termPattern},description.ilike.${termPattern},domain.ilike.${termPattern},url.ilike.${termPattern}`,
    );
  }

  const { count, error } = await queryBuilder;
  if (error) throw new Error('Error al contar resultados');
  return count ?? 0;
}

const FILE_ICON = require('../../../../assets/config/favicon.png');

function isImageUrl(url: string): boolean {
  return /\.(jpe?g|png|gif|webp|heic|bmp|tiff?)(\?|$)/i.test(url);
}

function mapSearchResult(row: SearchRow, tagColorMap: Map<string, string | null>): SearchResult {
  const isFile = row.type === 'file';
  const fileUrl = row.url || '';
  const fileThumbnail = isFile && fileUrl && isImageUrl(fileUrl) ? fileUrl : undefined;
  return {
    id: row.id,
    title: row.og_title?.trim() || row.title?.trim() || row.domain || row.url || 'Recurso sin titulo',
    domain: isFile ? 'Archivo' : row.domain || 'Dominio no disponible',
    snippet: row.description?.trim() || row.url || 'Sin descripcion',
    url: fileUrl,
    createdAt: row.created_at,
    isRead: Boolean(row.is_read),
    tags: (row.tags ?? []).filter(Boolean).map((name) => ({ name, color_hex: tagColorMap.get(name) ?? null })),
    thumbnailUri: fileThumbnail ?? (row.og_image_url ?? row.preview_image_url ?? undefined),
    faviconUri: row.favicon_url ?? undefined,
    isFile,
  };
}

function applyDateFilter(createdAt: string, filter: DateFilterValue) {
  if (filter === 'all') return true;
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) return false;
  const dayToMs = 24 * 60 * 60 * 1000;
  const now = Date.now();
  if (filter === '7d') return createdTime >= now - 7 * dayToMs;
  if (filter === '30d') return createdTime >= now - 30 * dayToMs;
  return createdTime >= now - 365 * dayToMs;
}

async function fetchSearchPage(
  userId: string,
  term: string,
  pageIndex: number,
): Promise<SearchResult[]> {
  const isTagQuery = term.trim().startsWith('#');
  const backendTerm = isTagQuery ? '' : term;

  let queryBuilder = supabase
    .from('items_with_links')
    .select('id,type,title,description,domain,url,created_at,is_read,tags,og_image_url,preview_image_url,favicon_url')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);

  if (backendTerm.trim()) {
    const termPattern = `%${backendTerm.trim().replace(/[%_]/g, '')}%`;
    queryBuilder = queryBuilder.or(
      `title.ilike.${termPattern},description.ilike.${termPattern},domain.ilike.${termPattern},url.ilike.${termPattern}`,
    );
  }

  const [{ data, error: fetchError }, { data: tagRows }] = await Promise.all([
    queryBuilder,
    supabase.from('tags').select('name,color_hex').eq('user_id', userId),
  ]);

  if (fetchError) throw new Error('No se pudieron cargar los recursos.');

  const tagColorMap = new Map(
    ((tagRows ?? []) as { name: string; color_hex: string | null }[]).map((t) => [t.name, t.color_hex]),
  );

  return ((data ?? []) as SearchRow[]).map((row) => mapSearchResult(row, tagColorMap));
}

export function useSearch() {
  const userId = useCurrentUserId();
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 260);

  const [selectedDomain, setSelectedDomain] = React.useState<string | null>(null);
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<DateFilterValue>('all');
  const [selectedRead, setSelectedRead] = React.useState<ReadFilterValue>('all');

  // Tags query — reads from shared cache
  const { data: allTagsData } = useQuery({
    queryKey: queryKeys.tags(userId ?? ''),
    queryFn: async () => {
      const { data } = await supabase
        .from('tags')
        .select('name')
        .eq('user_id', userId!)
        .order('name');
      return (data ?? []) as { name: string }[];
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  // Total count query (for counter display)
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['search-count', userId, debouncedQuery],
    queryFn: () => fetchSearchCount(userId!, debouncedQuery),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });

  const allUserTags = React.useMemo(
    () => (allTagsData ?? []).map((t) => t.name),
    [allTagsData],
  );

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: loadingMore,
    isLoading: loading,
    error: queryError,
  } = useInfiniteQuery({
    queryKey: queryKeys.search(userId ?? '', debouncedQuery),
    queryFn: ({ pageParam }) => fetchSearchPage(userId!, debouncedQuery, (pageParam as number) ?? 0),
    initialPageParam: 0 as number,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === PAGE_SIZE ? (lastPageParam as number) + 1 : undefined,
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

  const results = React.useMemo(
    () => infiniteData?.pages.flatMap((p) => p) ?? [],
    [infiniteData],
  );

  const error = queryError ? 'No se pudieron cargar los recursos.' : '';

  const loadMore = React.useCallback(() => {
    if (!loadingMore && hasNextPage) void fetchNextPage();
  }, [loadingMore, hasNextPage, fetchNextPage]);

  const clearFilters = React.useCallback(() => {
    setSelectedDomain(null);
    setSelectedTag(null);
    setSelectedDate('all');
    setSelectedRead('all');
    setQuery((q) => (q.trim().startsWith('#') ? '' : q));
  }, []);

  const domainOptions = React.useMemo(
    () => Array.from(new Set(results.map((r) => r.domain).filter(Boolean))).slice(0, 20),
    [results],
  );

  const tagOptions = React.useMemo(
    () =>
      Array.from(
        new Set(results.flatMap((r) => r.tags.map((t) => t.name.trim()).filter(Boolean))),
      ).slice(0, 30),
    [results],
  );

  const tagFromQuery = query.trim().startsWith('#') ? query.trim().slice(1).toLowerCase() : null;
  const effectiveTag = tagFromQuery ?? (selectedTag ? selectedTag.toLowerCase() : null);

  const filteredResults = React.useMemo(
    () =>
      results.filter((result) => {
        if (selectedDomain && result.domain !== selectedDomain) return false;
        if (effectiveTag && !result.tags.some((t) => t.name.toLowerCase() === effectiveTag))
          return false;
        if (!applyDateFilter(result.createdAt, selectedDate)) return false;
        if (selectedRead === 'read' && !result.isRead) return false;
        if (selectedRead === 'unread' && result.isRead) return false;
        return true;
      }),
    [results, selectedDate, selectedDomain, selectedRead, effectiveTag],
  );

  const hasActiveFilters =
    selectedDomain !== null ||
    selectedTag !== null ||
    tagFromQuery !== null ||
    selectedDate !== 'all' ||
    selectedRead !== 'all';

  return {
    query,
    setQuery,
    loading,
    loadingMore,
    hasMore: Boolean(hasNextPage),
    loadMore,
    error,
    filteredResults,
    results,
    totalCount,
    domainOptions,
    tagOptions,
    allUserTags,
    selectedDomain,
    setSelectedDomain,
    selectedTag,
    setSelectedTag,
    selectedDate,
    setSelectedDate,
    selectedRead,
    setSelectedRead,
    hasActiveFilters,
    tagFromQuery,
    clearFilters,
  };
}

export type { SearchResult };
