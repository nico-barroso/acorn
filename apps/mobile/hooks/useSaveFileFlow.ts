import { useState } from 'react';

import * as DocumentPicker from 'expo-document-picker';

import { useUploadFile } from './useUploadFile';

type PickedFile = {
  uri: string;
  name: string;
  type: string;
  size: number;
};

export function useSaveFileFlow() {
  const [pickedFile, setPickedFile] = useState<PickedFile | null>(null);
  const [saved, setSaved] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { uploadFile, loading, progress, error } = useUploadFile({
    onSuccess: () => {
      setSaved(true);
      setGlobalError(null);
    },
    onError: (message) => {
      setGlobalError(message);
    },
  });

  const pickFile = async () => {
    setSaved(false);
    setGlobalError(null);

    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const selectedAsset = result.assets[0];

    setPickedFile({
      uri: selectedAsset.uri,
      name: selectedAsset.name,
      type: selectedAsset.mimeType ?? 'application/octet-stream',
      size: selectedAsset.size ?? 0,
    });
  };

  const confirmUpload = async () => {
    if (!pickedFile) {
      setGlobalError('Selecciona primero un archivo para continuar.');
      return;
    }

    await uploadFile(pickedFile);
  };

  const resetFlow = () => {
    setPickedFile(null);
    setSaved(false);
    setGlobalError(null);
  };

  return {
    pickedFile,
    loading,
    progress,
    saved,
    error: globalError ?? error,
    pickFile,
    confirmUpload,
    resetFlow,
  };
}
