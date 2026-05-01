import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavBarHeight } from '@context/NavBarHeightContext';
import { supabase } from '@lib/supabase';
import { useSaveFileFlow } from '../../../hooks/useSaveFileFlow';
import { styles } from './SaveLinkModal.styles';
import FileIcon from '../../../assets/icons/file-icon.svg';

const SCREEN_HEIGHT = Dimensions.get('window').height;

type Mode = 'link' | 'file';

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

function formatBytes(size: number) {
  if (!size) return 'Tamaño no disponible';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
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
  initialUrl?: string;
  onClose: () => void;
  onSaved: () => void;
};

export function SaveLinkModal({ visible, initialUrl, onClose, onSaved }: SaveLinkModalProps) {
  const insets = useSafeAreaInsets();
  const { height: navBarHeight } = useNavBarHeight();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fetchAbortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mode, setMode] = useState<Mode>('link');

  // Link state
  const [url, setUrl] = useState(initialUrl ?? '');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [editExpanded, setEditExpanded] = useState(false);
  const [previewMeta, setPreviewMeta] = useState<PreviewMeta | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // File state
  const { pickedFile, loading: fileLoading, progress, error: fileError, pickFile, confirmUpload, resetFlow } = useSaveFileFlow();
  const [editedFileName, setEditedFileName] = useState('');

  const [keyboardHeight, setKeyboardHeight] = useState(0);

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
        // best-effort
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
    const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const hideEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
    const show = Keyboard.addListener(showEvent, (e) => setKeyboardHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => { show.remove(); hide.remove(); };
  }, []);

  useEffect(() => {
    if (pickedFile) setEditedFileName(pickedFile.name);
  }, [pickedFile]);

  const resetAll = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (fetchAbortRef.current) fetchAbortRef.current.abort();
    setMode('link');
    setUrl(initialUrl ?? '');
    setTitle('');
    setNotes('');
    setLinkError('');
    setLinkLoading(false);
    setEditExpanded(false);
    setPreviewMeta(null);
    setPreviewLoading(false);
    setEditedFileName('');
    resetFlow();
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } else {
      translateY.setValue(SCREEN_HEIGHT);
      resetAll();
    }
  }, [visible]);

  const handleClose = () => {
    Keyboard.dismiss();
    Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 200, useNativeDriver: true }).start(() => onClose());
  };

  const handleSaveLink = async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || !isValidUrl(trimmedUrl)) {
      setLinkError('Introduce una URL válida (https://...).');
      return;
    }

    setLinkLoading(true);
    setLinkError('');

    const { data: linkData, error: fnError } = await supabase.functions.invoke('link-test', {
      body: {
        url: trimmedUrl,
        title: title.trim() || previewMeta?.ogTitle || undefined,
        description: notes.trim() || undefined,
      },
    });

    setLinkLoading(false);

    if (fnError) {
      setLinkError('No se pudo guardar el enlace. Inténtalo de nuevo.');
      return;
    }

    const itemId = linkData?.data?.id;
    if (itemId) {
      void supabase.functions.invoke('extract-metadata-test', {
        body: {
          item_id: itemId,
          url: trimmedUrl,
          og_title: previewMeta?.ogTitle ?? undefined,
          og_image_url: previewMeta?.ogImage ?? undefined,
          favicon_url: previewMeta?.faviconUrl ?? undefined,
        },
      });
    }

    onSaved();
    handleClose();
  };

  const handleSaveFile = async () => {
    await confirmUpload(editedFileName.trim() || undefined);
    onSaved();
    handleClose();
  };

  if (!visible) return null;

  const previewTitle = title.trim() || previewMeta?.ogTitle || domain;
  const ogImage = previewMeta?.ogImage;
  const faviconUrl = previewMeta?.faviconUrl;
  const previewFaviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null;

  return (
    <View style={styles.backdrop}>
      <TouchableOpacity style={styles.backdropPress} activeOpacity={1} onPress={handleClose} />
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY }] },
        ]}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: keyboardHeight > 0 ? keyboardHeight + 16 : insets.bottom + navBarHeight + 32,
          }}
        >
          <Text style={styles.title}>Guardar recurso</Text>

          {/* Toggle modo */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeTab, mode === 'link' && styles.modeTabActive]}
              onPress={() => setMode('link')}
              activeOpacity={0.7}
            >
              <Text style={[styles.modeTabText, mode === 'link' && styles.modeTabTextActive]}>Enlace</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeTab, mode === 'file' && styles.modeTabActive]}
              onPress={() => setMode('file')}
              activeOpacity={0.7}
            >
              <Text style={[styles.modeTabText, mode === 'file' && styles.modeTabTextActive]}>Archivo</Text>
            </TouchableOpacity>
          </View>

          {/* ── MODO ENLACE ── */}
          {mode === 'link' && (
            <>
              <Text style={styles.subtitle}>Pega la URL del recurso que quieres guardar.</Text>

              <TextInput
                style={[styles.input, linkError ? styles.inputError : null]}
                placeholder="https://..."
                placeholderTextColor="#8B8179"
                value={url}
                onChangeText={(text) => {
                  setUrl(text);
                  if (linkError) setLinkError('');
                  if (!isValidUrl(text)) setEditExpanded(false);
                }}
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                editable={!linkLoading}
              />

              {linkError ? <Text style={styles.error}>{linkError}</Text> : null}

              {urlValid && (
                <>
                  <View style={styles.previewCard}>
                    <View style={styles.previewRow}>
                      <View style={styles.previewThumbnail}>
                        {ogImage ? (
                          <Image source={{ uri: ogImage }} style={styles.previewThumbnailImage} resizeMode="cover" />
                        ) : previewFaviconUrl ? (
                          <Image source={{ uri: previewFaviconUrl }} style={styles.previewThumbnailIcon} resizeMode="contain" onError={() => {}} />
                        ) : null}
                      </View>
                      <View style={styles.previewTextLayout}>
                        <Text style={styles.previewTitle} numberOfLines={2} ellipsizeMode="tail">
                          {previewLoading && !previewMeta ? domain : previewTitle}
                        </Text>
                        <View style={styles.previewSourceRow}>
                          <Text style={styles.previewSourceEmoji}>🔗</Text>
                          <Text style={styles.previewSource}>{domain}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.editToggle}
                    onPress={() => setEditExpanded((v) => !v)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.editToggleText}>{editExpanded ? 'Ocultar' : 'Editar'}</Text>
                  </TouchableOpacity>

                  {editExpanded && (
                    <View style={styles.editFields}>
                      <Text style={styles.label}>Título</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Título del recurso (opcional)"
                        placeholderTextColor="#8B8179"
                        value={title}
                        onChangeText={setTitle}
                        editable={!linkLoading}
                      />
                      <Text style={styles.label}>Notas</Text>
                      <TextInput
                        style={[styles.input, styles.textarea]}
                        placeholder="Añade notas o descripción (opcional)"
                        placeholderTextColor="#8B8179"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        editable={!linkLoading}
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
                  style={[styles.confirmButton, (!urlValid || previewLoading) && styles.confirmButtonDisabled]}
                  onPress={handleSaveLink}
                  activeOpacity={0.7}
                  disabled={linkLoading || !urlValid || previewLoading}
                >
                  <Text style={styles.confirmLabel}>{linkLoading ? 'Guardando...' : previewLoading ? 'Cargando...' : 'Guardar'}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ── MODO ARCHIVO ── */}
          {mode === 'file' && (
            <>
              <Text style={styles.subtitle}>Selecciona un archivo de tu dispositivo para guardarlo.</Text>

              <TouchableOpacity
                style={styles.filePickButton}
                onPress={pickFile}
                activeOpacity={0.7}
                disabled={fileLoading}
              >
                <Text style={styles.filePickButtonText}>
                  {pickedFile ? 'Cambiar archivo' : 'Seleccionar archivo'}
                </Text>
              </TouchableOpacity>

              {pickedFile && (
                <>
                  <View style={styles.previewCard}>
                    <View style={styles.previewRow}>
                      <View style={styles.previewThumbnail}>
                        <FileIcon width={62} height={62} />
                      </View>
                      <View style={styles.previewTextLayout}>
                        <Text style={styles.previewTitle} numberOfLines={2} ellipsizeMode="tail">
                          {editedFileName || pickedFile.name}
                        </Text>
                        <View style={styles.previewSourceRow}>
                          <Text style={styles.previewSourceEmoji}>📄</Text>
                          <Text style={styles.previewSource}>{formatBytes(pickedFile.size)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.label}>Nombre</Text>
                  <TextInput
                    style={styles.input}
                    value={editedFileName}
                    onChangeText={setEditedFileName}
                    placeholder="Nombre del archivo"
                    placeholderTextColor="#8B8179"
                    editable={!fileLoading}
                  />
                </>
              )}

              {fileError ? <Text style={styles.error}>{fileError}</Text> : null}
              {fileLoading ? <Text style={styles.fileProgress}>Subiendo... {progress}%</Text> : null}

              <View style={styles.buttons}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleClose} activeOpacity={0.7}>
                  <Text style={styles.cancelLabel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, (!pickedFile || fileLoading) && styles.confirmButtonDisabled]}
                  onPress={handleSaveFile}
                  activeOpacity={0.7}
                  disabled={!pickedFile || fileLoading}
                >
                  <Text style={styles.confirmLabel}>{fileLoading ? 'Subiendo...' : 'Guardar'}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
