import React from 'react';
import { useQuery, useInfiniteQuery, keepPreviousData, type InfiniteData } from '@tanstack/react-query';
import { supabase } from '@mobile/lib/supabase';
import { queryKeys } from '@/lib/queryKeys';
import { queryClient } from '@/lib/queryClient';
import { useCurrentUserId } from '@/hooks/useCurrentUserId';
import { useDebounce } from '@/hooks/useDebounce';
import { createTagColorMap, mapSearchResult } from '@/lib/mappers';
import type { DateFilterValue, ReadFilterValue, TypeFilterValue, SearchResult, SearchRow } from '@/screens/Search/types';

const PAGE_SIZE = 10;

type SearchFilters = {
  domain: string | null;
  date: DateFilterValue;
  read: ReadFilterValue;
  type: TypeFilterValue;
};


function dateThreshold(filter: DateFilterValue): string | null {
  if (filter === 'all') return null;
  const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 365;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function buildQuery<T>(base: T, term: string, filters: SearchFilters, isTagQuery: boolean): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = base;

  if (!isTagQuery && term.trim()) {
    const pat = `%${term.trim().replace(/[%_]/g, '')}%`;
    q = q.or(`title.ilike.${pat},description.ilike.${pat},domain.ilike.${pat},url.ilike.${pat}`);
  }

  if (filters.type !== 'all') q = q.eq('type', filters.type);
  if (filters.domain) q = q.eq('domain', filters.domain);
  const threshold = dateThreshold(filters.date);
  if (threshold) q = q.gte('created_at', threshold);
  if (filters.read === 'read') q = q.eq('is_read', true);
  else if (filters.read === 'unread') q = q.eq('is_read', false);

  return q;
}

async function fetchSearchCount(
  userId: string,
  term: string,
  filters: SearchFilters,
  isTagQuery: boolean,
): Promise<number> {
  let q = supabase
    .from('items_with_links')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  q = buildQuery(q, term, filters, isTagQuery);

  const { count, error } = await q;
  if (error) {
    console.error('[search-count]', error);
    throw new Error('Error al contar resultados');
  }
  return count ?? 0;
}

