'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { ResourceCard } from '@/features/shared/components/ResourceCard/ResourceCard'
import { highlightText, useSearch } from './hooks/useSearch'
import type { DateFilterValue, ReadFilterValue, TypeFilterValue } from './hooks/useSearch'
import { searchStyles } from './Search.styles'
import { colors } from '@/theme/colors'
import { AcornLoader } from '@/features/shared/components/AcornLoader/AcornLoader'
import { usePageLoader } from '@/hooks/usePageLoader'

// ─── Background gradient ─────────────────────────────────────────────────────

function SearchGradient() {
  return <div aria-hidden style={searchStyles.gradient} />
}

// ─── Hero decoration ─────────────────────────────────────────────────────────

function SearchHeroDecoration() {
  return (
    <div aria-hidden style={searchStyles.heroDecoration}>
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 800 180"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path d="M-100 15 C 200 110, 600 110, 900 15" stroke="rgba(192,110,82,0.2)" strokeWidth="1.5" />
        <path d="M-100 60 C 200 150, 600 150, 900 60" stroke="rgba(192,110,82,0.12)" strokeWidth="1.2" />
        <path d="M 60 -5 C 280 75, 520 75, 740 -5" stroke="rgba(161,77,54,0.14)" strokeWidth="1" />
        <path d="M-50 130 C 200 50, 600 50, 850 130" stroke="rgba(192,110,82,0.07)" strokeWidth="1" />
      </svg>
    </div>
  )
}

// ─── Acorn icon ───────────────────────────────────────────────────────────────

function AcornIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.56348 13.1575C3.56348 10.4325 5.77253 8.22344 8.49753 8.22344H12.8834H17.2692C19.9942 8.22344 22.2032 10.4325 22.2032 13.1575V19.325C22.2032 20.8963 21.4548 22.3737 20.188 23.3032L17.8885 24.9903L15.1831 27.1959C14.2313 27.9718 12.8796 28.02 11.8749 27.314L8.5686 24.9903L5.86001 23.2771C4.43024 22.3728 3.56348 20.799 3.56348 19.1072L3.56348 13.1575Z" fill="#C06E52"/>
      <path d="M12.6816 9.06523C12.472 9.48612 11.8646 9.46523 11.6844 9.03093L10.6343 6.4994C10.5808 6.37025 10.5078 6.25006 10.4178 6.143L9.04289 4.50618C8.40213 3.74337 8.76347 2.57344 9.72279 2.30483L15.5223 0.680968C16.2889 0.466308 16.8828 1.35755 16.3895 1.98241L15.9867 2.49263C15.9282 2.56668 15.8775 2.64656 15.8355 2.73101L12.6816 9.06523Z" fill="#C06E52"/>
      <path d="M1.24612e-06 11.1814C1.24612e-06 9.54775 1.32431 8.22344 2.95793 8.22344H22.5347C24.1683 8.22344 25.4926 9.54775 25.4926 11.1814C25.4926 13.3635 23.2106 14.7944 21.2463 13.844L15.7134 11.1668C13.8393 10.2599 11.6533 10.2599 9.77921 11.1668L4.24629 13.844C2.28204 14.7944 1.24612e-06 13.3635 1.24612e-06 11.1814Z" fill="#43281C"/>
    </svg>
  )
}

// ─── QuickFilters ─────────────────────────────────────────────────────────────

const QUICK_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'unread', label: 'Sin ver' },
  { id: 'new', label: 'Nuevos' },
]

type QuickFiltersProps = {
  activeQuickFilter: string | null
  hasManualFilters: boolean
  showFilterPanel: boolean
  onQuickFilter: (id: string) => void
  onToggleFilterPanel: () => void
}

