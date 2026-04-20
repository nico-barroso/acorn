import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import { styles } from './Button.styles';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  icon?: ImageSourcePropType;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}

export function Button({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  loadingLabel,
}: ButtonProps) {
  const isSecondary = variant === 'secondary';
  const displayLabel = loading && loadingLabel ? loadingLabel : label;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary && styles.buttonSecondary,
        (disabled || loading) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isSecondary ? '#1F1F1F' : '#ffffff'} />
      ) : (
        icon && <Image source={icon} style={styles.buttonIcon} />
      )}
      <Text style={[styles.buttonLabel, isSecondary && styles.buttonSecondaryLabel]}>
        {displayLabel}
      </Text>
    </TouchableOpacity>
  );
}
