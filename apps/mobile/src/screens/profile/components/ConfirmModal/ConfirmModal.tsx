import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';
import { styles } from './ConfirmModal.styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

type ConfirmModalProps = {
  visible?: boolean;
  title: string;
  subtitle?: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  danger?: boolean;
  image?: ImageSourcePropType;
  svgImage?: React.FC<SvgProps>;
  successTitle?: string;
  successSubtitle?: string;
  successLabel?: string;
  successImage?: ImageSourcePropType;
  successSvgImage?: React.FC<SvgProps>;
  onSuccessDismiss?: () => void;
  onSuccessReached?: () => void;
};

export function ConfirmModal({
  title,
  subtitle,
  confirmLabel,
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  danger = false,
  image,
  svgImage,
  successTitle,
  successSubtitle,
  successLabel = 'Cerrar',
  successImage,
  successSvgImage,
  onSuccessDismiss,
  onSuccessReached,
}: ConfirmModalProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    if (successTitle) {
      setSuccess(true);
      onSuccessReached?.();
    }
  };

  const handleSuccessDismiss = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onSuccessDismiss?.();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !success,
      onMoveShouldSetPanResponder: (_, gestureState) => !success && gestureState.dy > 0,
      onPanResponderMove: (_, gestureState) => {
        if (!success && gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            translateY.setValue(SCREEN_HEIGHT);
            onCancel();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }], paddingBottom: insets.bottom + 16 }]}
        {...(success ? {} : panResponder.panHandlers)}
      >
        <View style={styles.handleContainer}>
          <View style={[styles.handle, success && { opacity: 0 }]} />
        </View>

        {success ? (
          <>
            {successSvgImage ? (
              React.createElement(successSvgImage, { width: 60, height: 120 })
            ) : successImage ? (
              <Image source={successImage} style={styles.image} resizeMode="contain" />
            ) : null}
            <Text style={styles.title}>{successTitle}</Text>
            {successSubtitle ? <Text style={styles.subtitle}>{successSubtitle}</Text> : null}
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleSuccessDismiss}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmLabel}>{successLabel}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {svgImage ? (
              React.createElement(svgImage, { width: 60, height: 120 })
            ) : image ? (
              <Image source={image} style={styles.image} resizeMode="contain" />
            ) : null}
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.7}>
                <Text style={styles.cancelLabel}>{cancelLabel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, danger && styles.confirmButtonDanger]}
                onPress={handleConfirm}
                activeOpacity={0.7}
                disabled={loading}
              >
                <Text style={styles.confirmLabel}>{loading ? 'Procesando...' : confirmLabel}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
}
