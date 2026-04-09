import { useState } from 'react';

import { env } from '../lib/env';
import { supabase } from '../lib/supabase';

type LinkPreview = {
  id: string;
  url: string;
  domain: string;
  title: string;
  status: string;
  degraded: boolean;
};

type LinkCreateResponse = {
  data?: {
    id: string;
    url: string;
    domain: string | null;
    title: string | null;
  };
  error?: string;
};

type MetadataResponse = {
  title?: string | null;
  domain?: string | null;
  status?: string;
  degraded?: boolean;
  error?: string;
};

function normalizeUrl(rawUrl: string) {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function parseDomainFromUrl(rawUrl: string) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

async function rollbackDraftLink(itemId: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return;
  }

  await fetch(`${env.supabaseUrl}/functions/v1/links?id=${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: env.supabaseAnonKey,
    },
  });
}

export function useSaveLinkFlow() {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [processingClose, setProcessingClose] = useState(false);
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [draftItemId, setDraftItemId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const resetFlow = () => {
    setUrl('');
    setUrlError('');
    setGlobalError('');
    setPreview(null);
    setDraftItemId(null);
    setSaved(false);
    setLoadingPreview(false);
    setProcessingClose(false);
  };

  const validateUrl = () => {
    const normalizedUrl = normalizeUrl(url);

    if (!normalizedUrl) {
      setUrlError('La URL es obligatoria');
      return '';
    }

    try {
      const parsed = new URL(normalizedUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setUrlError('La URL debe empezar por http o https');
        return '';
      }
    } catch {
      setUrlError('Introduce una URL valida');
      return '';
    }

    setUrlError('');
    return normalizedUrl;
  };

  const requestPreview = async () => {
    const normalizedUrl = validateUrl();
    if (!normalizedUrl) {
      return;
    }

    setLoadingPreview(true);
    setGlobalError('');

    if (draftItemId) {
      await rollbackDraftLink(draftItemId);
      setDraftItemId(null);
    }

    const fallbackDomain = parseDomainFromUrl(normalizedUrl);

    const { data: createData, error: createError } = await supabase.functions.invoke<LinkCreateResponse>(
      'links',
      {
        method: 'POST',
        body: {
          url: normalizedUrl,
          title: fallbackDomain || normalizedUrl,
          description: '',
          is_read: false,
        },
      },
    );

    if (createError || createData?.error || !createData?.data?.id) {
      setLoadingPreview(false);
      setGlobalError('No se pudo crear el borrador del enlace. Intentalo de nuevo.');
      return;
    }

    const createdLink = createData.data;
    const createdItemId = createdLink.id;
    setDraftItemId(createdItemId);

    const { data: metadataData, error: metadataError } =
      await supabase.functions.invoke<MetadataResponse>('extract-metadata', {
        method: 'POST',
        body: {
          item_id: createdItemId,
          url: normalizedUrl,
        },
      });

    setPreview({
      id: createdItemId,
      url: normalizedUrl,
      domain: metadataData?.domain ?? createdLink.domain ?? fallbackDomain,
      title: metadataData?.title ?? createdLink.title ?? normalizedUrl,
      status: metadataData?.status ?? 'pending',
      degraded: Boolean(metadataError || metadataData?.error || metadataData?.degraded),
    });

    if (metadataError || metadataData?.error) {
      setGlobalError('No se pudieron extraer todos los metadatos. Puedes guardar igualmente.');
    }

    setLoadingPreview(false);
  };

  const confirmSave = () => {
    setSaved(true);
    setDraftItemId(null);
  };

  const cancelDraft = async () => {
    if (draftItemId && !saved) {
      await rollbackDraftLink(draftItemId);
    }
    resetFlow();
  };

  const closeFlow = async () => {
    setProcessingClose(true);
    await cancelDraft();
  };

  return {
    url,
    setUrl,
    urlError,
    globalError,
    loadingPreview,
    preview,
    saved,
    processingClose,
    requestPreview,
    confirmSave,
    cancelDraft,
    closeFlow,
    resetFlow,
  };
}
