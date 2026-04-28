import React from 'react';
import { supabase } from '../../../../lib/supabase';
import type { DateFilterValue, ReadFilterValue, SearchResult, SearchRow } from '../types';

const PAGE_SIZE = 15;

const FILE_ICON = require('../../../../assets/favicon.png');

function isImageUrl(url: string): boolean {
  return /\.(jpe?g|png|gif|webp|heic|bmp|tiff?)(\?|$)/i.test(url);
}

function mapSearchResult(row: SearchRow, tagColorMap: Map<string, string | null>): SearchResult {
  const isFile = row.type === 'file';
  const fileUrl = row.url || '';
  const fileThumbnail = isFile && fileUrl && isImageUrl(fileUrl) ? fileUrl : undefined;
  return {
    id: row.id,
    title: row.title?.trim() || row.domain || row.url || 'Recurso sin titulo',
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

export function useSearch() {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [allUserTags, setAllUserTags] = React.useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = React.useState<string | null>(null);
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<DateFilterValue>('all');
  const [selectedRead, setSelectedRead] = React.useState<ReadFilterValue>('all');

  const fetchUserTags = React.useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;
    const { data } = await supabase.from('tags').select('name').eq('user_id', user.id).order('name');
    setAllUserTags(((data ?? []) as { name: string }[]).map((t) => t.name));
  }, []);

  React.useEffect(() => {
    void fetchUserTags();
  }, [fetchUserTags]);

  const fetchPage = React.useCallback(async (term: string, pageIndex: number, append: boolean) => {
    pageIndex === 0 ? setLoading(true) : setLoadingMore(true);
    setError('');

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      setLoading(false);
      setLoadingMore(false);
      setError('Debes iniciar sesion para ver tus recursos.');
      return;
    }

    const isTagQuery = term.trim().startsWith('#');
    const backendTerm = isTagQuery ? '' : term;

    let queryBuilder = supabase
      .from('items_with_links')
      .select('id,type,title,description,domain,url,created_at,is_read,tags,og_image_url,preview_image_url,favicon_url')
      .eq('user_id', user.id)
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
      supabase.from('tags').select('name,color_hex').eq('user_id', user.id),
    ]);

    const tagColorMap = new Map(
      ((tagRows ?? []) as { name: string; color_hex: string | null }[]).map((t) => [t.name, t.color_hex]),
    );

    setLoading(false);
    setLoadingMore(false);

    if (fetchError) {
      setError('No se pudieron cargar los recursos.');
      return;
    }

    const mapped = ((data ?? []) as SearchRow[]).map((row) => mapSearchResult(row, tagColorMap));
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
    setQuery((q) => (q.trim().startsWith('#') ? '' : q));
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
    hasMore,
    loadMore,
    error,
    filteredResults,
    results,
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
