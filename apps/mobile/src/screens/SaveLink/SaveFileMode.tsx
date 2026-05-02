import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSaveFileFlow } from '@/hooks/useSaveFileFlow';
import { styles } from './SaveLinkModal.styles';
import FileIcon from '@/assets/icons/file-icon.svg';

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

type SaveFileModeProps = {
  onSave: () => void;
  onClose: () => void;
};

export function SaveFileMode({ onSave, onClose }: SaveFileModeProps) {
  const { pickedFile, loading: fileLoading, progress, error: fileError, pickFile, confirmUpload } = useSaveFileFlow();
  const [editedFileName, setEditedFileName] = useState('');

  useEffect(() => {
    if (pickedFile) setEditedFileName(pickedFile.name);
  }, [pickedFile]);

  const handleSaveFile = async () => {
    await confirmUpload(editedFileName.trim() || undefined);
    onSave();
  };

  return (
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
        <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
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
  );
}
