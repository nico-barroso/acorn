import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@lib/supabase';
import type { FolderResource } from '../FolderDetail.types';

const FILE_ICON = require('../../../../assets/favicon.png');

function isImageUrl(url: string): boolean {
  return /\.(jpe?g|png|gif|webp|heic|bmp|tiff?)(\?|$)/i.test(url);
}

type ItemRow = {
  id: string;
  type: string | null;
  title: string | null;
  is_read: boolean;
  created_at: string;
  url: string | null;
  domain: string | null;
  tags: string[] | null;
  og_image_url: string | null;
  preview_image_url: string | null;
  favicon_url: string | null;
};

export function useFolderDetail(folderId: string) {
  const [folderName, setFolderName] = useState<string>('');
  const [resources, setResources] = useState<FolderResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState('all');

  const fetchFolderDetail = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('Debes iniciar sesión.');
        setLoading(false);
        return;
      }

      const { data: folderData, error: folderError } = await supabase
        .from('smart_folders')
        .select('name')
        .eq('id', folderId)
        .eq('user_id', user.id)
        .single();

      if (folderError) {
        setError('No se pudo cargar la carpeta.');
        setLoading(false);
        return;
      }

      setFolderName(folderData.name || 'Carpeta');

      const { data: itemData, error: itemError } = await supabase
        .from('items_with_links')
        .select('id,type,title,is_read,created_at,url,domain,tags,og_image_url,preview_image_url,favicon_url')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(200);

      if (itemError) {
        setError('No se pudieron cargar los recursos.');
        setLoading(false);
        return;
      }

      const rows = (itemData ?? []) as ItemRow[];
      const mapped: FolderResource[] = rows.map((row): FolderResource => {
        const isFile = row.type === 'file';
        const fileUrl = row.url ?? undefined;
        const fileThumbnail = isFile && fileUrl && isImageUrl(fileUrl) ? fileUrl : undefined;
        return {
          id: row.id,
          title: row.title?.trim() || row.domain || row.url || 'Recurso sin título',
          source: isFile ? 'Archivo' : row.domain ? `Enlace / ${row.domain}` : 'Enlace',
          tags: row.tags ?? [],
          savedDate: new Date(row.created_at).toLocaleDateString(),
          status: row.is_read ? 'Visto' : 'No visto',
          isRead: Boolean(row.is_read),
          url: fileUrl,
          thumbnailUri: fileThumbnail ?? (row.og_image_url ?? row.preview_image_url ?? undefined),
          faviconUri: row.favicon_url ?? undefined,
          isFile,
        };
      });

      setResources(mapped);
    } catch {
      setError('Ocurrió un error al cargar la carpeta.');
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    void fetchFolderDetail();
  }, [fetchFolderDetail]);

  const hasActiveFilters = activeQuickFilter !== 'all';

  const handleQuickFilter = (id: string) => {
    setActiveQuickFilter(id);
  };

  const filteredResources = useMemo(() => {
    if (activeQuickFilter === 'all') {
      return resources;
    }

    if (activeQuickFilter === 'unread') {
      return resources.filter((r) => !r.isRead);
    }

    if (activeQuickFilter === 'new') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      return resources.filter((r) => {
        const saved = new Date(r.savedDate);
        return saved >= sevenDaysAgo;
      });
    }

    return resources;
  }, [resources, activeQuickFilter]);

  return {
    folderName,
    loading,
    resources: filteredResources,
    error,
    activeQuickFilter,
    hasActiveFilters,
    onQuickFilter: handleQuickFilter,
  };
}