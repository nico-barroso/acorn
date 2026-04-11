import React, { useEffect } from 'react';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';

import { useSaveLinkFlow } from '../../../hooks/useSaveLinkFlow';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { styles } from './SaveLinkFlow.styles';

type SaveLinkFlowProps = {
  visible: boolean;
  onClose: () => void;
  initialUrl?: string;
  onInitialUrlConsumed?: () => void;
};

export function SaveLinkFlow({
  visible,
  onClose,
  initialUrl,
  onInitialUrlConsumed,
}: SaveLinkFlowProps) {
  const {
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
  } = useSaveLinkFlow();

  useEffect(() => {
    if (!visible || !initialUrl || saved) {
      return;
    }

    setUrl(initialUrl);
    onInitialUrlConsumed?.();
  }, [initialUrl, onInitialUrlConsumed, saved, setUrl, visible]);

  const handleClose = async () => {
    await closeFlow();
    onClose();
  };

  const handleCancel = async () => {
    await cancelDraft();
    onClose();
  };

  const handleConfirm = () => {
    confirmSave();
  };

  const handleStartNew = () => {
    resetFlow();
  };

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.panel}>
              <Text style={styles.title}>Guardar enlace</Text>
              <Text style={styles.subtitle}>
                Pega una URL para extraer metadatos, revisar previsualizacion y confirmar guardado.
              </Text>

              {saved ? (
                <>
                  <Text style={styles.success}>Enlace guardado correctamente.</Text>
                  <Button label='Guardar otro enlace' onPress={handleStartNew} />
                  <Button label='Cerrar' onPress={handleClose} variant='secondary' />
                </>
              ) : (
                <>
                  <Input
                    label='URL del enlace'
                    value={url}
                    onChangeText={setUrl}
                    placeholder='https://example.com/articulo'
                    error={urlError}
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='url'
                  />

                  {globalError ? <Text style={styles.error}>{globalError}</Text> : null}

                  {preview ? (
                    <View style={styles.previewCard}>
                      <Text style={styles.previewTitle}>{preview.title || 'Sin titulo'}</Text>
                      <Text style={styles.previewDomain}>{preview.domain || 'Dominio no detectado'}</Text>
                      <Text style={styles.previewUrl}>{preview.url}</Text>
                      <Text style={styles.previewDomain}>
                        Estado de metadatos: {preview.degraded ? 'parcial' : preview.status}
                      </Text>
                    </View>
                  ) : null}

                  {preview ? (
                    <View style={styles.rowButtons}>
                      <View style={styles.halfButton}>
                        <Button label='Cancelar' onPress={handleCancel} variant='secondary' />
                      </View>
                      <View style={styles.halfButton}>
                        <Button label='Confirmar guardado' onPress={handleConfirm} />
                      </View>
                    </View>
                  ) : (
                    <Button
                      label={loadingPreview ? 'Extrayendo metadatos...' : 'Previsualizar enlace'}
                      onPress={requestPreview}
                      disabled={loadingPreview || processingClose}
                    />
                  )}
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
