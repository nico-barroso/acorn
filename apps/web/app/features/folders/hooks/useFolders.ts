import { useCallback, useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'

export type Folder = {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
  createdAt: string
  ruleCount?: number
}

export type FolderFormData = {
  name: string
  description?: string
}

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [renamingFolder, setRenamingFolder] = useState<Folder | null>(null)
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null)

  const fetchFolders = useCallback(async (mode: 'initial' | 'refresh' | 'silent' = 'initial') => {
    if (mode === 'initial') setLoading(true)
    if (mode === 'refresh') setRefreshing(true)
    setError('')

    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        setError('No se pudo verificar tu sesion')
        return
      }

      const { data, error: queryError } = await supabase
        .from('smart_folders')
        .select('id, name, slug, description, is_active, created_at, smart_folder_rules(count)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (queryError) {
        setError('No se pudieron cargar las carpetas')
        return
      }

      const mapped: Folder[] = (data || []).map((row) => ({
        id: row.id,
        name: row.name || 'Carpeta sin nombre',
        slug: row.slug || '',
        description: row.description,
        isActive: row.is_active ?? true,
        createdAt: row.created_at,
        ruleCount: row.smart_folder_rules?.[0]?.count || 0
      }))

      setFolders(mapped)
    } catch {
      setError('Ocurrio un error inesperado')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const createFolder = useCallback(async (formData: FolderFormData): Promise<boolean> => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        setError('No se pudo verificar tu sesion')
        return false
      }

      const name = formData.name.trim()
      if (!name) {
        setError('El nombre es obligatorio')
        return false
      }

      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      const { error: insertError } = await supabase
        .from('smart_folders')
        .insert({
          name,
          slug,
          description: formData.description?.trim() || null,
          user_id: user.id,
          is_active: true
        })

      if (insertError) {
        setError('No se pudo crear la carpeta')
        return false
      }

      await fetchFolders('silent')
      return true
    } catch {
      setError('Ocurrio un error inesperado')
      return false
    }
  }, [fetchFolders])

  const renameFolder = useCallback(async (folderId: string, newName: string): Promise<boolean> => {
    try {
      const supabase = getSupabaseBrowserClient()
      const name = newName.trim()
      if (!name) return false

      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      const { error: updateError } = await supabase
        .from('smart_folders')
        .update({ name, slug })
        .eq('id', folderId)

      if (updateError) {
        setError('No se pudo renombrar la carpeta')
        return false
      }

      await fetchFolders('silent')
      return true
    } catch {
      setError('Ocurrio un error inesperado')
      return false
    }
  }, [fetchFolders])

  const deleteFolder = useCallback(async (folderId: string): Promise<boolean> => {
    try {
      setDeletingFolderId(folderId)
      const supabase = getSupabaseBrowserClient()

      const { error: deleteError } = await supabase
        .from('smart_folders')
        .delete()
        .eq('id', folderId)

      if (deleteError) {
        setError('No se pudo eliminar la carpeta')
        return false
      }

      setFolders((current) => current.filter((f) => f.id !== folderId))
      return true
    } catch {
      setError('Ocurrio un error inesperado')
      return false
    } finally {
      setDeletingFolderId(null)
    }
  }, [])

  useEffect(() => {
    fetchFolders('initial')
  }, [fetchFolders])

  return {
    folders,
    loading,
    refreshing,
    error,
    showNewModal,
    setShowNewModal,
    renamingFolder,
    setRenamingFolder,
    deletingFolderId,
    fetchFolders,
    createFolder,
    renameFolder,
    deleteFolder
  }
}