async function fetchSearchPage(
  userId: string,
  term: string,
  filters: SearchFilters,
  isTagQuery: boolean,
  pageIndex: number,
): Promise<SearchResult[]> {
  let q = supabase
    .from('items_with_links')
    .select('id,type,title,description,domain,url,created_at,is_read,tags,og_image_url,preview_image_url,favicon_url,metadata(og_title)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);

  q = buildQuery(q, term, filters, isTagQuery);

  const [{ data, error: fetchError }, { data: tagRows }] = await Promise.all([
    q,
    supabase.from('tags').select('name,slug,color_hex').eq('user_id', userId),
  ]);

  if (fetchError) {
    console.error('[search-page]', fetchError);
    throw new Error('No se pudieron cargar los recursos.');
  }

  const tagColorMap = createTagColorMap((tagRows ?? []) as { name: string; slug: string | null; color_hex: string | null }[]);

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
  const [selectedType, setSelectedType] = React.useState<TypeFilterValue>('all');

  const tagFromQuery = debouncedQuery.trim().startsWith('#')
    ? debouncedQuery.trim().slice(1).toLowerCase()
    : null;
  const isTagQuery = tagFromQuery !== null;
  const effectiveTag = tagFromQuery ?? (selectedTag ? selectedTag.toLowerCase() : null);

  const filters: SearchFilters = {
    domain: selectedDomain,
    date: selectedDate,
    read: selectedRead,
    type: selectedType,
  };

  const { data: allTagsData } = useQuery({
    queryKey: queryKeys.tags(userId ?? ''),
    queryFn: async () => {
      const { data } = await supabase
        .from('tags')
        .select('name,slug,color_hex')
        .eq('user_id', userId!)
        .order('name');
      return (data ?? []) as { name: string; slug: string | null; color_hex: string | null }[];
    },
    enabled: Boolean(userId),
    staleTime: 0,
  });

  // Domain options: same filters as main query but WITHOUT domain filter,
  // so available domains stay visible even after one is selected
  const { data: domainOptions = [] } = useQuery({
    queryKey: ['search', 'domains', userId, debouncedQuery, selectedDate, selectedRead, selectedType],
    queryFn: async () => {
      const base = supabase
        .from('items_with_links')
        .select('domain')
        .eq('user_id', userId!)
        .not('domain', 'is', null)
        .limit(200);

      const q = buildQuery(base, debouncedQuery, { domain: null, date: selectedDate, read: selectedRead, type: selectedType }, isTagQuery);

      const { data } = await q;
      return Array.from(
        new Set((data ?? []).map((r: { domain: string }) => r.domain).filter(Boolean)),
      ).slice(0, 20) as string[];
    },
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });

  const { data: serverCount = 0 } = useQuery({
    queryKey: ['search', 'count', userId, debouncedQuery, selectedDomain, selectedDate, selectedRead, selectedType],
    queryFn: () => fetchSearchCount(userId!, debouncedQuery, filters, isTagQuery),
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
    queryKey: ['search', userId, debouncedQuery, selectedDomain, selectedDate, selectedRead, selectedType],
    queryFn: ({ pageParam }) =>
      fetchSearchPage(userId!, debouncedQuery, filters, isTagQuery, (pageParam as number) ?? 0),
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

  // Tag filter stays client-side: the tags column in the view uses json_agg
  // and the @> operator doesn't work reliably on JSON arrays via PostgREST
  const filteredResults = React.useMemo(
    () =>
      effectiveTag
        ? results.filter((r) => r.tags.some((t) => t.name.toLowerCase() === effectiveTag))
        : results,
    [results, effectiveTag],
  );

  const totalCount = effectiveTag ? filteredResults.length : serverCount;

  const error = queryError ? 'No se pudieron cargar los recursos.' : '';

  const loadMore = React.useCallback(() => {
    if (!loadingMore && hasNextPage) void fetchNextPage();
  }, [loadingMore, hasNextPage, fetchNextPage]);

  const handleToggleRead = React.useCallback(async (itemId: string, nextRead: boolean) => {
    const queryKey = ['search', userId, debouncedQuery, selectedDomain, selectedDate, selectedRead, selectedType];

    queryClient.setQueryData<InfiniteData<SearchResult[]>>(queryKey, (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) =>
          page.map((item) => item.id === itemId ? { ...item, isRead: nextRead } : item),
        ),
      };
    });

    const { error } = await supabase
      .from('items')
      .update({ is_read: nextRead, updated_at: new Date().toISOString() })
      .eq('id', itemId);

    if (error) {
      queryClient.setQueryData<InfiniteData<SearchResult[]>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.map((item) => item.id === itemId ? { ...item, isRead: !nextRead } : item),
          ),
        };
      });
    }
  }, [userId, debouncedQuery, selectedDomain, selectedDate, selectedRead, selectedType]);

  const clearFilters = React.useCallback(() => {
    setSelectedDomain(null);
    setSelectedTag(null);
    setSelectedDate('all');
    setSelectedRead('all');
    setSelectedType('all');
    setQuery((q) => (q.trim().startsWith('#') ? '' : q));
  }, []);


  const hasActiveFilters =
    selectedDomain !== null ||
    selectedTag !== null ||
    tagFromQuery !== null ||
    selectedDate !== 'all' ||
    selectedRead !== 'all' ||
    selectedType !== 'all';

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
    tagOptions: allUserTags,
    allUserTags,
    selectedDomain,
    setSelectedDomain,
    selectedTag,
    setSelectedTag,
    selectedDate,
    setSelectedDate,
    selectedRead,
    setSelectedRead,
    selectedType,
    setSelectedType,
    hasActiveFilters,
    tagFromQuery,
    clearFilters,
    handleToggleRead,
  };
}

export type { SearchResult };
