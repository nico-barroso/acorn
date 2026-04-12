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
import { Button } from '../../components/Button/Button';
import { SmartFolderBuilder } from '../SmartFolderBuilder/SmartFolderBuilder';
import { SmartFolderSummary, SmartFolderView, SmartFolderRule } from '../SmartFolderView/SmartFolderView';
import { styles } from './SmartFolders.styles';

type SmartFolderRow = {
  id: string;
  name: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  smart_folder_rules: SmartFolderRule[] | null;
};

type SmartFolderListItem = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAtLabel: string;
  ruleCount: number;
  firstRuleLabel: string;
  rules: SmartFolderRule[];
};

type SmartFoldersProps = {
  visible: boolean;
  onClose: () => void;
  onOpenDetail: (itemId: string) => void;
};

function formatRule(rule: SmartFolderRule) {
  const valueText =
    typeof rule.value === 'string'
      ? rule.value
      : Array.isArray(rule.value)
        ? rule.value.join(', ')
        : JSON.stringify(rule.value);

  return `${rule.field} ${rule.operator} ${valueText}`;
}

function mapFolder(row: SmartFolderRow): SmartFolderListItem {
  const sortedRules = [...(row.smart_folder_rules ?? [])].sort((a, b) => a.position - b.position);
  const firstRule = sortedRules[0];

  return {
    id: row.id,
    name: row.name?.trim() || 'Carpeta sin nombre',
    description: row.description?.trim() || 'Sin descripcion',
    isActive: Boolean(row.is_active),
    createdAtLabel: new Date(row.created_at).toLocaleDateString(),
    ruleCount: sortedRules.length,
    firstRuleLabel: firstRule ? formatRule(firstRule) : 'Sin reglas',
    rules: sortedRules,
  };
}

export function SmartFolders({ visible, onClose, onOpenDetail }: SmartFoldersProps) {
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState('');
  const [folders, setFolders] = React.useState<SmartFolderListItem[]>([]);
  const [builderOpen, setBuilderOpen] = React.useState(false);
  const [selectedFolder, setSelectedFolder] = React.useState<SmartFolderSummary | null>(null);

  const fetchFolders = React.useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (!visible) {
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
        setError('Debes iniciar sesion para ver tus carpetas inteligentes.');
        return;
      }

      const { data, error: queryError } = await supabase
        .from('smart_folders')
        .select('id,name,description,is_active,created_at,smart_folder_rules(id,field,operator,value,position)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setLoading(false);
      setRefreshing(false);

      if (queryError) {
        setError('No se pudieron cargar tus carpetas inteligentes.');
        return;
      }

      setFolders(((data ?? []) as SmartFolderRow[]).map(mapFolder));
    },
    [visible],
  );

  React.useEffect(() => {
    void fetchFolders('initial');
  }, [fetchFolders]);

  React.useEffect(() => {
    if (!visible) {
      setLoading(false);
      setRefreshing(false);
      setError('');
      setFolders([]);
      setSelectedFolder(null);
    }
  }, [visible]);

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator />
          <Text style={styles.emptyTitle}>Cargando carpetas...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No tienes carpetas inteligentes</Text>
        <Text style={styles.emptySubtitle}>Cuando crees reglas, apareceran aqui para acceder rapido a tus recursos.</Text>
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
                <Text style={styles.title}>Carpetas inteligentes</Text>
                <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.closeLabel}>Cerrar</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>Listado de carpetas y resumen de reglas activas.</Text>

              <View style={styles.createButtonWrap}>
                <Button label='Crear carpeta inteligente' onPress={() => setBuilderOpen(true)} />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <FlatList
                data={folders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.folderCard} activeOpacity={0.85} onPress={() => setSelectedFolder(item)}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.folderName}>{item.name}</Text>
                      <View style={[styles.statusChip, !item.isActive ? styles.statusChipInactive : null]}>
                        <Text style={[styles.statusText, !item.isActive ? styles.statusTextInactive : null]}>
                          {item.isActive ? 'Activa' : 'Inactiva'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.folderDescription}>{item.description}</Text>
                    <Text style={styles.folderMeta}>Creada: {item.createdAtLabel}</Text>
                    <Text style={styles.folderMeta}>Reglas: {item.ruleCount}</Text>
                    <Text style={styles.ruleText}>Primera regla: {item.firstRuleLabel}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={folders.length === 0 ? styles.listEmptyContent : styles.listContent}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={() => void fetchFolders('refresh')} />
                }
              />
            </View>
          </TouchableWithoutFeedback>

          <SmartFolderBuilder
            visible={builderOpen}
            onClose={() => setBuilderOpen(false)}
            onCreated={() => void fetchFolders('refresh')}
          />

          <SmartFolderView
            visible={Boolean(selectedFolder)}
            folder={selectedFolder}
            onClose={() => setSelectedFolder(null)}
            onOpenDetail={onOpenDetail}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
