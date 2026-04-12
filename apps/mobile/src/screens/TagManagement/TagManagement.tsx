import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { supabase } from '../../../lib/supabase';
import { Button } from '../../components/Button/Button';
import { styles } from './TagManagement.styles';

type TagRecord = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

type ItemTagRow = {
  tag_id: string;
};

type TagWithCount = TagRecord & {
  usageCount: number;
};

type TagManagementProps = {
  visible: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

function slugifyTag(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function TagManagement({ visible, onClose, onUpdated }: TagManagementProps) {
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [tags, setTags] = React.useState<TagWithCount[]>([]);

  const [newTagName, setNewTagName] = React.useState('');
  const [editingTagId, setEditingTagId] = React.useState<string | null>(null);
  const [editingTagName, setEditingTagName] = React.useState('');

  const loadTags = React.useCallback(async () => {
    if (!visible) {
      return;
    }

    setLoading(true);
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setError('Debes iniciar sesion para gestionar etiquetas.');
      return;
    }

    const { data: tagRows, error: tagsError } = await supabase
      .from('tags')
      .select('id,name,slug,created_at')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (tagsError) {
      setLoading(false);
      setError('No se pudieron cargar tus etiquetas.');
      return;
    }

    const safeTagRows = ((tagRows ?? []) as TagRecord[]).map((tag) => ({
      ...tag,
      name: tag.name?.trim() || 'Etiqueta sin nombre',
      slug: tag.slug?.trim() || slugifyTag(tag.name),
    }));

    if (safeTagRows.length === 0) {
      setTags([]);
      setLoading(false);
      return;
    }

    const tagIds = safeTagRows.map((tag) => tag.id);
    const { data: relationRows, error: relationError } = await supabase
      .from('item_tags')
      .select('tag_id')
      .in('tag_id', tagIds);

    if (relationError) {
      setLoading(false);
      setError('No se pudo calcular el uso de etiquetas.');
      return;
    }

    const countByTagId = new Map<string, number>();
    ((relationRows ?? []) as ItemTagRow[]).forEach((row) => {
      countByTagId.set(row.tag_id, (countByTagId.get(row.tag_id) ?? 0) + 1);
    });

    setTags(
      safeTagRows.map((tag) => ({
        ...tag,
        usageCount: countByTagId.get(tag.id) ?? 0,
      })),
    );
    setLoading(false);
  }, [visible]);

  React.useEffect(() => {
    void loadTags();
  }, [loadTags]);

  React.useEffect(() => {
    if (!visible) {
      setError('');
      setNewTagName('');
      setEditingTagId(null);
      setEditingTagName('');
      setSaving(false);
    }
  }, [visible]);

  const createTag = async () => {
    const normalized = newTagName.trim();
    const slug = slugifyTag(normalized);

    if (!normalized || !slug) {
      setError('Introduce un nombre de etiqueta valido.');
      return;
    }

    if (tags.some((tag) => tag.slug.toLowerCase() === slug.toLowerCase())) {
      setError('Ya existe una etiqueta con ese nombre.');
      return;
    }

    setSaving(true);
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setError('Debes iniciar sesion para crear etiquetas.');
      return;
    }

    const { error: insertError } = await supabase.from('tags').insert({
      user_id: user.id,
      name: normalized,
      slug,
    });

    if (insertError) {
      setSaving(false);
      setError('No se pudo crear la etiqueta.');
      return;
    }

    setNewTagName('');
    setSaving(false);
    onUpdated?.();
    await loadTags();
  };

  const saveTagEdition = async (tagId: string) => {
    const normalized = editingTagName.trim();
    const slug = slugifyTag(normalized);

    if (!normalized || !slug) {
      setError('El nombre editado no es valido.');
      return;
    }

    if (tags.some((tag) => tag.id !== tagId && tag.slug.toLowerCase() === slug.toLowerCase())) {
      setError('Ya existe una etiqueta con ese nombre.');
      return;
    }

    setSaving(true);
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setError('Debes iniciar sesion para editar etiquetas.');
      return;
    }

    const { error: updateError } = await supabase
      .from('tags')
      .update({ name: normalized, slug })
      .eq('id', tagId)
      .eq('user_id', user.id);

    if (updateError) {
      setSaving(false);
      setError('No se pudo actualizar la etiqueta.');
      return;
    }

    setEditingTagId(null);
    setEditingTagName('');
    setSaving(false);
    onUpdated?.();
    await loadTags();
  };

  const deleteTag = (tag: TagWithCount) => {
    Alert.alert('Eliminar etiqueta', `Se eliminara la etiqueta "${tag.name}" de tus recursos.`, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            setSaving(true);
            setError('');

            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
              setSaving(false);
              setError('Debes iniciar sesion para eliminar etiquetas.');
              return;
            }

            const { error: deleteRelationsError } = await supabase
              .from('item_tags')
              .delete()
              .eq('tag_id', tag.id);

            if (deleteRelationsError) {
              setSaving(false);
              setError('No se pudieron desvincular los recursos de esta etiqueta.');
              return;
            }

            const { error: deleteTagError } = await supabase
              .from('tags')
              .delete()
              .eq('id', tag.id)
              .eq('user_id', user.id);

            if (deleteTagError) {
              setSaving(false);
              setError('No se pudo eliminar la etiqueta.');
              return;
            }

            setSaving(false);
            onUpdated?.();
            await loadTags();
          })();
        },
      },
    ]);
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator />
          <Text style={styles.emptyTitle}>Cargando etiquetas...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Todavia no tienes etiquetas</Text>
        <Text style={styles.emptySubtitle}>Crea tu primera etiqueta para clasificar recursos.</Text>
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
                <Text style={styles.title}>Etiquetas</Text>
                <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.closeLabel}>Cerrar</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>Crea, edita, elimina y revisa todas tus etiquetas.</Text>

              <View style={styles.createRow}>
                <TextInput
                  value={newTagName}
                  onChangeText={setNewTagName}
                  style={styles.input}
                  placeholder='Nueva etiqueta'
                  placeholderTextColor='#8B8179'
                  editable={!saving}
                />
                <View style={styles.inputAction}>
                  <Button label={saving ? 'Guardando...' : 'Crear'} onPress={() => void createTag()} disabled={saving} />
                </View>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <FlatList
                data={tags}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isEditing = editingTagId === item.id;

                  return (
                    <View style={styles.tagCard}>
                      {isEditing ? (
                        <TextInput
                          value={editingTagName}
                          onChangeText={setEditingTagName}
                          style={styles.input}
                          placeholder='Nombre de etiqueta'
                          placeholderTextColor='#8B8179'
                          editable={!saving}
                        />
                      ) : (
                        <>
                          <Text style={styles.tagName}>#{item.name}</Text>
                          <Text style={styles.tagMeta}>
                            slug: {item.slug} · {item.usageCount} recursos
                          </Text>
                        </>
                      )}

                      <View style={styles.actionsRow}>
                        {isEditing ? (
                          <>
                            <View style={styles.actionButton}>
                              <Button
                                label='Guardar'
                                onPress={() => void saveTagEdition(item.id)}
                                disabled={saving}
                              />
                            </View>
                            <View style={styles.actionButton}>
                              <Button
                                label='Cancelar'
                                variant='secondary'
                                onPress={() => {
                                  setEditingTagId(null);
                                  setEditingTagName('');
                                  setError('');
                                }}
                                disabled={saving}
                              />
                            </View>
                          </>
                        ) : (
                          <>
                            <View style={styles.actionButton}>
                              <Button
                                label='Editar'
                                variant='secondary'
                                onPress={() => {
                                  setEditingTagId(item.id);
                                  setEditingTagName(item.name);
                                  setError('');
                                }}
                                disabled={saving}
                              />
                            </View>
                            <View style={styles.actionButton}>
                              <Button
                                label='Eliminar'
                                variant='secondary'
                                onPress={() => deleteTag(item)}
                                disabled={saving}
                              />
                            </View>
                          </>
                        )}
                      </View>
                    </View>
                  );
                }}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={tags.length === 0 ? styles.listEmptyContent : styles.listContent}
                keyboardShouldPersistTaps='handled'
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
