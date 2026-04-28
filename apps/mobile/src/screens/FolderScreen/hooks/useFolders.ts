import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@lib/supabase';
import type { FolderData } from '../FoldersScreen.types';

type SmartFolderRow = {
  id: string;
  name: string | null;
  created_at: string;
};

function mapFolder(row: SmartFolderRow): FolderData {
  return {
    id: row.id,
    name: row.name?.trim() || 'Carpeta sin nombre',
    subtitle: new Date(row.created_at).toLocaleDateString(),
  };
}

export function useFolders() {
  const router = useRouter();
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [builderOpen, setBuilderOpen] = useState(false);
  const [renamingFolder, setRenamingFolder] = useState<FolderData | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);

  const fetchFolders = useCallback(async (mode: 'initial' | 'refresh' | 'silent') => {
    if (mode === 'initial') setLoading(true);
    if (mode === 'refresh') setRefreshing(true);

    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setRefreshing(false);
      setError('Debes iniciar sesion para ver tus carpetas.');
      return;
    }

    const { data, error: queryError } = await supabase
      .from('smart_folders')
      .select('id, name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setLoading(false);
    setRefreshing(false);

    if (queryError) {
      setError('No se pudieron cargar tus carpetas.');
      return;
    }

    setFolders(((data ?? []) as SmartFolderRow[]).map(mapFolder));
  }, []);

  useEffect(() => {
    void fetchFolders('initial');
  }, [fetchFolders]);

  const onNewFolder = () => setBuilderOpen(true);
  const onBuilderClose = () => setBuilderOpen(false);
  const onBuilderCreated = () => {
    setBuilderOpen(false);
    void fetchFolders('silent');
  };

  const onFolderPress = (id: string) => {
    router.push(`/(app)/folders/${id}`);
  };

  const onRefresh = () => void fetchFolders('refresh');

  const onRenameFolder = (id: string) => {
    const folder = folders.find((f) => f.id === id);
    if (folder) setRenamingFolder(folder);
  };

  const onRenameClose = () => setRenamingFolder(null);

  const onRenameConfirmed = async (newName: string) => {
    if (!renamingFolder) return;

    const slug = newName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const { error: updateError } = await supabase
      .from('smart_folders')
      .update({ name: newName, slug })
      .eq('id', renamingFolder.id);

    if (updateError) {
      setError('No se pudo renombrar la carpeta.');
      return;
    }

    setRenamingFolder(null);
    void fetchFolders('silent');
  };

  const onDeleteFolder = async (id: string) => {
    setDeletingFolderId(id);

    const { error: deleteError } = await supabase
      .from('smart_folders')
      .delete()
      .eq('id', id);

    setDeletingFolderId(null);

    if (deleteError) {
      setError('No se pudo eliminar la carpeta.');
      return;
    }

    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  return {
    folders,
    loading,
    refreshing,
    error,
    builderOpen,
    renamingFolder,
    deletingFolderId,
    onNewFolder,
    onBuilderClose,
    onBuilderCreated,
    onFolderPress,
    onRefresh,
    onRenameFolder,
    onRenameClose,
    onRenameConfirmed,
    onDeleteFolder,
  };
}
