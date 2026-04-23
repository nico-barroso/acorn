import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavBarHeight } from '@context/NavBarHeightContext';
import { supabase } from '@lib/supabase';
import { styles } from './SaveLinkModal.styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function getOrigin(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
}

function parseMetaContent(html: string, pattern: RegExp): string | undefined {
  const match = html.match(pattern);
  return match ? match[1].trim() : undefined;
}

type PreviewMeta = {
  ogTitle?: string;
  ogImage?: string;
  faviconUrl?: string;
};

async function fetchPreviewMeta(url: string, signal: AbortSignal): Promise<PreviewMeta> {
  const response = await fetch(url, {
    signal,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Acorn-Bot/1.0)',
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const html = await response.text();
  const origin = getOrigin(url);

  const ogTitle =
    parseMetaContent(html, /<meta\s+(?:property|name)=["'](?:og:title|twitter:title)["']\s+content=["']([^"']+)["']/i) ||
    parseMetaContent(html, /<title[^>]*>([^<]+)<\/title>/i);

  const ogImage = parseMetaContent(
    html,
    /<meta\s+(?:property|name)=["'](?:og:image|twitter:image(?::src)?)["']\s+content=["']([^"']+)["']/i,
  );

  const faviconHref =
    parseMetaContent(html, /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i) ||
    parseMetaContent(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i);

  let faviconUrl: string | undefined;
  if (faviconHref) {
    faviconUrl = faviconHref.startsWith('http') ? faviconHref : `${origin}${faviconHref.startsWith('/') ? '' : '/'}${faviconHref}`;
  } else {
    faviconUrl = `${origin}/favicon.ico`;
  }

  return { ogTitle, ogImage, faviconUrl };
}

type SaveLinkModalProps = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export function SaveLinkModal({ visible, onClose, onSaved }: SaveLinkModalProps) {
  const insets = useSafeAreaInsets();
  const { height: navBarHeight } = useNavBarHeight();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fetchAbortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [editExpanded, setEditExpanded] = useState(false);
  const [previewMeta, setPreviewMeta] = useState<PreviewMeta | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const urlValid = isValidUrl(url);
  const domain = urlValid ? getDomain(url) : '';

  const triggerPreviewFetch = useCallback((targetUrl: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (fetchAbortRef.current) fetchAbortRef.current.abort();

    setPreviewMeta(null);
    setPreviewLoading(true);

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      fetchAbortRef.current = controller;

      try {
        const meta = await fetchPreviewMeta(targetUrl, controller.signal);
        setPreviewMeta(meta);
      } catch {
        // Silently ignore — preview is best-effort
      } finally {
        setPreviewLoading(false);
      }
    }, 600);
  }, []);

  useEffect(() => {
    if (urlValid) {
      triggerPreviewFetch(url.trim());
    } else {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (fetchAbortRef.current) fetchAbortRef.current.abort();
      setPreviewMeta(null);
      setPreviewLoading(false);
    }
  }, [url, urlValid]);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(SCREEN_HEIGHT);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (fetchAbortRef.current) fetchAbortRef.current.abort();
      setUrl('');
      setTitle('');
      setNotes('');
      setError('');
      setLoading(false);
      setEditExpanded(false);
      setPreviewMeta(null);
      setPreviewLoading(false);
    }
  }, [visible]);

  const handleClose = () => {
    Keyboard.dismiss();
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleSave = async () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError('La URL es obligatoria.');
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError('Introduce una URL válida (https://...).');
      return;
    }

    setLoading(true);
    setError('');

    const { data: linkData, error: fnError } = await supabase.functions.invoke('link-test', {
      body: {
        url: trimmedUrl,
        title: title.trim() || undefined,
        description: notes.trim() || undefined,
      },
    });

    setLoading(false);

    if (fnError) {
      setError('No se pudo guardar el enlace. Inténtalo de nuevo.');
      return;
    }

    const itemId = linkData?.data?.id;
    if (itemId) {
      void supabase.functions.invoke('extract-metadata-test', {
        body: { item_id: itemId, url: trimmedUrl },
      });
    }

    onSaved();
    handleClose();
  };

  if (!visible) return null;

  const previewTitle = title.trim() || previewMeta?.ogTitle || domain;
  const previewTag = '';
  const ogImage = previewMeta?.ogImage;
  const faviconUrl = previewMeta?.faviconUrl;

  return (
    <View style={styles.backdrop}>
      <TouchableOpacity style={styles.backdropPress} activeOpacity={1} onPress={handleClose} />
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
            paddingBottom: keyboardHeight > 0
              ? keyboardHeight + 16
              : insets.bottom + navBarHeight + 16,
          },
        ]}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Guardar enlace</Text>
          <Text style={styles.subtitle}>Pega la URL del recurso que quieres guardar.</Text>

          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="https://..."
            placeholderTextColor="#8B8179"
            value={url}
            onChangeText={(text) => {
              setUrl(text);
              if (error) setError('');
              if (!isValidUrl(text)) setEditExpanded(false);
            }}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            editable={!loading}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {urlValid && (
            <>
              {/* Preview card */}
              <TouchableOpacity
                style={styles.previewCard}
                activeOpacity={0.9}
                disabled
              >
                {ogImage ? (
                  <ImageBackground
                    source={{ uri: ogImage }}
                    style={styles.previewImageBg}
                    imageStyle={styles.previewImageBgImage}
                  >
                    <View style={styles.previewImageOverlay} />
                    <View style={styles.previewRow}>
                      <View style={styles.previewTextLayout}>
                        <Text style={[styles.previewTitle, styles.previewTitleOnImage]} numberOfLines={2}>
                          {previewLoading && !previewTitle ? domain : previewTitle}
                        </Text>
                        <View style={styles.previewSourceRow}>
                          {faviconUrl ? (
                            <Image
                              source={{ uri: faviconUrl }}
                              style={styles.previewFavicon}
                              onError={() => {}}
                            />
                          ) : null}
                          <Text style={[styles.previewSource, styles.previewSourceOnImage]}>{domain}</Text>
                        </View>
                        {previewTag ? (
                          <View style={styles.previewTag}>
                            <Text style={styles.previewTagText}>#{previewTag}</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </ImageBackground>
                ) : (
                  <View style={styles.previewRow}>
                    <View style={styles.previewThumbnail}>
                      {faviconUrl && !previewLoading ? (
                        <Image
                          source={{ uri: faviconUrl }}
                          style={styles.previewThumbnailIcon}
                          onError={() => {}}
                        />
                      ) : null}
                    </View>
                    <View style={styles.previewTextLayout}>
                      <Text style={styles.previewTitle} numberOfLines={2}>
                        {previewLoading && !previewMeta ? domain : previewTitle}
                      </Text>
                      <View style={styles.previewSourceRow}>
                        {faviconUrl && !previewLoading ? (
                          <Image
                            source={{ uri: faviconUrl }}
                            style={styles.previewFavicon}
                            onError={() => {}}
                          />
                        ) : null}
                        <Text style={styles.previewSource}>{domain}</Text>
                      </View>
                      {previewTag ? (
                        <View style={styles.previewTag}>
                          <Text style={styles.previewTagText}>#{previewTag}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              {/* Editar toggle */}
              <TouchableOpacity
                style={styles.editToggle}
                onPress={() => setEditExpanded((v) => !v)}
                activeOpacity={0.7}
              >
                <Text style={styles.editToggleText}>
                  {editExpanded ? 'Ocultar' : 'Editar'}
                </Text>
              </TouchableOpacity>

              {/* Campos de edición expandibles */}
              {editExpanded && (
                <View style={styles.editFields}>
                  <Text style={styles.label}>Título</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Título del recurso (opcional)"
                    placeholderTextColor="#8B8179"
                    value={title}
                    onChangeText={setTitle}
                    editable={!loading}
                  />

                  <Text style={styles.label}>Notas</Text>
                  <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="Añade notas o descripción (opcional)"
                    placeholderTextColor="#8B8179"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    editable={!loading}
                  />
                </View>
              )}
            </>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose} activeOpacity={0.7}>
              <Text style={styles.cancelLabel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, !urlValid && styles.confirmButtonDisabled]}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={loading || !urlValid}
            >
              <Text style={styles.confirmLabel}>{loading ? 'Guardando...' : 'Guardar'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
