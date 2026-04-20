import React from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { supabase } from '../../../lib/supabase';
import { Button } from '../../components/Button/Button';
import { styles } from './ItemDetail.styles';

type DetailRecord = {
  id: string;
  user_id: string;
  title: string | null;
  description: string | null;
  is_read: boolean;
  created_at: string;
  url: string | null;
  domain: string | null;
  og_image_url: string | null;
  preview_image_url: string | null;
  tags: string[] | null;
};

type ItemDetailProps = {
  visible: boolean;
  itemId: string | null;
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

export function ItemDetail({ visible, itemId, onClose, onUpdated }: ItemDetailProps) {
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  const [isEditing, setIsEditing] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isRead, setIsRead] = React.useState(false);
  const [tags, setTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState('');

  const [url, setUrl] = React.useState('');
  const [domain, setDomain] = React.useState('');
  const [createdAt, setCreatedAt] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');

  const loadDetail = React.useCallback(async () => {
    if (!visible || !itemId) {
      return;
    }

    setLoading(true);
    setError('');
    setIsEditing(false);

    const { data, error: detailError } = await supabase
      .from('items_with_links')
      .select(
        'id,user_id,title,description,is_read,created_at,url,domain,og_image_url,preview_image_url,tags',
      )
      .eq('id', itemId)
      .single();

    setLoading(false);

    if (detailError || !data) {
      setError('No se pudo cargar el detalle del recurso.');
      return;
    }

    const record = data as DetailRecord;

    setTitle(record.title ?? '');
    setNotes(record.description ?? '');
    setIsRead(Boolean(record.is_read));
    setTags((record.tags ?? []).filter(Boolean));
    setUrl(record.url ?? '');
    setDomain(record.domain ?? 'Dominio no disponible');
    setCreatedAt(new Date(record.created_at).toLocaleString());
    setImageUrl(record.og_image_url ?? record.preview_image_url ?? '');
  }, [itemId, visible]);

  React.useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const handleToggleRead = async (nextValue: boolean) => {
    if (!itemId) {
      return;
    }

    setIsRead(nextValue);

    const { error: updateError } = await supabase
      .from('items')
      .update({ is_read: nextValue, updated_at: new Date().toISOString() })
      .eq('id', itemId);

    if (updateError) {
      setIsRead(!nextValue);
      setError('No se pudo actualizar el estado de lectura.');
      return;
    }

    onUpdated?.();
  };

  const handleAddTag = () => {
    const normalized = newTag.trim();
    if (!normalized) {
      return;
    }
    if (tags.some((tag) => tag.toLowerCase() === normalized.toLowerCase())) {
      setNewTag('');
      return;
    }

    setTags((current) => [...current, normalized]);
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((current) => current.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!itemId) {
      return;
    }

    setSaving(true);
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setError('Debes iniciar sesion para editar este recurso.');
      return;
    }

    const { error: itemError } = await supabase
      .from('items')
      .update({
        title: title.trim() || null,
        description: notes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .eq('user_id', user.id);

    if (itemError) {
      setSaving(false);
      setError('No se pudieron guardar los cambios del recurso.');
      return;
    }

    const normalizedTags = Array.from(
      new Set(
        tags
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    );

    const tagsToUpsert = normalizedTags
      .map((tag) => ({
        user_id: user.id,
        name: tag,
        slug: slugifyTag(tag),
      }))
      .filter((tag) => Boolean(tag.slug));

    const { error: clearRelationError } = await supabase.from('item_tags').delete().eq('item_id', itemId);
    if (clearRelationError) {
      setSaving(false);
      setError('No se pudieron sincronizar las etiquetas.');
      return;
    }

    if (tagsToUpsert.length > 0) {
      const { error: upsertError } = await supabase
        .from('tags')
        .upsert(tagsToUpsert, { onConflict: 'user_id,slug' });

      if (upsertError) {
        setSaving(false);
        setError('No se pudieron guardar las etiquetas.');
        return;
      }

      const slugs = tagsToUpsert.map((tag) => tag.slug);
      const { data: persistedTags, error: readTagsError } = await supabase
        .from('tags')
        .select('id')
        .eq('user_id', user.id)
        .in('slug', slugs);

      if (readTagsError) {
        setSaving(false);
        setError('No se pudieron vincular las etiquetas.');
        return;
      }

      const relations = (persistedTags ?? []).map((tag) => ({
        item_id: itemId,
        tag_id: tag.id,
      }));

      if (relations.length > 0) {
        const { error: relationError } = await supabase.from('item_tags').insert(relations);

        if (relationError) {
          setSaving(false);
          setError('No se pudieron vincular las etiquetas al recurso.');
          return;
        }
      }
    }

    setSaving(false);
    setIsEditing(false);
    onUpdated?.();
    await loadDetail();
  };

  const handleOpenUrl = () => {
    if (!url) {
      return;
    }
    void Linking.openURL(url);
  };

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.panel}>
              {loading ? (
                <View style={styles.loading}>
                  <ActivityIndicator />
                  <Text style={styles.subtitle}>Cargando detalle...</Text>
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.title}>{title || 'Recurso guardado'}</Text>
                  <Text style={styles.subtitle}>{domain}</Text>
                  <Text style={styles.subtitle}>Guardado: {createdAt}</Text>

                  {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}

                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Leido</Text>
                    <Switch value={isRead} onValueChange={handleToggleRead} />
                  </View>

                  {!isEditing ? (
                    <>
                      <View style={styles.row}>
                        <Text style={styles.rowTitle}>Descripcion / notas</Text>
                        <Text style={styles.paragraph}>{notes || 'Sin notas todavia.'}</Text>
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.rowTitle}>Etiquetas asociadas</Text>
                        <View style={styles.tagList}>
                          {tags.length > 0 ? (
                            tags.map((tag) => (
                              <View style={styles.tagChip} key={tag}>
                                <Text style={styles.tagChipText}>#{tag}</Text>
                              </View>
                            ))
                          ) : (
                            <Text style={styles.subtitle}>Sin etiquetas</Text>
                          )}
                        </View>
                      </View>

                      <View style={styles.footerRow}>
                        <Button label='Editar recurso' onPress={() => setIsEditing(true)} />
                        <View style={styles.linkButton}>
                          <Button label='Abrir enlace en navegador' onPress={handleOpenUrl} variant='secondary' />
                        </View>
                        <Button label='Cerrar' onPress={onClose} variant='secondary' />
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.row}>
                        <Text style={styles.rowTitle}>Titulo</Text>
                        <TextInput style={styles.input} value={title} onChangeText={setTitle} />
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.rowTitle}>Notas</Text>
                        <TextInput
                          style={[styles.input, styles.textarea]}
                          value={notes}
                          onChangeText={setNotes}
                          multiline
                        />
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.rowTitle}>Etiquetas</Text>
                        <View style={styles.tagList}>
                          {tags.map((tag) => (
                            <TouchableOpacity
                              key={tag}
                              style={styles.tagEditableChip}
                              onPress={() => handleRemoveTag(tag)}
                            >
                              <Text style={styles.tagChipText}>#{tag}</Text>
                              <Text style={styles.removeTagText}>x</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <View style={styles.addTagRow}>
                          <View style={styles.addTagInput}>
                            <TextInput
                              style={styles.input}
                              value={newTag}
                              onChangeText={setNewTag}
                              placeholder='Nueva etiqueta'
                            />
                          </View>
                          <View style={styles.addTagButton}>
                            <Button label='Anadir' onPress={handleAddTag} />
                          </View>
                        </View>
                      </View>

                      {error ? <Text style={styles.error}>{error}</Text> : null}

                      <View style={styles.footerRow}>
                        <Button
                          label={saving ? 'Guardando...' : 'Guardar cambios'}
                          onPress={handleSave}
                          disabled={saving}
                        />
                        <Button
                          label='Cancelar edicion'
                          variant='secondary'
                          onPress={() => setIsEditing(false)}
                          disabled={saving}
                        />
                      </View>
                    </>
                  )}
                </ScrollView>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
