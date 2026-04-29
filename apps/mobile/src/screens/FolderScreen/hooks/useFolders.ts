import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@lib/supabase';
import { queryClient } from '../../../lib/queryClient';
import { queryKeys } from '../../../lib/queryKeys';
import { useCurrentUserId } from '../../../hooks/useCurrentUserId';
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

async function fetchFolders(userId: string): Promise<FolderData[]> {
  const { data, error } = await supabase
    .from('smart_folders')
    .select('id, name, description')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error('No se pudieron cargar tus carpetas.');
  return ((data ?? []) as SmartFolderRow[]).map(mapFolder);
}

export function useFolders() {
  const router = useRouter();
  const userId = useCurrentUserId();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderData | null>(null);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);

  const {
    data: folders = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.folders(userId ?? ''),
    queryFn: () => fetchFolders(userId!),
    enabled: Boolean(userId),
    staleTime: 2 * 60 * 1000,
  });

  const error = queryError ? 'No se pudieron cargar tus carpetas.' : '';

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('smart_folders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.folders(userId!) });
    },
  });

  const invalidateFolders = () =>
    void queryClient.invalidateQueries({ queryKey: queryKeys.folders(userId!) });

  return {
    folders,
    loading,
    refreshing: isPullRefreshing,
    error,
    builderOpen,
    editingFolder,
    deletingFolderId: deleteMutation.isPending ? (deleteMutation.variables ?? null) : null,
    onNewFolder: () => setBuilderOpen(true),
    onBuilderClose: () => setBuilderOpen(false),
    onBuilderCreated: () => {
      setBuilderOpen(false);
      invalidateFolders();
    },
    onFolderPress: (id: string) => router.push(`/(app)/folders/${id}`),
    onRefresh: () => {
      setIsPullRefreshing(true);
      void refetch().finally(() => setIsPullRefreshing(false));
    },
    onEditFolder: (id: string) => {
      const folder = folders.find((f) => f.id === id);
      if (folder) setEditingFolder(folder);
    },
    onEditClose: () => setEditingFolder(null),
    onEditSaved: () => {
      setEditingFolder(null);
      invalidateFolders();
    },
    onDeleteFolder: (id: string) => deleteMutation.mutate(id),
  };
}
