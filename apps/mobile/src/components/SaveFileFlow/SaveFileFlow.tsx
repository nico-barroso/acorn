import React from 'react';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';

import { useSaveFileFlow } from '../../../hooks/useSaveFileFlow';
import { Button } from '../Button/Button';
import { styles } from './SaveFileFlow.styles';

type SaveFileFlowProps = {
  visible: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

function formatBytes(size: number) {
  if (!size) return 'Tamano no disponible';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function SaveFileFlow({ visible, onClose, onSaved }: SaveFileFlowProps) {
  const { pickedFile, loading, progress, saved, error, pickFile, confirmUpload, resetFlow } =
    useSaveFileFlow();

  const handleClose = () => {
    resetFlow();
    onClose();
  };

  React.useEffect(() => {
    if (saved) {
      onSaved?.();
    }
  }, [onSaved, saved]);

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.panel}>
              <Text style={styles.title}>Subir archivo</Text>
              <Text style={styles.subtitle}>
                Selecciona un archivo, revisa su previsualizacion y confirma para guardarlo.
              </Text>

              {saved ? (
                <>
                  <Text style={styles.success}>Archivo subido correctamente.</Text>
                  <Button label='Subir otro archivo' onPress={resetFlow} />
                  <Button label='Cerrar' onPress={handleClose} variant='secondary' />
                </>
              ) : (
                <>
                  <Button
                    label={pickedFile ? 'Cambiar archivo' : 'Seleccionar archivo'}
                    onPress={pickFile}
                    variant='secondary'
                    disabled={loading}
                  />

                  {pickedFile ? (
                    <View style={styles.filePreviewCard}>
                      <Text style={styles.fileName}>{pickedFile.name}</Text>
                      <Text style={styles.fileMeta}>{pickedFile.type}</Text>
                      <Text style={styles.fileMeta}>{formatBytes(pickedFile.size)}</Text>
                    </View>
                  ) : null}

                  {error ? <Text style={styles.error}>{error}</Text> : null}

                  {loading ? <Text style={styles.fileMeta}>Subiendo... {progress}%</Text> : null}

                  <Button
                    label={loading ? 'Subiendo archivo...' : 'Confirmar subida'}
                    onPress={confirmUpload}
                    disabled={loading || !pickedFile}
                  />
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
