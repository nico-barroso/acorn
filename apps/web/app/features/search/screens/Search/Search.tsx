'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '../../../../lib/supabase'
import { useToggleRead } from '../../../../hooks/useToggleRead'
import { highlightText, useSearch } from './hooks/useSearch'
import { searchStyles } from './Search.styles'

export function Search() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [query, setQuery] = useState('')
  const [authLoading, setAuthLoading] = useState(true)
  const { results, loading, error, setResults } = useSearch(query, userId)
  const { toggleRead } = useToggleRead()

  const handleToggleRead = useCallback(async (itemId: string, currentIsRead: boolean) => {
    setResults((current) =>
      current.map((r) => (r.id === itemId ? { ...r, isRead: !currentIsRead } : r))
    )

    const success = await toggleRead(itemId, currentIsRead)

    if (!success) {
      setResults((current) =>
        current.map((r) => (r.id === itemId ? { ...r, isRead: currentIsRead } : r))
      )
    }
  }, [toggleRead, setResults])

  useEffect(() => {
    let active = true
    const supabase = getSupabaseBrowserClient()

    const checkSession = async () => {
      const { data, error: authError } = await supabase.auth.getUser()

      if (!active) return

      if (authError || !data.user) {
        router.replace('/login')
        return
      }

      setUserId(data.user.id)
      setAuthLoading(false)
    }

    checkSession()

    return () => {
      active = false
    }
  }, [router])

  if (authLoading) {
    return (
      <main style={searchStyles.page}>
        <p style={searchStyles.loading}>Cargando...</p>
      </main>
    )
  }

  const showInitial = !query.trim()
  const showEmpty = !loading && !error && query.trim() && results.length === 0
  const showResults = results.length > 0

  return (
    <main style={searchStyles.page}>
      <header style={searchStyles.header}>
        <h1 style={searchStyles.title}>Busqueda</h1>
        <p style={searchStyles.subtitle}>
          Busca recursos por titulo, descripcion o dominio. Los resultados aparecen en tiempo real mientras escribes.
        </p>
      </header>

      <div style={searchStyles.inputWrapper}>
        <span style={searchStyles.searchIcon} aria-hidden>&#128269;</span>
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Busca recursos por titulo, descripcion o dominio...'
          style={searchStyles.searchInput}
          aria-label='Buscar recursos'
          autoComplete='off'
        />
      </div>
      <p style={searchStyles.inputHint}>
        {query.trim() ? `${results.length} resultado${results.length === 1 ? '' : 's'} para «${query}»` : 'Escribe para buscar recursos'}
      </p>

      {error ? (
        <section style={searchStyles.emptyState}>
          <p style={searchStyles.errorText}>{error}</p>
          <button
            type='button'
            style={searchStyles.retryButton}
            onClick={() => setQuery(query)}
          >
            Reintentar
          </button>
        </section>
      ) : null}

      {showInitial ? (
        <section style={searchStyles.initialState}>
          <p style={searchStyles.initialStateText}>
            Escribe algo en el campo de arriba para buscar entre tus recursos guardados.
          </p>
        </section>
      ) : null}

      {showEmpty && !error ? (
        <section style={searchStyles.emptyState}>
          <h2 style={searchStyles.emptyTitle}>Sin resultados</h2>
          <p style={searchStyles.emptyText}>
            No se encontraron recursos para «{query}». Prueba con otras palabras clave.
          </p>
        </section>
      ) : null}

      {loading ? (
        <section style={searchStyles.resultsGrid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={`skeleton-${index}`} style={searchStyles.skeletonCard}>
              <div style={{ ...searchStyles.skeletonLine, ...searchStyles.skeletonLineLong }} />
              <div style={{ ...searchStyles.skeletonLine, ...searchStyles.skeletonLineMedium }} />
              <div style={{ ...searchStyles.skeletonLine, ...searchStyles.skeletonLineShort }} />
            </article>
          ))}
        </section>
      ) : null}

      {showResults ? (
        <section style={searchStyles.resultsGrid} className='search-grid'>
          {results.map((result) => (
            <article key={result.id} style={searchStyles.resourceCard}>
              <div style={searchStyles.cardTopRow}>
                <h2 style={searchStyles.resourceTitle}>
                  {highlightText(result.title, query)}
                </h2>
                <span style={searchStyles.domainPill}>{result.domain}</span>
              </div>
              <p style={searchStyles.resourceMeta}>
                Guardado {result.createdAtLabel}
              </p>
              <p style={searchStyles.resourceSnippet}>
                {highlightText(result.description, query)}
              </p>
              {result.tags.length > 0 ? (
                <div style={searchStyles.tagsRow}>
                  {result.tags.map((tag) => (
                    <span key={tag} style={searchStyles.tagPill}>{tag}</span>
                  ))}
                </div>
              ) : null}
<button
                  type='button'
                  onClick={() => void handleToggleRead(result.id, result.isRead)}
                  style={result.isRead ? searchStyles.statusBadgeRead : searchStyles.statusBadge}
                  aria-label={result.isRead ? 'Marcar como no visto' : 'Marcar como visto'}
                >
                  {result.isRead ? 'Visto' : 'No visto'}
                </button>
            </article>
          ))}
        </section>
      ) : null}

      <style jsx>{`
        @media (max-width: 900px) {
          .search-grid {
            grid-template-columns: 1fr;
          }
        }

        @keyframes skeletonPulse {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </main>
  )
}