import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { supabase } from '../../../lib/supabase';
import { ContentCard } from '../../components/ContentCard/ContentCard';
import { colors } from '../../theme/colors';
import { styles } from './SmartFolderView.styles';

export type SmartFolderRule = {
  id: string;
  field: string;
  operator: string;
  value: unknown;
  position: number;
};

export type SmartFolderSummary = {
  id: string;
  name: string;
  description: string;
  rules: SmartFolderRule[];
};

type ItemRow = {
  id: string;
  title: string | null;
  is_read: boolean;
  created_at: string;
  url: string | null;
  domain: string | null;
  preview_image_url: string | null;
  og_image_url: string | null;
  description: string | null;
  tags: string[] | null;
};

type ContentCardData = {
  id: string;
  title: string;
  source: string;
  tag: string;
  savedDate: string;
  status: 'No visto' | 'Visto';
  url?: string;
  thumbnailUri?: string;
};

type SmartFolderViewProps = {
  visible: boolean;
  folder: SmartFolderSummary | null;
  onClose: () => void;
  onOpenDetail: (itemId: string) => void;
};

function formatSavedDate(isoDate: string) {
  const created = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = Math.max(now - created, 0);
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Hace unos segundos';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `Hace ${diffDays} dias`;

  return new Date(isoDate).toLocaleDateString();
}

function mapItem(row: ItemRow): ContentCardData {
  return {
    id: row.id,
    title: row.title?.trim() || row.domain || row.url || 'Recurso sin titulo',
    source: row.domain ? `Enlace / ${row.domain}` : 'Enlace',
    tag: row.tags && row.tags.length > 0 ? `#${row.tags[0]}` : '#recurso',
    savedDate: formatSavedDate(row.created_at),
    status: row.is_read ? 'Visto' : 'No visto',
    url: row.url ?? undefined,
    thumbnailUri: row.og_image_url ?? row.preview_image_url ?? undefined,
  };
}

function normalizeText(value: unknown) {
  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).toLowerCase();
  }
  return '';
}

function ruleMatchesItem(rule: SmartFolderRule, item: ItemRow) {
  const operator = rule.operator;
  const rawRuleValue = rule.value;
  const ruleText = normalizeText(rawRuleValue);

  if (!ruleText && rule.field !== 'is_read') {
    return true;
  }

  if (rule.field === 'is_read') {
    const desired =
      typeof rawRuleValue === 'boolean'
        ? rawRuleValue
        : String(rawRuleValue).trim().toLowerCase() === 'true';

    if (operator === 'not_equals') {
      return item.is_read !== desired;
    }

    return item.is_read === desired;
  }

  if (rule.field === 'tag') {
    const tags = (item.tags ?? []).map((tag) => tag.toLowerCase());
    const hasEquals = tags.some((tag) => tag === ruleText);
    const hasContains = tags.some((tag) => tag.includes(ruleText));

    if (operator === 'equals') {
      return hasEquals;
    }
    if (operator === 'not_equals') {
      return !hasEquals;
    }
    return hasContains;
  }

  const sourceValue =
    rule.field === 'domain'
      ? normalizeText(item.domain ?? '')
      : rule.field === 'title'
        ? normalizeText(item.title ?? '')
        : normalizeText(item.description ?? '');

  if (operator === 'equals') {
    return sourceValue === ruleText;
  }
  if (operator === 'not_equals') {
    return sourceValue !== ruleText;
  }

  return sourceValue.includes(ruleText);
}

function itemMatchesFolderRules(item: ItemRow, rules: SmartFolderRule[]) {
  return rules.every((rule) => ruleMatchesItem(rule, item));
}

export function SmartFolderView({ visible, folder, onClose, onOpenDetail }: SmartFolderViewProps) {
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState('');
  const [resources, setResources] = React.useState<ContentCardData[]>([]);

  const fetchResources = React.useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (!visible || !folder) {
        return;
      }

      if (mode === 'initial') {
        setLoading(true);
      }
      if (mode === 'refresh') {
        setRefreshing(true);
      }

      setError('');

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        setRefreshing(false);
        setError('Debes iniciar sesion para ver esta carpeta inteligente.');
        return;
      }

      const { data, error: queryError } = await supabase
        .from('items_with_links')
        .select('id,title,is_read,created_at,url,domain,preview_image_url,og_image_url,description,tags')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(200);

      setLoading(false);
      setRefreshing(false);

      if (queryError) {
        setError('No se pudieron cargar los recursos de la carpeta.');
        return;
      }

      const rows = (data ?? []) as ItemRow[];
      const filtered = rows.filter((item) => itemMatchesFolderRules(item, folder.rules));
      setResources(filtered.map(mapItem));
    },
    [folder, visible],
  );

  React.useEffect(() => {
    void fetchResources('initial');
  }, [fetchResources]);

  React.useEffect(() => {
    if (!visible) {
      setLoading(false);
      setRefreshing(false);
      setError('');
      setResources([]);
    }
  }, [visible]);

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.salmon} />
          <Text style={styles.emptyTitle}>Aplicando reglas...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Sin recursos en esta carpeta</Text>
        <Text style={styles.emptySubtitle}>Ajusta tus reglas para ampliar coincidencias.</Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.panel}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>{folder?.name ?? 'Carpeta inteligente'}</Text>
                <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.closeLabel}>Cerrar</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>{folder?.description || 'Recursos filtrados automaticamente.'}</Text>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <FlatList
                data={resources}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ContentCard
                    {...item}
                    onOpenDetail={(itemId) => {
                      onClose();
                      onOpenDetail(itemId);
                    }}
                  />
                )}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={resources.length === 0 ? styles.listEmptyContent : styles.listContent}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={() => void fetchResources('refresh')} />
                }
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
