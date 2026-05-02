import { useCallback, useEffect, useRef, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { TagItem } from '@/features/shared/components/ResourceCard/ResourceCard'

export type SearchResultRow = {
  id: string
  type: string
  title: string | null
  description: string | null
  domain: string | null
  url: string | null
  is_read: boolean
  created_at: string
  tags: string[] | null
}

export type SearchResult = {
  id: string
  title: string
  description: string
  domain: string
  url: string | null
  createdAtLabel: string
  isRead: boolean
  tags: TagItem[]
}

export type DateFilterValue = 'all' | '7d' | '30d' | '365d'
export type ReadFilterValue = 'all' | 'unread' | 'read'
export type TypeFilterValue = 'all' | 'link' | 'file'

const PAGE_SIZE = 20

function mapResult(row: SearchResultRow, tagColorMap: Map<string, string | null>): SearchResult {
  return {
    id: row.id,
    title: row.title?.trim() || row.domain || 'Recurso sin titulo',
    description: row.description?.trim() || 'Sin descripcion disponible.',
    domain: row.domain || 'Sin dominio',
    url: row.url ?? null,
    createdAtLabel: new Date(row.created_at).toLocaleDateString(),
    isRead: Boolean(row.is_read),
    tags: (row.tags ?? []).filter(Boolean).map((name) => ({ name, color_hex: tagColorMap.get(name) ?? tagColorMap.get(name.toLowerCase()) ?? null })),
  }
}

function deduplicateById(items: SearchResult[]): SearchResult[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

function dateThreshold(filter: DateFilterValue): string | null {
  if (filter === 'all') return null
  const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 365
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilters(q: any, term: string, isTagQuery: boolean, filters: {
  selectedDomain: string | null
  selectedDate: DateFilterValue
  selectedRead: ReadFilterValue
  selectedType: TypeFilterValue
}) {
  if (!isTagQuery && term.trim()) {
    const pat = `%${term.trim().replace(/[%_]/g, '')}%`
    q = q.or(`title.ilike.${pat},description.ilike.${pat},domain.ilike.${pat}`)
  }
  if (filters.selectedType !== 'all') q = q.eq('type', filters.selectedType)
  if (filters.selectedDomain) q = q.eq('domain', filters.selectedDomain)
  const threshold = dateThreshold(filters.selectedDate)
  if (threshold) q = q.gte('created_at', threshold)
  if (filters.selectedRead === 'read') q = q.eq('is_read', true)
  else if (filters.selectedRead === 'unread') q = q.eq('is_read', false)
  return q
}

export function highlightText(text: string, term: string): React.ReactNode[] {
  if (!term || term.startsWith('#')) return [text]

  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  const nodes: React.ReactNode[] = []
  parts.forEach((part, i) => {
    if (regex.test(part)) {
      nodes.push(
        <mark key={`${i}-${part}`} style={{ backgroundColor: '#a14d3620', color: '#43281C', borderRadius: 3, padding: '0 2px' }}>
          {part}
        </mark>
      )
    } else {
      nodes.push(part)
    }
    regex.lastIndex = 0
  })

  return nodes
}

type FiltersSnapshot = {
  query: string
  selectedDomain: string | null
  selectedDate: DateFilterValue
  selectedRead: ReadFilterValue
  selectedType: TypeFilterValue
  selectedTag: string | null
}

export function useSearch(userId: string) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<DateFilterValue>('all')
  const [selectedRead, setSelectedRead] = useState<ReadFilterValue>('all')
  const [selectedType, setSelectedType] = useState<TypeFilterValue>('all')

  const [domainOptions, setDomainOptions] = useState<string[]>([])
  const [allUserTags, setAllUserTags] = useState<string[]>([])

  const tagColorMapRef = useRef<Map<string, string | null>>(new Map())
  const abortRef = useRef<AbortController | null>(null)
  const pageRef = useRef(0)
  const filtersRef = useRef<FiltersSnapshot>({
    query: '',
    selectedDomain: null,
    selectedDate: 'all',
    selectedRead: 'all',
    selectedType: 'all',
    selectedTag: null,
  })

  const trimmedQuery = query.trim()
  const tagFromQuery = trimmedQuery.startsWith('#') ? trimmedQuery.slice(1).toLowerCase() : null
  const isTagQuery = tagFromQuery !== null
  const effectiveTag = tagFromQuery ?? (selectedTag?.toLowerCase() ?? null)

  const hasActiveFilters =
    selectedDomain !== null ||
    selectedTag !== null ||
    tagFromQuery !== null ||
    selectedDate !== 'all' ||
    selectedRead !== 'all' ||
    selectedType !== 'all'

  // Fetch user tags list (with colors)
  useEffect(() => {
    if (!userId) return
    const supabase = getSupabaseBrowserClient()
    supabase
      .from('tags')
      .select('name,slug,color_hex')
      .eq('user_id', userId)
      .order('name')
      .then(({ data }) => {
        const rows = (data ?? []) as { name: string; slug: string | null; color_hex: string | null }[]
        setAllUserTags(rows.map((t) => t.name))
        const map = new Map<string, string | null>()
        rows.forEach((t) => {
          map.set(t.name, t.color_hex)
          if (t.slug) map.set(t.slug, t.color_hex)
          map.set(t.name.toLowerCase(), t.color_hex)
        })
        tagColorMapRef.current = map
      })
  }, [userId])

  // Fetch available domain options (without domain filter so choices stay visible)
  useEffect(() => {
    if (!userId) return
    const supabase = getSupabaseBrowserClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase
      .from('items_with_links')
      .select('domain')
      .eq('user_id', userId)
      .not('domain', 'is', null)
      .limit(200)

    const threshold = dateThreshold(selectedDate)
    if (threshold) q = q.gte('created_at', threshold)
    if (selectedRead === 'read') q = q.eq('is_read', true)
    else if (selectedRead === 'unread') q = q.eq('is_read', false)
    if (selectedType !== 'all') q = q.eq('type', selectedType)

    q.then(({ data }: { data: { domain: string }[] | null }) => {
      const domains = Array.from(
        new Set((data ?? []).map((r) => r.domain).filter(Boolean))
      ).slice(0, 20) as string[]
      setDomainOptions(domains)
    })
  }, [userId, selectedDate, selectedRead, selectedType])

  // Main search: re-runs on filter/query change, resets to page 0
  useEffect(() => {
    if (!userId) return

    const noQueryNoFilters =
      !trimmedQuery &&
      selectedDomain === null &&
      selectedTag === null &&
      selectedDate === 'all' &&
      selectedRead === 'all' &&
      selectedType === 'all'

    if (noQueryNoFilters) {
      abortRef.current?.abort()
      setResults([])
      setTotalCount(0)
      setHasMore(false)
      setLoading(false)
      setError(null)
      return
    }

    const snapshot: FiltersSnapshot = {
      query: trimmedQuery,
      selectedDomain,
      selectedDate,
      selectedRead,
      selectedType,
      selectedTag,
    }
    filtersRef.current = snapshot
    pageRef.current = 0

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const doSearch = async () => {
      setLoading(true)
      setError(null)
      setResults([])
      setHasMore(false)
      setTotalCount(0)

      try {
        const supabase = getSupabaseBrowserClient()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let q: any = supabase
          .from('items_with_links')
          .select('id,type,title,description,domain,url,is_read,created_at,tags', { count: 'exact' })
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(0, PAGE_SIZE - 1)

        q = applyFilters(q, trimmedQuery, isTagQuery, snapshot)

        if (controller.signal.aborted) return

        const { data, count, error: fetchError } = await q

        if (controller.signal.aborted) return

        if (fetchError) {
          setError('No se pudo realizar la búsqueda.')
          return
        }

        const rows = (data ?? []) as SearchResultRow[]
        setResults(rows.map((row) => mapResult(row, tagColorMapRef.current)))
        setTotalCount(count ?? 0)
        setHasMore((count ?? 0) > PAGE_SIZE)
      } catch {
        if (!controller.signal.aborted) {
          setError('Error de conexión. Inténtalo de nuevo.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    const timeout = setTimeout(doSearch, 300)
    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [userId, trimmedQuery, selectedDomain, selectedDate, selectedRead, selectedType, selectedTag, isTagQuery])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !userId) return

    setLoadingMore(true)
    const nextPage = pageRef.current + 1
    const snap = filtersRef.current
    const isTag = snap.query.startsWith('#')

    try {
      const supabase = getSupabaseBrowserClient()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q: any = supabase
        .from('items_with_links')
        .select('id,type,title,description,domain,url,is_read,created_at,tags')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(nextPage * PAGE_SIZE, (nextPage + 1) * PAGE_SIZE - 1)

      q = applyFilters(q, snap.query, isTag, snap)

      const { data, error: fetchError } = await q

      if (fetchError) return

      const rows = (data ?? []) as SearchResultRow[]
      setResults((prev) => deduplicateById([...prev, ...rows.map((row) => mapResult(row, tagColorMapRef.current))]))
      pageRef.current = nextPage
      setHasMore(rows.length === PAGE_SIZE)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, userId])

  const clearFilters = useCallback(() => {
    setSelectedDomain(null)
    setSelectedTag(null)
    setSelectedDate('all')
    setSelectedRead('all')
    setSelectedType('all')
    setQuery((q) => (q.trim().startsWith('#') ? '' : q))
  }, [])

  const handleToggleRead = useCallback(async (itemId: string, currentIsRead: boolean) => {
    setResults((curr) =>
      curr.map((r) => (r.id === itemId ? { ...r, isRead: !currentIsRead } : r))
    )
    const supabase = getSupabaseBrowserClient()
    const { error: updateError } = await supabase
      .from('items')
      .update({ is_read: !currentIsRead, updated_at: new Date().toISOString() })
      .eq('id', itemId)

    if (updateError) {
      setResults((curr) =>
        curr.map((r) => (r.id === itemId ? { ...r, isRead: currentIsRead } : r))
      )
    }
  }, [])

  const filteredResults = effectiveTag
    ? results.filter((r) => r.tags.some((t) => t.name.toLowerCase() === effectiveTag))
    : results

  const displayCount = effectiveTag ? filteredResults.length : totalCount

  return {
    query,
    setQuery,
    loading,
    loadingMore,
    loadMore,
    hasMore,
    error,
    results: filteredResults,
    totalCount: displayCount,
    domainOptions,
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
  }
}
