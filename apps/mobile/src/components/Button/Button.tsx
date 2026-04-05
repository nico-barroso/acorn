import React from 'react';
import { TouchableOpacity, Text, Image, ImageSourcePropType } from 'react-native';
import { styles } from './Button.styles';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  icon?: ImageSourcePropType;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      {icon && <Image source={icon} style={styles.buttonIcon} />}
      <Text style={[styles.buttonLabel, isSecondary && styles.buttonSecondaryLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
