import React, { useRef, useEffect, useState } from 'react';
import { Animated, Dimensions, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavBarHeight } from '@context/NavBarHeightContext';
import { styles } from './RenameFolderModal.styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

type RenameFolderModalProps = {
  visible: boolean;
  currentName: string;
  onClose: () => void;
  onRenamed: (newName: string) => void;
};

export function RenameFolderModal({
  visible,
  currentName,
  onClose,
  onRenamed,
}: RenameFolderModalProps) {
  const insets = useSafeAreaInsets();
  const { height: navBarHeight } = useNavBarHeight();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (visible) {
      setName(currentName);
      setError('');
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(SCREEN_HEIGHT);
      setName('');
      setError('');
    }
  }, [visible, currentName]);

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

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('El nombre de la carpeta es obligatorio.');
      return;
    }
    if (trimmed === currentName) {
      handleClose();
      return;
    }
    onRenamed(trimmed);
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

        <Text style={styles.title}>Cambiar nombre</Text>
        <Text style={styles.subtitle}>Escribe el nuevo nombre para esta carpeta.</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de la carpeta"
          placeholderTextColor="#8B8179"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) setError('');
          }}
          autoFocus
          selectTextOnFocus
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose} activeOpacity={0.7}>
            <Text style={styles.cancelLabel}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.7}>
            <Text style={styles.confirmLabel}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