function QuickFilters({
  activeQuickFilter,
  hasManualFilters,
  showFilterPanel,
  onQuickFilter,
  onToggleFilterPanel,
}: QuickFiltersProps) {
  return (
    <div style={searchStyles.quickFiltersRow}>
      <button
        type="button"
        style={{
          ...searchStyles.pill,
          ...(hasManualFilters || showFilterPanel ? searchStyles.pillFilterActive : {}),
        }}
        onClick={onToggleFilterPanel}
      >
        <svg width="13" height="11" viewBox="0 0 16 12" fill="none">
          <path d="M1 1H15M3.5 6H12.5M6 11H10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        Filtros
      </button>

      {QUICK_FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          style={{
            ...searchStyles.pill,
            ...(activeQuickFilter === f.id ? searchStyles.pillActive : {}),
          }}
          onClick={() => onQuickFilter(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

// ─── FilterPanel ──────────────────────────────────────────────────────────────

const DATE_OPTIONS: { label: string; value: DateFilterValue }[] = [
  { label: 'Todas', value: 'all' },
  { label: '7 días', value: '7d' },
  { label: '30 días', value: '30d' },
  { label: '12 meses', value: '365d' },
]

const READ_OPTIONS: { label: string; value: ReadFilterValue }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'No visto', value: 'unread' },
  { label: 'Visto', value: 'read' },
]

const TYPE_OPTIONS: { label: string; value: TypeFilterValue }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Enlace', value: 'link' },
  { label: 'Archivo', value: 'file' },
]

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <button
      type="button"
      style={{ ...searchStyles.chip, ...(active ? searchStyles.chipActive : {}) }}
      onClick={onPress}
    >
      {label}
    </button>
  )
}

type FilterPanelProps = {
  domains: string[]
  tags: string[]
  selectedDomain: string | null
  selectedTag: string | null
  selectedDate: DateFilterValue
  selectedRead: ReadFilterValue
  selectedType: TypeFilterValue
  onSelectDomain: (d: string | null) => void
  onSelectTag: (t: string | null) => void
  onSelectDate: (d: DateFilterValue) => void
  onSelectRead: (r: ReadFilterValue) => void
  onSelectType: (t: TypeFilterValue) => void
  onClear: () => void
}

function FilterPanel({
  domains, tags, selectedDomain, selectedTag, selectedDate, selectedRead, selectedType,
  onSelectDomain, onSelectTag, onSelectDate, onSelectRead, onSelectType, onClear,
}: FilterPanelProps) {
  const [showAllDomains, setShowAllDomains] = useState(false)

  return (
    <div style={searchStyles.filterPanel}>
      <div style={searchStyles.filterPanelHeader}>
        <p style={searchStyles.filterPanelTitle}>Filtros</p>
        <button type="button" style={searchStyles.clearButton} onClick={onClear}>Limpiar</button>
      </div>

      <div style={searchStyles.filterSection}>
        <span style={searchStyles.filterSectionLabel}>Dominio</span>
        <div style={searchStyles.chipsWrap}>
          <Chip label="Todos" active={selectedDomain === null} onPress={() => onSelectDomain(null)} />
          {!showAllDomains ? (
            <>
              {domains.slice(0, 3).map((d) => (
                <Chip key={d} label={d} active={selectedDomain === d} onPress={() => onSelectDomain(selectedDomain === d ? null : d)} />
              ))}
              {domains.length > 4 && <Chip label="más..." active={false} onPress={() => setShowAllDomains(true)} />}
            </>
          ) : (
            <>
              {domains.map((d) => (
                <Chip key={d} label={d} active={selectedDomain === d} onPress={() => onSelectDomain(selectedDomain === d ? null : d)} />
              ))}
              <Chip label="Ver menos" active={false} onPress={() => setShowAllDomains(false)} />
            </>
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div style={searchStyles.filterSection}>
          <span style={searchStyles.filterSectionLabel}>Etiqueta</span>
          <div style={searchStyles.chipsWrap}>
            <Chip label="Todas" active={selectedTag === null} onPress={() => onSelectTag(null)} />
            {tags.map((tag) => {
              const isActive = selectedTag?.toLowerCase() === tag.toLowerCase()
              return (
                <Chip key={tag} label={`#${tag}`} active={isActive} onPress={() => onSelectTag(isActive ? null : tag)} />
              )
            })}
          </div>
        </div>
      )}

      <div style={searchStyles.filterSection}>
        <span style={searchStyles.filterSectionLabel}>Fecha</span>
        <div style={searchStyles.chipsWrap}>
          {DATE_OPTIONS.map((o) => <Chip key={o.value} label={o.label} active={selectedDate === o.value} onPress={() => onSelectDate(o.value)} />)}
        </div>
      </div>

      <div style={searchStyles.filterSection}>
        <span style={searchStyles.filterSectionLabel}>Estado</span>
        <div style={searchStyles.chipsWrap}>
          {READ_OPTIONS.map((o) => <Chip key={o.value} label={o.label} active={selectedRead === o.value} onPress={() => onSelectRead(o.value)} />)}
        </div>
      </div>

      <div style={{ ...searchStyles.filterSection, marginBottom: 0 }}>
        <span style={searchStyles.filterSectionLabel}>Tipo</span>
        <div style={searchStyles.chipsWrap}>
          {TYPE_OPTIONS.map((o) => <Chip key={o.value} label={o.label} active={selectedType === o.value} onPress={() => onSelectType(o.value)} />)}
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <article style={searchStyles.skeletonCard}>
      <div style={{ ...searchStyles.skeletonLine, ...searchStyles.skeletonLineLong }} />
      <div style={{ ...searchStyles.skeletonLine, ...searchStyles.skeletonLineMedium }} />
      <div style={{ ...searchStyles.skeletonLine, ...searchStyles.skeletonLineShort }} />
    </article>
  )
}

