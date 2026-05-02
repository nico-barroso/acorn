import React, { useRef, useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavBarHeight } from '@context/NavBarHeightContext';
import { SaveLinkMode } from './SaveLinkMode';
import { SaveFileMode } from './SaveFileMode';
import { styles } from './SaveLinkModal.styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

type Mode = 'link' | 'file';

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

  const [mode, setMode] = useState<Mode>('link');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const hideEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
    const show = Keyboard.addListener(showEvent, (e) => setKeyboardHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => { show.remove(); hide.remove(); };
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } else {
      translateY.setValue(SCREEN_HEIGHT);
      setMode('link');
    }
  }, [visible]);

  const handleClose = () => {
    Keyboard.dismiss();
    Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 200, useNativeDriver: true }).start(() => onClose());
  };

  const handleSave = () => {
    onSaved();
    handleClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.backdrop}>
      <TouchableOpacity style={styles.backdropPress} activeOpacity={1} onPress={handleClose} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
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

          {mode === 'link' && (
            <SaveLinkMode
              key={`link-${String(visible)}`}
              initialUrl={initialUrl}
              onSave={handleSave}
              onClose={handleClose}
            />
          )}

          {mode === 'file' && (
            <SaveFileMode
              key={`file-${String(visible)}`}
              onSave={handleSave}
              onClose={handleClose}
            />
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
