import React from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useResetPassword } from '../../hooks/usePasswordRecovery';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { styles } from './ResetPassword.styles';

type ResetPasswordScreenProps = {
  onSuccess: () => void;
};

export default function ResetPasswordScreen({ onSuccess }: ResetPasswordScreenProps) {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    loading,
    handleResetPassword,
  } = useResetPassword({ onSuccess });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Nueva contrasena</Text>
          <Text style={styles.subtitle}>Define una nueva contrasena para tu cuenta.</Text>

          <Input
            label="Nueva contrasena"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            placeholder="********"
            secureTextEntry
          />

          <Input
            label="Confirmar contrasena"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            placeholder="********"
            secureTextEntry
          />

          {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

          <Button
            label={loading ? 'Actualizando contrasena...' : 'Guardar nueva contrasena'}
            onPress={handleResetPassword}
            disabled={loading}
          />

          <Text style={styles.helperText}>Al guardar, te redirigiremos a la pantalla de login.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
