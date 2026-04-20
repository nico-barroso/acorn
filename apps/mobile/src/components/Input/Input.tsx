import React, { useRef, useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { styles } from './Input.styles';
import { Ionicons } from '@expo/vector-icons';

export interface InputProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  showClear?: boolean;
  icon?: React.ReactNode;
}

export const Input = function Input({
  label,
  value,
  onChangeText,
  error,
  showClear = true,
  secureTextEntry,
  placeholder,
  icon,
  ...rest
}: InputProps) {
  const inputRef = useRef<TextInput>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const hasError = !!error;
  const isPassword = secureTextEntry;

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, hasError && styles.inputWrapperError]}>
        {icon && <View style={styles.leftIcon}>{icon}</View>}
        <TextInput
          ref={inputRef}
          style={[styles.input, hasError && styles.inputError, !!icon && styles.inputWithIcon]}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="next"
          placeholder={placeholder}
          secureTextEntry={isPassword && !passwordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          {...rest}
        />
        <View style={styles.iconsRow}>
          {isPassword && value.length > 0 && (
            <TouchableOpacity
              onPress={() => setPasswordVisible((v) => !v)}
              activeOpacity={0.7}
              style={styles.clearButton}
            >
              <Ionicons
                name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          )}
          {showClear && !isPassword && value.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => onChangeText('')}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {hasError && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color="#e53e3e" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};
