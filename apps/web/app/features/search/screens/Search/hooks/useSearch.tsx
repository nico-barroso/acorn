import { useCallback, useEffect, useRef, useState } from 'react'
import { getSupabaseBrowserClient } from '../../../../../../lib/supabase/client'

export type SearchResultRow = {
  id: string
  type: string
  title: string | null
  description: string | null
  domain: string | null
  is_read: boolean
  created_at: string
  tags: string[] | null
}

export type SearchResult = {
  id: string
  title: string
  description: string
  domain: string
  createdAtLabel: string
  isRead: boolean
  tags: string[]
}

function mapResult(row: SearchResultRow): SearchResult {
  return {
    id: row.id,
    title: row.title?.trim() || row.domain || 'Recurso sin titulo',
    description: row.description?.trim() || 'Sin descripcion disponible.',
    domain: row.domain || 'Sin dominio',
    createdAtLabel: new Date(row.created_at).toLocaleDateString(),
    isRead: Boolean(row.is_read),
    tags: row.tags?.filter(Boolean) ?? []
  }
}

export function highlightText(text: string, term: string): React.ReactNode[] {
  if (!term) return [text]

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

function deduplicateById(items: SearchResult[]): SearchResult[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

export function useSearch(query: string, userId: string) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const search = useCallback(async (searchQuery: string, uid: string) => {
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const trimmed = searchQuery.trim()

      const [rpcResult, likeResult] = await Promise.all([
        supabase.rpc('search_items', {
          p_user_id: uid,
          p_query: trimmed,
          p_limit: 20
        }),
        supabase
          .from('items_with_links')
          .select('id,title,description,domain,is_read,created_at,tags')
          .eq('user_id', uid)
          .or(`title.ilike.%${trimmed}%,description.ilike.%${trimmed}%,domain.ilike.%${trimmed}%`)
          .order('created_at', { ascending: false })
          .limit(20)
      ])

      if (controller.signal.aborted) return

      if (rpcResult.error && likeResult.error) {
        setError('No se pudo realizar la busqueda. Intentalo de nuevo.')
        setResults([])
        return
      }

      const rpcRows = (rpcResult.data ?? []) as SearchResultRow[]
      const likeRows = (likeResult.data ?? []) as SearchResultRow[]

      const combined = deduplicateById([...rpcRows, ...likeRows].map(mapResult))
      combined.sort((a, b) => b.createdAtLabel.localeCompare(a.createdAtLabel))

      setResults(combined)
    } catch {
      if (!controller.signal.aborted) {
        setError('Error de conexion. Intentalo de nuevo.')
        setResults([])
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    if (!query.trim()) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }

    const timeout = setTimeout(() => {
      search(query, userId)
    }, 300)

    return () => {
      clearTimeout(timeout)
      abortRef.current?.abort()
    }
  }, [query, userId, search])

  return { results, loading, error, setResults }
}