import React, { useRef, useEffect, useState } from 'react';
import { Animated, Dimensions, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavBarHeight } from '@context/NavBarHeightContext';
import { supabase } from '@lib/supabase';
import { styles } from './NewFolderModal.styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

function slugifyName(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

type NewFolderModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function NewFolderModal({ visible, onClose, onCreated }: NewFolderModalProps) {
  const insets = useSafeAreaInsets();
  const { height: navBarHeight } = useNavBarHeight();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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
      setName('');
      setError('');
      setLoading(false);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleCreate = async () => {
    const trimmed = name.trim();
    const slug = slugifyName(trimmed);

    if (!trimmed || !slug) {
      setError('El nombre de la carpeta es obligatorio.');
      return;
    }

    setLoading(true);
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Debes iniciar sesión para crear carpetas.');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('smart_folders')
      .insert({ name: trimmed, slug, user_id: user.id, is_active: true });

    if (insertError) {
      console.error(
        '[NewFolderModal] Error al crear carpeta:',
        JSON.stringify(insertError, null, 2),
      );
      setError('No se pudo crear la carpeta. Inténtalo de nuevo.');
      setLoading(false);
      return;
    }

    console.log('[NewFolderModal] Carpeta creada correctamente:', trimmed);
    setLoading(false);
    onCreated();
    handleClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.backdrop}>
      <TouchableOpacity style={styles.backdropPress} activeOpacity={1} onPress={handleClose} />
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
            paddingBottom: keyboardHeight > 0
              ? keyboardHeight + 32
              : insets.bottom + navBarHeight + 16,
          },
        ]}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <Text style={styles.title}>Nueva carpeta</Text>
        <Text style={styles.subtitle}>Dale un nombre para identificarla fácilmente.</Text>

        <TextInput
          style={styles.input}
          placeholder="Ej. Tutoriales de diseño"
          placeholderTextColor="#8B8179"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) setError('');
          }}
          editable={!loading}
          autoFocus
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose} activeOpacity={0.7}>
            <Text style={styles.cancelLabel}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleCreate}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={styles.confirmLabel}>{loading ? 'Creando...' : 'Crear carpeta'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