// ─── Search screen ────────────────────────────────────────────────────────────

export function Search() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [authLoading, setAuthLoading] = useState(true)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const {
    query, setQuery,
    loading, loadingMore, loadMore, hasMore, error,
    results, totalCount,
    domainOptions, allUserTags,
    selectedDomain, setSelectedDomain,
    selectedTag, setSelectedTag,
    selectedDate, setSelectedDate,
    selectedRead, setSelectedRead,
    selectedType, setSelectedType,
    hasActiveFilters, tagFromQuery,
    clearFilters, handleToggleRead,
  } = useSearch(userId)

  useEffect(() => {
    let active = true
    const supabase = getSupabaseBrowserClient()
    const checkSession = async () => {
      const { data, error: authError } = await supabase.auth.getUser()
      if (!active) return
      if (authError || !data.user) { router.replace('/login'); return }
      setUserId(data.user.id)
      setAuthLoading(false)
    }
    checkSession()
    return () => { active = false }
  }, [router])

  const activeQuickFilter = (() => {
    if (selectedRead === 'unread' && selectedDate === 'all' && !selectedDomain && !selectedTag) return 'unread'
    if (selectedRead === 'all' && selectedDate === '7d' && !selectedDomain && !selectedTag) return 'new'
    if (selectedRead === 'all' && selectedDate === 'all' && !selectedDomain && !selectedTag) return 'all'
    return null
  })()

  const hasManualFilters = hasActiveFilters && activeQuickFilter === null

  const handleQuickFilter = (id: string) => {
    if (id === 'all') {
      setSelectedRead('all'); setSelectedDate('all')
    } else if (id === 'unread') {
      if (activeQuickFilter === 'unread') { setSelectedRead('all'); setSelectedDate('all') }
      else { setSelectedRead('unread'); setSelectedDate('all') }
    } else if (id === 'new') {
      if (activeQuickFilter === 'new') { setSelectedRead('all'); setSelectedDate('all') }
      else { setSelectedRead('all'); setSelectedDate('7d') }
    }
  }

  const { showLoader: authLoader, exiting: authLoaderExiting } = usePageLoader(authLoading)

  if (authLoader) {
    return <AcornLoader fullScreen exiting={authLoaderExiting} />
  }

  const hasQuery = query.trim().length > 0
  const showInitial = !hasQuery && !hasActiveFilters
  const showEmpty = !loading && !error && results.length === 0 && !showInitial

  return (
    <main style={searchStyles.page} className="page-enter">
      <SearchGradient />
      <SearchHeroDecoration />

      <div style={searchStyles.inner}>
      <div className="heroContent" style={searchStyles.heroContent}>
        <h1 style={searchStyles.title}>De vuelta a lo que importa</h1>
        <p style={searchStyles.subtitle}>Encuentra lo que guardaste cuando lo necesites</p>
      </div>

      <div style={searchStyles.inputWrapper}>
        <span
          style={{
            ...searchStyles.searchIcon,
            transform: isFocused ? 'translateY(-50%) scale(1.22)' : 'translateY(-50%) scale(1)',
            opacity: isFocused ? 1 : 0.7,
            transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease',
          }}
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke={colors.brownMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca en tus recursos..."
          style={searchStyles.searchInput}
          aria-label="Buscar recursos"
          autoComplete="off"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <QuickFilters
        activeQuickFilter={activeQuickFilter}
        hasManualFilters={hasManualFilters}
        showFilterPanel={showFilterPanel}
        onQuickFilter={handleQuickFilter}
        onToggleFilterPanel={() => setShowFilterPanel((v) => !v)}
      />

      <div style={{ ...searchStyles.filterPanelWrapper, gridTemplateRows: showFilterPanel ? '1fr' : '0fr' }}>
        <div style={searchStyles.filterPanelInner}>
          <FilterPanel
            domains={domainOptions}
            tags={allUserTags}
            selectedDomain={selectedDomain}
            selectedTag={selectedTag}
            selectedDate={selectedDate}
            selectedRead={selectedRead}
            selectedType={selectedType}
            onSelectDomain={setSelectedDomain}
            onSelectTag={(tag) => {
              if (query.trim().startsWith('#')) setQuery('')
              setSelectedTag(selectedTag === tag ? null : tag)
            }}
            onSelectDate={setSelectedDate}
            onSelectRead={setSelectedRead}
            onSelectType={setSelectedType}
            onClear={clearFilters}
          />
        </div>
      </div>

      {!showInitial && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <p className="metaFadeIn" style={searchStyles.resultsMeta}>
            <span style={searchStyles.resultsMetaDot} />
            {totalCount === 1 ? `${totalCount} resultado` : `${totalCount} resultados`}
          </p>
          {tagFromQuery && (
            <p style={searchStyles.tagQueryHint}>
              · etiqueta <span style={searchStyles.tagQueryBadge}>#{tagFromQuery}</span>
            </p>
          )}
        </div>
      )}

      {error ? <p style={searchStyles.errorText}>{error}</p> : null}

      {showInitial ? (
        <div style={searchStyles.initialState}>
          <img src="/search-ardilla.svg" alt="" className="squirrelAnim" style={searchStyles.squirrelImg} />
          <p style={searchStyles.initialTitle}>¿Qué tal si nos ponemos a buscar?</p>
          <p style={searchStyles.initialSubtitle}>Escribe algo arriba o usa los filtros para encontrar tus recursos.</p>
        </div>
      ) : loading ? (
        <div style={searchStyles.resultsList}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : showEmpty ? (
        <div style={searchStyles.emptyState}>
          <img src="/search-ardilla.svg" alt="" className="squirrelAnim" style={searchStyles.squirrelImg} />
          <p style={searchStyles.emptyTitle}>Aquí no hay nada...</p>
          <p style={searchStyles.emptySubtitle}>
            {hasActiveFilters
              ? 'Prueba a limpiar o combinar otros filtros.'
              : 'Guarda tu primer enlace para verlo aquí.'}
          </p>
        </div>
      ) : (
        <div style={searchStyles.resultsList}>
          {results.map((result, index) => (
            <Link
              key={result.id}
              href={`/item/${result.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                animation: 'resultFadeIn 0.28s ease both',
                animationDelay: `${Math.min(index * 40, 240)}ms`,
              }}
            >
              <ResourceCard
                id={result.id}
                title={result.title}
                description={result.description}
                domain={result.domain}
                url={result.url}
                createdAtLabel={result.createdAtLabel}
                isRead={result.isRead}
                tags={result.tags}
                highlightedParts={highlightText(result.title, query)}
                descriptionHighlighted={highlightText(result.description, query)}
                onToggleRead={(id, current) => void handleToggleRead(id, current)}
                onCopyUrl={(url) => { navigator.clipboard.writeText(url) }}
              />
            </Link>
          ))}

          {hasMore && (
            <button
              type="button"
              style={searchStyles.loadMoreButton}
              onClick={() => void loadMore()}
              disabled={loadingMore}
            >
              {loadingMore ? 'Cargando...' : 'Cargar más'}
            </button>
          )}
        </div>
      )}

      </div>

      <style jsx>{`
        @keyframes skeletonPulse {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes resultFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes squirrelBounce {
          0%   { opacity: 0; transform: scale(0.72) translateY(8px); }
          65%  { transform: scale(1.06) translateY(-3px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes metaFadeIn {
          from { opacity: 0; transform: scale(0.88) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .heroContent {
          animation: heroFadeIn 0.48s ease both;
        }
        .squirrelAnim {
          animation: squirrelBounce 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .metaFadeIn {
          animation: metaFadeIn 0.22s ease both;
        }
        input:focus {
          border-color: #A14D36 !important;
          opacity: 1 !important;
          box-shadow: 0 0 0 3px rgba(161, 77, 54, 0.12), 0 2px 12px rgba(67, 40, 28, 0.08) !important;
          transform: translateY(-1px) !important;
        }
        button:hover {
          opacity: 0.88;
        }
        button:active {
          transform: scale(0.95) !important;
          transition: transform 0.08s ease !important;
        }
      `}</style>
    </main>
  )
}
