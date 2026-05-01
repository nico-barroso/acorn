import React, { useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../../lib/supabase';
import { useSession } from '@context/SessionContext';
import { styles } from './TagPickerModal.styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const PRESET_COLORS = [
  '#C06E52', '#8B6914', '#2D6A4F', '#1D3557',
  '#9B2226', '#457B9D', '#6A4C93', '#43281C',
];

type TagOption = { id: string; name: string; color_hex: string | null; usageCount?: number };

type TagPickerModalProps = {
  visible: boolean;
  itemId: string | null;
  onClose: () => void;
  onSaved: () => void;
};

const MAX_TAGS = 4;
const MAX_TOTAL_TAGS = 10;

function slugifyTag(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function TagPickerModal({ visible, itemId, onClose, onSaved }: TagPickerModalProps) {
  const { session } = useSession();
  const insets = useSafeAreaInsets();
  const user = session?.user;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const mgmtOpacity = useRef(new Animated.Value(0)).current;
  const mgmtTranslateY = useRef(new Animated.Value(12)).current;
  const [mgmtVisible, setMgmtVisible] = React.useState(false);

  const [allTags, setAllTags] = React.useState<TagOption[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [managementOpen, setManagementOpen] = React.useState(false);

  // Management state
  const [newTagName, setNewTagName] = React.useState('');
  const [newTagColor, setNewTagColor] = React.useState(PRESET_COLORS[0]);
  const [editingTagId, setEditingTagId] = React.useState<string | null>(null);
  const [editingTagName, setEditingTagName] = React.useState('');
  const [editingTagColor, setEditingTagColor] = React.useState(PRESET_COLORS[0]);
  const [mgmtError, setMgmtError] = React.useState('');

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  }, [visible]);



  const dismiss = (callback?: () => void) => {
    Keyboard.dismiss();
    Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 200, useNativeDriver: true })
      .start(() => { translateY.setValue(SCREEN_HEIGHT); callback?.(); });
  };

  const handleClose = () => dismiss(onClose);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 0,
      onPanResponderMove: (_, g) => { if (g.dy > 0) translateY.setValue(g.dy); },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100) dismiss(onClose);
        else Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      },
    }),
  ).current;

  const loadData = React.useCallback(async () => {
    if (!visible || !itemId || !user) return;
    setLoading(true);
    const [tagsResult, itemTagsResult] = await Promise.all([
      supabase.from('tags').select('id,name,color_hex').eq('user_id', user.id).order('name'),
      supabase.from('item_tags').select('tag_id').eq('item_id', itemId),
    ]);
    setAllTags((tagsResult.data ?? []) as TagOption[]);
    setSelectedIds(((itemTagsResult.data ?? []) as { tag_id: string }[]).map((r) => r.tag_id));
    setLoading(false);
  }, [visible, itemId]);

  const loadTagsWithCount = React.useCallback(async () => {
    if (!user) return;
    const { data: tagRows } = await supabase
      .from('tags').select('id,name,color_hex').eq('user_id', user.id).order('name');
    const tags = (tagRows ?? []) as TagOption[];
    if (tags.length === 0) { setAllTags([]); return; }

    const { data: relationRows } = await supabase
      .from('item_tags').select('tag_id').in('tag_id', tags.map((t) => t.id));

    const countMap = new Map<string, number>();
    ((relationRows ?? []) as { tag_id: string }[]).forEach((r) => {
      countMap.set(r.tag_id, (countMap.get(r.tag_id) ?? 0) + 1);
    });

    setAllTags(tags.map((t) => ({ ...t, usageCount: countMap.get(t.id) ?? 0 })));
  }, [user]);

  React.useEffect(() => { void loadData(); }, [loadData]);

  React.useEffect(() => {
    if (!visible) {
      setAllTags([]); setSelectedIds([]); setSaving(false);
      setManagementOpen(false); setMgmtVisible(false); mgmtOpacity.setValue(0); mgmtTranslateY.setValue(12);
      setNewTagName(''); setNewTagColor(PRESET_COLORS[0]);
      setEditingTagId(null); setEditingTagName(''); setMgmtError('');
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
      await supabase.from('item_tags').insert(selectedIds.map((tag_id) => ({ item_id: itemId, tag_id })));
    }
    setSaving(false);
    dismiss(onSaved);
  };

  const createTag = async () => {
    const normalized = newTagName.trim();
    const slug = slugifyTag(normalized);
    if (!normalized || !slug) { setMgmtError('Introduce un nombre válido.'); return; }
    if (allTags.length >= MAX_TOTAL_TAGS) { setMgmtError(`Máximo ${MAX_TOTAL_TAGS} etiquetas.`); return; }
    if (allTags.some((t) => slugifyTag(t.name) === slug)) { setMgmtError('Ya existe una etiqueta con ese nombre.'); return; }
    if (!user) return;
    setSaving(true); setMgmtError('');
    const { error } = await supabase.from('tags').insert({ user_id: user.id, name: normalized, slug, color_hex: newTagColor });
    if (error) { setSaving(false); setMgmtError('No se pudo crear la etiqueta.'); return; }
    setNewTagName(''); setNewTagColor(PRESET_COLORS[0]); setSaving(false);
    await loadTagsWithCount();
  };

  const saveTagEdition = async (tagId: string) => {
    const normalized = editingTagName.trim();
    const slug = slugifyTag(normalized);
    if (!normalized || !slug) { setMgmtError('El nombre editado no es válido.'); return; }
    if (allTags.some((t) => t.id !== tagId && slugifyTag(t.name) === slug)) { setMgmtError('Ya existe una etiqueta con ese nombre.'); return; }
    if (!user) return;
    setSaving(true); setMgmtError('');
    const { error } = await supabase.from('tags').update({ name: normalized, slug, color_hex: editingTagColor }).eq('id', tagId).eq('user_id', user.id);
    if (error) { setSaving(false); setMgmtError('No se pudo actualizar la etiqueta.'); return; }
    setEditingTagId(null); setEditingTagName(''); setSaving(false);
    await loadTagsWithCount();
  };

  const deleteTag = (tag: TagOption) => {
    Alert.alert('Eliminar etiqueta', `Se eliminará "${tag.name}" de todos tus recursos.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: () => void (async () => {
          if (!user) return;
          setSaving(true);
          await supabase.from('item_tags').delete().eq('tag_id', tag.id);
          await supabase.from('tags').delete().eq('id', tag.id).eq('user_id', user.id);
          setSelectedIds((prev) => prev.filter((id) => id !== tag.id));
          await loadTagsWithCount();
          setSaving(false);
        })(),
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
        >
          <View style={styles.handleContainer} {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          >

              {/* ── SELECTOR ── */}
              <Text style={styles.title}>Etiquetas</Text>
              <Text style={styles.subtitle}>Selecciona hasta {MAX_TAGS} etiquetas para este recurso.</Text>

              {loading ? (
                <View style={styles.loadingContainer}><ActivityIndicator /></View>
              ) : allTags.length === 0 && !managementOpen ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Todavía no tienes etiquetas.</Text>
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
                          style={[styles.chip, selected && { backgroundColor: tag.color_hex ?? '#43281C' }, disabled && styles.chipDisabled]}
                          onPress={() => toggleTag(tag.id)}
                          activeOpacity={0.75}
                          disabled={disabled}
                        >
                          <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>#{tag.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {allTags.length > 0 && <Text style={styles.counter}>{selectedIds.length}/{MAX_TAGS} seleccionadas</Text>}
                  {allTags.length > 0 && (
                    <TouchableOpacity
                      style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                      onPress={() => void handleSave()}
                      activeOpacity={0.8}
                      disabled={saving}
                    >
                      <Text style={styles.saveButtonLabel}>{saving ? 'Guardando...' : 'Guardar'}</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}

              {/* ── GESTIONAR ── */}
              <TouchableOpacity
                style={styles.manageButton}
                onPress={() => {
                  if (managementOpen) {
                    Animated.parallel([
                      Animated.timing(mgmtOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
                      Animated.timing(mgmtTranslateY, { toValue: 12, duration: 160, useNativeDriver: true }),
                    ]).start(() => { setMgmtVisible(false); setManagementOpen(false); });
                  } else {
                    setManagementOpen(true);
                    setMgmtVisible(true);
                    mgmtOpacity.setValue(0);
                    mgmtTranslateY.setValue(12);
                    Animated.parallel([
                      Animated.timing(mgmtOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
                      Animated.timing(mgmtTranslateY, { toValue: 0, duration: 220, useNativeDriver: true }),
                    ]).start();
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.manageLink}>{managementOpen ? 'Ocultar gestión' : 'Gestionar etiquetas'}</Text>
              </TouchableOpacity>

              {mgmtVisible && (
                <Animated.View style={{ opacity: mgmtOpacity, transform: [{ translateY: mgmtTranslateY }] }}>
                <View style={styles.managementSection}>
                  <Text style={styles.managementTitle}>Crear nueva etiqueta</Text>

                  <View style={styles.createRow}>
                    <TextInput
                      value={newTagName}
                      onChangeText={setNewTagName}
                      style={styles.input}
                      placeholder="Nueva etiqueta"
                      placeholderTextColor="#8B8179"
                      editable={!saving}
                    />
                  </View>
                  <View style={styles.colorRow}>
                    {PRESET_COLORS.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.colorSwatch, { backgroundColor: c }, newTagColor === c && styles.colorSwatchSelected]}
                        onPress={() => setNewTagColor(c)}
                        activeOpacity={0.8}
                      />
                    ))}
                  </View>
                  <TouchableOpacity
                    style={[styles.saveButton, styles.createButton, saving && styles.saveButtonDisabled]}
                    onPress={() => void createTag()}
                    activeOpacity={0.8}
                    disabled={saving}
                  >
                    <Text style={styles.saveButtonLabel}>{saving ? 'Creando...' : 'Crear etiqueta'}</Text>
                  </TouchableOpacity>

                  {mgmtError ? <Text style={styles.error}>{mgmtError}</Text> : null}

                  <View style={styles.sectionDivider} />
                  <Text style={styles.sectionLabel}>Gestionar mis etiquetas</Text>

                  {allTags.map((tag) => {
                    const isEditing = editingTagId === tag.id;
                    return (
                      <View key={tag.id} style={styles.tagCard}>
                        {isEditing ? (
                          <>
                            <TextInput
                              value={editingTagName}
                              onChangeText={setEditingTagName}
                              style={styles.input}
                              placeholder="Nombre de etiqueta"
                              placeholderTextColor="#8B8179"
                              editable={!saving}
                            />
                            <View style={styles.colorRow}>
                              {PRESET_COLORS.map((c) => (
                                <TouchableOpacity
                                  key={c}
                                  style={[styles.colorSwatch, { backgroundColor: c }, editingTagColor === c && styles.colorSwatchSelected]}
                                  onPress={() => setEditingTagColor(c)}
                                  activeOpacity={0.8}
                                />
                              ))}
                            </View>
                            <View style={styles.actionsRow}>
                              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={() => void saveTagEdition(tag.id)} activeOpacity={0.8}>
                                <Text style={styles.actionBtnPrimaryLabel}>Guardar</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]} onPress={() => { setEditingTagId(null); setEditingTagName(''); setMgmtError(''); }} activeOpacity={0.8}>
                                <Text style={styles.actionBtnSecondaryLabel}>Cancelar</Text>
                              </TouchableOpacity>
                            </View>
                          </>
                        ) : (
                          <View style={styles.tagRow}>
                            <View style={[styles.tagPill, { backgroundColor: tag.color_hex ?? '#43281C' }]}>
                              <Text style={styles.tagPillLabel}>#{tag.name}</Text>
                            </View>
                            <View style={styles.tagActions}>
                              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]} onPress={() => { setEditingTagId(tag.id); setEditingTagName(tag.name); setEditingTagColor(tag.color_hex ?? PRESET_COLORS[0]); setMgmtError(''); }} activeOpacity={0.8}>
                                <Text style={styles.actionBtnSecondaryLabel}>Editar</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => deleteTag(tag)} activeOpacity={0.7}>
                                <Text style={styles.deleteLinkLabel}>Eliminar</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
                </Animated.View>
              )}

            </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
