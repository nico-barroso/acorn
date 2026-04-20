import React from 'react';
import { supabase } from '../../../../lib/supabase';
import type { DateFilterValue, ReadFilterValue, SearchResult, SearchRow } from '../types';

const PAGE_SIZE = 15;

function mapSearchResult(row: SearchRow): SearchResult {
  return {
    id: row.id,
    title: row.title?.trim() || row.domain || row.url || 'Recurso sin titulo',
    domain: row.domain || 'Dominio no disponible',
    snippet: row.description?.trim() || row.url || 'Sin descripcion',
    url: row.url || '',
    createdAt: row.created_at,
    isRead: Boolean(row.is_read),
    tags: (row.tags ?? []).filter(Boolean),
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

export function useSearch() {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [selectedDomain, setSelectedDomain] = React.useState<string | null>(null);
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<DateFilterValue>('all');
  const [selectedRead, setSelectedRead] = React.useState<ReadFilterValue>('all');

  const fetchPage = React.useCallback(async (term: string, pageIndex: number, append: boolean) => {
    pageIndex === 0 ? setLoading(true) : setLoadingMore(true);
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setLoadingMore(false);
      setError('Debes iniciar sesion para ver tus recursos.');
      return;
    }

    let queryBuilder = supabase
      .from('items_with_links')
      .select('id,title,description,domain,url,created_at,is_read,tags')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);

    if (term.trim()) {
      const termPattern = `%${term.trim().replace(/[%_]/g, '')}%`;
      queryBuilder = queryBuilder.or(
        `title.ilike.${termPattern},description.ilike.${termPattern},domain.ilike.${termPattern},url.ilike.${termPattern}`,
      );
    }

    const { data, error: fetchError } = await queryBuilder;

    setLoading(false);
    setLoadingMore(false);

    if (fetchError) {
      setError('No se pudieron cargar los recursos.');
      return;
    }

    const mapped = ((data ?? []) as SearchRow[]).map(mapSearchResult);
    setHasMore(mapped.length === PAGE_SIZE);
    setResults((prev) => (append ? [...prev, ...mapped] : mapped));
  }, []);

  const loadMore = React.useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    void fetchPage(query, nextPage, true);
  }, [loadingMore, hasMore, page, query, fetchPage]);

  const clearFilters = React.useCallback(() => {
    setSelectedDomain(null);
    setSelectedTag(null);
    setSelectedDate('all');
    setSelectedRead('all');
  }, []);

  // Reset y carga inicial cuando cambia la query
  React.useEffect(() => {
    setPage(0);
    setHasMore(true);
    const timer = setTimeout(() => {
      void fetchPage(query, 0, false);
    }, 260);
    return () => clearTimeout(timer);
  }, [query, fetchPage]);

  const domainOptions = React.useMemo(
    () => Array.from(new Set(results.map((r) => r.domain).filter(Boolean))).slice(0, 20),
    [results],
  );

  const tagOptions = React.useMemo(
    () =>
      Array.from(
        new Set(results.flatMap((r) => r.tags.map((t) => t.trim()).filter(Boolean))),
      ).slice(0, 30),
    [results],
  );

  const filteredResults = React.useMemo(
    () =>
      results.filter((result) => {
        if (selectedDomain && result.domain !== selectedDomain) return false;
        if (selectedTag && !result.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase()))
          return false;
        if (!applyDateFilter(result.createdAt, selectedDate)) return false;
        if (selectedRead === 'read' && !result.isRead) return false;
        if (selectedRead === 'unread' && result.isRead) return false;
        return true;
      }),
    [results, selectedDate, selectedDomain, selectedRead, selectedTag],
  );

  const hasActiveFilters =
    selectedDomain !== null ||
    selectedTag !== null ||
    selectedDate !== 'all' ||
    selectedRead !== 'all';

  return {
    query,
    setQuery,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    error,
    filteredResults,
    results,
    domainOptions,
    tagOptions,
    selectedDomain,
    setSelectedDomain,
    selectedTag,
    setSelectedTag,
    selectedDate,
    setSelectedDate,
    selectedRead,
    setSelectedRead,
    hasActiveFilters,
    clearFilters,
  };
}

export type { SearchResult };
