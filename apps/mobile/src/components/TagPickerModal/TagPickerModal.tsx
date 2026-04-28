import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { supabase } from '../../../lib/supabase';
import { TagManagement } from '../../screens/TagManagement/TagManagement';
import { styles } from './TagPickerModal.styles';

type TagOption = {
  id: string;
  name: string;
  color_hex: string | null;
};

type TagPickerModalProps = {
  visible: boolean;
  itemId: string | null;
  onClose: () => void;
  onSaved: () => void;
};

const MAX_TAGS = 4;

export function TagPickerModal({ visible, itemId, onClose, onSaved }: TagPickerModalProps) {
  const [allTags, setAllTags] = React.useState<TagOption[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [managementOpen, setManagementOpen] = React.useState(false);

  const loadData = React.useCallback(async () => {
    if (!visible || !itemId) return;

    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) { setLoading(false); return; }

    const [tagsResult, itemTagsResult] = await Promise.all([
      supabase.from('tags').select('id,name,color_hex').eq('user_id', user.id).order('name'),
      supabase.from('item_tags').select('tag_id').eq('item_id', itemId),
    ]);

    setAllTags((tagsResult.data ?? []) as TagOption[]);
    setSelectedIds(((itemTagsResult.data ?? []) as { tag_id: string }[]).map((r) => r.tag_id));
    setLoading(false);
  }, [visible, itemId]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  React.useEffect(() => {
    if (!visible) {
      setAllTags([]);
      setSelectedIds([]);
      setSaving(false);
    }
  }, [visible]);

  const toggleTag = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_TAGS) return prev;
      return [...prev, id];
    });
  };

  const handleSave = async () => {
    if (!itemId) return;
    setSaving(true);

    await supabase.from('item_tags').delete().eq('item_id', itemId);

    if (selectedIds.length > 0) {
      await supabase.from('item_tags').insert(
        selectedIds.map((tag_id) => ({ item_id: itemId, tag_id })),
      );
    }

    setSaving(false);
    onSaved();
  };

  const handleManagementClose = () => {
    setManagementOpen(false);
    void loadData();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <TouchableWithoutFeedback>
                <View style={styles.panel}>
                  <View style={styles.headerRow}>
                    <Text style={styles.title}>Etiquetas</Text>
                    <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                      <Text style={styles.closeLabel}>Cerrar</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.subtitle}>
                    Selecciona hasta {MAX_TAGS} etiquetas para este recurso.
                  </Text>

                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator />
                    </View>
                  ) : allTags.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>Todavía no tienes etiquetas.</Text>
                      <TouchableOpacity onPress={() => setManagementOpen(true)} activeOpacity={0.7}>
                        <Text style={styles.manageLink}>Crear primera etiqueta →</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <View style={styles.chipsContainer}>
                        {allTags.map((tag) => {
                          const selected = selectedIds.includes(tag.id);
                          const disabled = !selected && selectedIds.length >= MAX_TAGS;
                          return (
                            <TouchableOpacity
                              key={tag.id}
                              style={[
                                styles.chip,
                                selected && { backgroundColor: tag.color_hex ?? '#43281C' },
                                disabled && styles.chipDisabled,
                              ]}
                              onPress={() => toggleTag(tag.id)}
                              activeOpacity={0.75}
                              disabled={disabled}
                            >
                              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                                #{tag.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      <Text style={styles.counter}>
                        {selectedIds.length}/{MAX_TAGS} seleccionadas
                      </Text>

                      <TouchableOpacity
                        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                        onPress={() => void handleSave()}
                        activeOpacity={0.8}
                        disabled={saving}
                      >
                        <Text style={styles.saveButtonLabel}>
                          {saving ? 'Guardando...' : 'Guardar'}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.manageButton}
                    onPress={() => setManagementOpen(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.manageLink}>Gestionar etiquetas →</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>

        <TagManagement
          visible={managementOpen}
          onClose={handleManagementClose}
          onUpdated={() => void loadData()}
        />
      </>
    </Modal>
  );
}
