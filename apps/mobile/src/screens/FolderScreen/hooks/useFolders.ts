import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@lib/supabase';
import type { FolderData } from '../FoldersScreen.types';

type SmartFolderRow = {
  id: string;
  name: string | null;
  description: string | null;
};

function mapFolder(row: SmartFolderRow): FolderData {
  return {
    id: row.id,
    name: row.name?.trim() || 'Carpeta sin nombre',

    description: row.description?.trim() || undefined,
  };
}

export function useFolders() {
  const router = useRouter();
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderData | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);

  const fetchFolders = useCallback(async (mode: 'initial' | 'refresh' | 'silent') => {
    if (mode === 'initial') setLoading(true);
    if (mode === 'refresh') setRefreshing(true);

    setError('');

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      setLoading(false);
      setRefreshing(false);
      setError('Debes iniciar sesion para ver tus carpetas.');
      return;
    }

    const { data, error: queryError } = await supabase
      .from('smart_folders')
      .select('id, name, description')
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

  const onEditFolder = (id: string) => {
    const folder = folders.find((f) => f.id === id);
    if (folder) setEditingFolder(folder);
  };

  const onEditClose = () => setEditingFolder(null);

  const onEditSaved = () => {
    setEditingFolder(null);
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
    editingFolder,
    deletingFolderId,
    onNewFolder,
    onBuilderClose,
    onBuilderCreated,
    onFolderPress,
    onRefresh,
    onEditFolder,
    onEditClose,
    onEditSaved,
    onDeleteFolder,
  };
}
