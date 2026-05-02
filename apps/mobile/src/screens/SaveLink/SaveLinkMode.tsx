import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '@lib/supabase';
import { styles } from './SaveLinkModal.styles';

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

type SaveLinkModeProps = {
  initialUrl?: string;
  onSave: () => void;
  onClose: () => void;
};

export function SaveLinkMode({ initialUrl, onSave, onClose }: SaveLinkModeProps) {
  const fetchAbortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [url, setUrl] = useState(initialUrl ?? '');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [editExpanded, setEditExpanded] = useState(false);
  const [previewMeta, setPreviewMeta] = useState<PreviewMeta | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewFaviconError, setPreviewFaviconError] = useState(false);

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
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (fetchAbortRef.current) fetchAbortRef.current.abort();
    };
  }, []);

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
        },
      });
    }

    onSave();
  };

  const previewTitle = title.trim() || previewMeta?.ogTitle || domain;
  const ogImage = previewMeta?.ogImage;
  const faviconUrl = previewMeta?.faviconUrl;
  const previewFaviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null;

  return (
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
                ) : previewFaviconUrl && !previewFaviconError ? (
                  <Image source={{ uri: previewFaviconUrl }} style={styles.previewThumbnailIcon} resizeMode="contain" onError={() => setPreviewFaviconError(true)} />
                ) : faviconUrl ? (
                  <Image source={{ uri: faviconUrl }} style={styles.previewThumbnailIcon} resizeMode="contain" />
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
        <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
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
  );
}
