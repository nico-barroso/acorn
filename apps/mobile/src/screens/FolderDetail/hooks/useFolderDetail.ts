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

type SmartRuleRow = {
  field: string;
  operator: string;
  value: unknown;
  value_type: string;
  is_negated: boolean | null;
};

function applySmartRules(
  items: FolderResource[],
  rules: SmartRuleRow[],
  logic: string,
): FolderResource[] {
  if (rules.length === 0) return items;

  return items.filter((item) => {
    const results = rules.map((rule) => {
      const ruleValue =
        typeof rule.value === 'string' ? rule.value : String(rule.value ?? '');

      let matches = false;
      if (rule.field === 'tag') {
        matches = item.tags.some((t) => t.name === ruleValue);
      } else if (rule.field === 'domain') {
        matches = Boolean(
          item.domain && item.domain.toLowerCase() === ruleValue.toLowerCase(),
        );
      }

      return rule.is_negated ? !matches : matches;
    });

    return logic === 'ANY' ? results.some(Boolean) : results.every(Boolean);
  });
}

export function useFolderDetail(folderId: string) {
  const [folderName, setFolderName] = useState<string>('');
  const [folderDescription, setFolderDescription] = useState<string>('');
  const [resources, setResources] = useState<FolderResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState('all');

  const fetchFolderDetail = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        setError('Debes iniciar sesión.');
        setLoading(false);
        return;
      }

      const { data: folderData, error: folderError } = await supabase
        .from('smart_folders')
        .select('name, description, logic')
        .eq('id', folderId)
        .eq('user_id', user.id)
        .single();

      if (folderError) {
        setError('No se pudo cargar la carpeta.');
        setLoading(false);
        return;
      }

      setFolderName(folderData.name || 'Carpeta');
      setFolderDescription(folderData.description?.trim() || '');

      const [
        { data: itemData, error: itemError },
        { data: tagRows },
        { data: rulesData },
      ] = await Promise.all([
        supabase
          .from('items_with_links')
          .select(
            'id,type,title,is_read,created_at,url,domain,tags,og_image_url,preview_image_url,favicon_url',
          )
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(200),
        supabase.from('tags').select('name,color_hex').eq('user_id', user.id),
        supabase
          .from('smart_folder_rules')
          .select('field,operator,value,value_type,is_negated')
          .eq('folder_id', folderId)
          .order('position'),
      ]);

      if (itemError) {
        setError('No se pudieron cargar los recursos.');
        setLoading(false);
        return;
      }

      const tagColorMap = new Map(
        ((tagRows ?? []) as { name: string; color_hex: string | null }[]).map(
          (t) => [t.name, t.color_hex],
        ),
      );

      const rows = (itemData ?? []) as ItemRow[];
      const mapped: FolderResource[] = rows.map((row): FolderResource => {
        const isFile = row.type === 'file';
        const fileUrl = row.url ?? undefined;
        const fileThumbnail = isFile && fileUrl && isImageUrl(fileUrl) ? fileUrl : undefined;
        return {
          id: row.id,
          title: row.title?.trim() || row.domain || row.url || 'Recurso sin título',
          source: isFile ? 'Archivo' : row.domain ? `Enlace / ${row.domain}` : 'Enlace',
          domain: row.domain ?? undefined,
          tags: (row.tags ?? []).map((name) => ({
            name,
            color_hex: tagColorMap.get(name) ?? null,
          })),
          savedDate: new Date(row.created_at).toLocaleDateString(),
          status: row.is_read ? 'Visto' : 'No visto',
          isRead: Boolean(row.is_read),
          url: fileUrl,
          thumbnailUri: fileThumbnail ?? (row.og_image_url ?? row.preview_image_url ?? undefined),
          faviconUri: row.favicon_url ?? undefined,
          isFile,
        };
      });

      const folderLogic = (folderData.logic as string) ?? 'ALL';
      const smartRules = (rulesData ?? []) as SmartRuleRow[];
      setResources(applySmartRules(mapped, smartRules, folderLogic));
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
    folderDescription,
    loading,
    resources: filteredResources,
    error,
    activeQuickFilter,
    hasActiveFilters,
    onQuickFilter: handleQuickFilter,
  };
}
