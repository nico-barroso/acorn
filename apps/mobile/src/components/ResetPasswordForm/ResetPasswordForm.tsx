import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { ProfileHeader } from '@components/ProfileHeader/ProfileHeader';
import { Input } from '@components/Input/Input';
import { styles } from './ResetPasswordForm.styles';

const isValidPassword = (p: string) => p.length >= 8;
const passwordsMatch = (a: string, b: string) => a.length > 0 && a === b;

interface ResetPasswordFormProps {
  title?: string;
  onSubmit: (newPassword: string) => void;
  isLoading?: boolean;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  title = 'Cambiar contraseña',
  onSubmit,
  isLoading,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const showMismatchError = submitted && !passwordsMatch(newPassword, confirmPassword);
  const canSubmit = isValidPassword(newPassword) && passwordsMatch(newPassword, confirmPassword);

  const handleSubmit = () => {
    setSubmitted(true);
    if (!canSubmit) return;
    onSubmit(newPassword);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ProfileHeader title={title} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input
          label="Nueva contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Mínimo 8 caracteres"
          secureTextEntry
        />

        <Input
          label="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repetir nueva contraseña"
          secureTextEntry
          error={showMismatchError ? 'Las contraseñas deben coincidir' : undefined}
        />

        <TouchableOpacity
          style={[styles.button, (!canSubmit || isLoading) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Guardando...' : 'Cambiar mi contraseña'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
