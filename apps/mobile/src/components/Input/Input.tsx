import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { styles } from './Input.styles';

export interface InputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  showClear?: boolean;
}

export function Input({
  label,
  value,
  onChangeText,
  error,
  showClear = true,
  secureTextEntry,
  placeholder,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const hasError = !!error;

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Campo */}
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          hasError && styles.inputWrapperError,
        ]}
      >
        <TextInput
          style={[styles.input, hasError && styles.inputError]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />

        {/* Botón clear */}
        {showClear && value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChangeText('')}
            activeOpacity={0.7}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Error */}
      {hasError && <Text style={styles.errorText}>* {error}</Text>}
    </View>
  );
}
