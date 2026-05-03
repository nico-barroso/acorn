import { useEffect, useMemo, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import type { TagItem } from '@/features/shared/components/ResourceCard/ResourceCard'

export type FolderDetail = {
  id: string
  name: string
  description: string | null
  isActive: boolean
  rules: SmartFolderRule[]
}

export type SmartFolderRule = {
  id: string
  field: string
  operator: string
  value: unknown
  position: number
}

export type FolderResource = {
  id: string
  title: string
  description: string
  domain: string
  url: string | null
  thumbnailUrl: string | null
  createdAtLabel: string
  isRead: boolean
  tags: TagItem[]
  siteName: string | null
}

type ItemRow = {
  id: string
  title: string | null
  description: string | null
  domain: string | null
  url: string | null
  created_at: string
  is_read: boolean
  tags: string[] | null
  preview_image_url: string | null
  og_image_url: string | null
  site_name: string | null
}

type QuickFilter = 'all' | 'unread' | 'recent'

function ruleMatchesItem(rule: SmartFolderRule, item: FolderResource): boolean {
  const ruleValue = String(rule.value).trim().toLowerCase()

  switch (rule.field) {
    case 'domain': {
      const itemDomain = item.domain.toLowerCase()
      switch (rule.operator) {
        case 'contains': return itemDomain.includes(ruleValue)
        case 'equals': return itemDomain === ruleValue
        case 'not_equals': return itemDomain !== ruleValue
        default: return true
      }
    }
    case 'tag': {
      const itemTags = item.tags.map((t) => t.name.toLowerCase())
      switch (rule.operator) {
        case 'contains': return itemTags.some((t) => t.includes(ruleValue))
        case 'equals': return itemTags.some((t) => t === ruleValue)
        default: return true
      }
    }
    case 'title': {
      const itemTitle = item.title.toLowerCase()
      switch (rule.operator) {
        case 'contains': return itemTitle.includes(ruleValue)
        case 'equals': return itemTitle === ruleValue
        case 'not_equals': return itemTitle !== ruleValue
        default: return true
      }
    }
    case 'is_read': {
      const isReadVal = ruleValue === 'true'
      return item.isRead === isReadVal
    }
    default:
      return true
  }
}

function itemMatchesRules(item: FolderResource, rules: SmartFolderRule[]): boolean {
  if (rules.length === 0) return true
  return rules.every((rule) => ruleMatchesItem(rule, item))
}

export function useFolderDetail(folderId: string) {
  const [folder, setFolder] = useState<FolderDetail | null>(null)
  const [resources, setResources] = useState<FolderResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState<QuickFilter>('all')

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        const supabase = getSupabaseBrowserClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
          setError('No se pudo verificar tu sesion')
          setLoading(false)
          return
        }

        const { data: folderData, error: folderError } = await supabase
          .from('smart_folders')
          .select('id, name, description, is_active, smart_folder_rules(id, field, operator, value, position)')
          .eq('id', folderId)
          .eq('user_id', user.id)
          .single()

        if (folderError || !folderData) {
          setError('No se pudo cargar la carpeta')
          setLoading(false)
          return
        }

        const rules: SmartFolderRule[] = (folderData.smart_folder_rules || [])
          .sort((a: SmartFolderRule, b: SmartFolderRule) => a.position - b.position)

        const mappedFolder: FolderDetail = {
          id: folderData.id,
          name: folderData.name || 'Carpeta sin nombre',
          description: folderData.description,
          isActive: folderData.is_active ?? true,
          rules
        }

        if (!active) return
        setFolder(mappedFolder)

        const [{ data: itemsData, error: itemsError }, { data: tagData }] = await Promise.all([
          supabase
            .from('items_with_links')
            .select('id,title,description,domain,url,created_at,is_read,tags,preview_image_url,og_image_url,site_name')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(200),
          supabase
            .from('tags')
            .select('name,slug,color_hex')
            .eq('user_id', user.id)
        ])

        if (itemsError) {
          setError('No se pudieron cargar los recursos')
          setLoading(false)
          return
        }

        const tagColorMap = new Map<string, string | null>()
        ;(tagData ?? []).forEach((t: { name: string; slug: string | null; color_hex: string | null }) => {
          tagColorMap.set(t.name, t.color_hex)
          if (t.slug) tagColorMap.set(t.slug, t.color_hex)
          tagColorMap.set(t.name.toLowerCase(), t.color_hex)
        })

        const allResources: FolderResource[] = (itemsData || []).map((row: ItemRow) => ({
          id: row.id,
          title: row.title?.trim() || row.domain || row.url || 'Recurso sin titulo',
          description: row.description?.trim() || 'Sin descripcion disponible.',
          domain: row.domain || 'Sin dominio',
          url: row.url,
          thumbnailUrl: row.og_image_url || row.preview_image_url || null,
          createdAtLabel: new Date(row.created_at).toLocaleDateString(),
          isRead: Boolean(row.is_read),
          tags: (row.tags ?? []).filter(Boolean).map((name: string) => ({ name, color_hex: tagColorMap.get(name) ?? tagColorMap.get(name.toLowerCase()) ?? null })),
          siteName: row.site_name || null
        }))

        if (!active) return

        const filtered = rules.length > 0
          ? allResources.filter((item) => itemMatchesRules(item, rules))
          : []

        setResources(filtered)
      } catch {
        if (active) setError('Ocurrio un error inesperado')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => { active = false }
  }, [folderId])

  const filteredResources = useMemo(() => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    switch (activeFilter) {
      case 'unread':
        return resources.filter((r) => !r.isRead)
      case 'recent':
        return resources.filter((r) => new Date(r.createdAtLabel) >= sevenDaysAgo)
      default:
        return resources
    }
  }, [resources, activeFilter])

  const readCount = useMemo(() => resources.filter((r) => r.isRead).length, [resources])
  const unreadCount = resources.length - readCount

  return {
    folder,
    resources: filteredResources,
    totalResources: resources.length,
    readCount,
    unreadCount,
    loading,
    error,
    activeFilter,
    setActiveFilter
  }
}