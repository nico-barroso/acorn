import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
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
import { useQueryClient } from '@tanstack/react-query';

import { supabase } from '../../../lib/supabase';
import { useSession } from '@context/SessionContext';
import { queryKeys } from '../../lib/queryKeys';
import { Tag } from '../../components/Tag/Tag';
import { styles } from './ItemDetail.styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

type TagDetail = { name: string; color_hex: string | null };

type ItemDetailProps = {
  visible: boolean;
  itemId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
};

export function ItemDetail({ visible, itemId, onClose, onUpdated }: ItemDetailProps) {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const queryClient = useQueryClient();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [draftTitle, setDraftTitle] = React.useState('');
  const [draftNotes, setDraftNotes] = React.useState('');
  const [tags, setTags] = React.useState<TagDetail[]>([]);
  const [url, setUrl] = React.useState('');
  const [domain, setDomain] = React.useState('');
  const [createdAt, setCreatedAt] = React.useState('');
  const [isFile, setIsFile] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  }, [visible]);

  React.useEffect(() => {
    if (!visible) { setError(''); setIsEditing(false); }
  }, [visible]);

  const dismiss = (callback?: () => void) => {
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

  const loadDetail = React.useCallback(async () => {
    if (!visible || !itemId || !session?.user) return;
    setLoading(true);
    setError('');

    // Check if tag colors are already in React Query cache
    const cachedTags = queryClient.getQueryData<{ name: string; slug: string | null; color_hex: string | null }[]>(
      queryKeys.tags(session.user.id),
    );

    const [{ data, error: detailError }, tagFetchResult] = await Promise.all([
      supabase
        .from('items_with_links')
        .select('id,type,title,description,is_read,created_at,url,domain,tags,metadata(og_title)')
        .eq('id', itemId)
        .single(),
      cachedTags
        ? Promise.resolve({ data: cachedTags })
        : supabase.from('tags').select('name,slug,color_hex').eq('user_id', session.user.id),
    ]);

    if (detailError || !data) {
      setLoading(false);
      setError('No se pudo cargar el detalle del recurso.');
      return;
    }

    const tagRows = (tagFetchResult.data ?? []) as { name: string; slug: string | null; color_hex: string | null }[];
    const colorMap = new Map<string, string | null>();
    tagRows.forEach((t) => {
      colorMap.set(t.name, t.color_hex);
      if (t.slug) colorMap.set(t.slug, t.color_hex);
      colorMap.set(t.name.toLowerCase(), t.color_hex);
    });

    const tagNames: string[] = ((data.tags ?? []) as string[]).filter(Boolean);
    const tagDetails: TagDetail[] = tagNames.map((name) => ({ name, color_hex: colorMap.get(name) ?? null }));

    const resolvedTitle = (data.title as string | null)?.trim() || (data.metadata as { og_title?: string } | null)?.og_title?.trim() || (data.domain as string | null) || '';
    setTitle(resolvedTitle);
    setDraftTitle(resolvedTitle);
    setNotes(data.description ?? '');
    setDraftNotes(data.description ?? '');
    setTags(tagDetails);
    setUrl(data.url ?? '');
    setIsFile(data.type === 'file');
    setDomain(data.domain ?? '');
    setCreatedAt(new Date(data.created_at as string).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }));
    setLoading(false);
  }, [itemId, visible, session?.user, queryClient]);

  React.useEffect(() => { void loadDetail(); }, [loadDetail]);

  const handleSave = async () => {
    if (!itemId) return;
    setSaving(true);
    setError('');
    const { error: saveError } = await supabase
      .from('items')
      .update({ title: draftTitle.trim() || null, description: draftNotes.trim() || null, updated_at: new Date().toISOString() })
      .eq('id', itemId);
    if (saveError) { setSaving(false); setError('No se pudieron guardar los cambios.'); return; }
    setIsEditing(false);
    await loadDetail();
    setSaving(false);
    const uid = session?.user.id;
    if (uid) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.items(uid) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.folders(uid) });
    }
    void queryClient.invalidateQueries({ queryKey: ['search'] });
    onUpdated?.();
  };

  const handleCancelEdit = () => {
    setDraftTitle(title);
    setDraftNotes(notes);
    setIsEditing(false);
    setError('');
  };

  const handleDelete = () => {
    Alert.alert('Eliminar recurso', '¿Estás seguro? Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          const { error: deleteError } = await supabase.from('items').delete().eq('id', itemId!);
          if (deleteError) { setError('No se pudo eliminar el recurso.'); return; }
          const uid = session?.user.id;
          if (uid) {
            void queryClient.invalidateQueries({ queryKey: queryKeys.items(uid) });
            void queryClient.invalidateQueries({ queryKey: queryKeys.folders(uid) });
          }
          void queryClient.invalidateQueries({ queryKey: ['search'] });
          onUpdated?.();
          handleClose();
        },
      },
    ]);
  };

  const handleOpenUrl = async () => {
    if (!url) return;
    const storageMarker = '/object/public/user-files/';
    const markerIndex = url.indexOf(storageMarker);
    if (markerIndex !== -1) {
      const storagePath = decodeURIComponent(url.slice(markerIndex + storageMarker.length));
      const { data: signed } = await supabase.storage.from('user-files').createSignedUrl(storagePath, 3600);
      if (signed?.signedUrl) { void Linking.openURL(signed.signedUrl); return; }
    }
    void Linking.openURL(url);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }], paddingBottom: insets.bottom + 16 }]}
        >
          <View style={styles.handleContainer} {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>

          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator />
              <Text style={styles.metaText}>Cargando...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

              {/* ── CABECERA ── */}
              <View style={styles.headerRow}>
                {isEditing ? (
                  <TextInput
                    style={styles.titleInput}
                    value={draftTitle}
                    onChangeText={setDraftTitle}
                    placeholder="Título del recurso"
                    placeholderTextColor="#8B8179"
                    multiline
                  />
                ) : (
                  <Text style={styles.title}>{title || domain || 'Sin título'}</Text>
                )}
                <TouchableOpacity onPress={isEditing ? handleCancelEdit : () => setIsEditing(true)} activeOpacity={0.7}>
                  <Text style={styles.editLink}>{isEditing ? 'Cancelar' : 'Editar'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sourceRow}>
                <Text style={styles.sourceEmoji}>{isFile ? '📄' : '🔗'}</Text>
                {domain ? <Text style={styles.metaText}>{domain}</Text> : null}
                {domain && createdAt ? <Text style={styles.dot}>·</Text> : null}
                <Text style={styles.metaText}>{createdAt}</Text>
              </View>

              {/* ── NOTAS ── */}
              <Text style={styles.sectionTitle}>Notas</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textarea}
                  value={draftNotes}
                  onChangeText={setDraftNotes}
                  placeholder="Añade una nota sobre este recurso..."
                  placeholderTextColor="#8B8179"
                  multiline
                  textAlignVertical="top"
                />
              ) : (
                <TouchableOpacity activeOpacity={0.7} onPress={() => setIsEditing(true)}>
                  <Text style={[styles.notesText, !notes && styles.notesPlaceholder]}>
                    {notes || 'Toca para añadir una nota...'}
                  </Text>
                </TouchableOpacity>
              )}

              {/* ── ETIQUETAS ── */}
              {tags.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Etiquetas</Text>
                  <View style={styles.tagsRow}>
                    {tags.map((t) => (
                      <Tag key={t.name} label={`#${t.name}`} color={t.color_hex} />
                    ))}
                  </View>
                </>
              )}

              {error ? <Text style={styles.error}>{error}</Text> : null}

              {/* ── ACCIONES ── */}
              <View style={styles.actions}>
                {isEditing ? (
                  <TouchableOpacity
                    style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
                    onPress={handleSave}
                    activeOpacity={0.8}
                    disabled={saving}
                  >
                    <Text style={styles.primaryButtonLabel}>{saving ? 'Guardando...' : 'Guardar cambios'}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.primaryButton} onPress={handleOpenUrl} activeOpacity={0.8}>
                    <Text style={styles.primaryButtonLabel}>Abrir {isFile ? 'archivo' : 'enlace'}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.7}>
                  <Text style={styles.deleteButtonText}>Eliminar recurso</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
