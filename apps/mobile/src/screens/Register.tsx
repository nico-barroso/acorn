import React from 'react';
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGoogleOAuth } from '../../hooks/useGoogleOAuth';
import { useRegister } from '../../hooks/useRegister';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { styles } from './Register.styles';

type RegisterScreenProps = {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
};

export default function RegisterScreen({ onRegisterSuccess, onGoToLogin }: RegisterScreenProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    loading,
    registered,
    handleRegister,
  } = useRegister({ onSuccess: onRegisterSuccess });
  const {
    loading: oauthLoading,
    error: oauthError,
    handleGoogleSignIn,
  } = useGoogleOAuth({ onSuccess: onRegisterSuccess });

  const isSubmitting = loading || oauthLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>Empieza con email o con Google en un solo paso</Text>

          <Input
            label="Correo electronico"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            placeholder="tu@email.com"
            keyboardType="email-address"
          />

          <Input
            label="Contrasena"
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

          {registered ? (
            <Text style={styles.infoText}>Revisa tu correo para confirmar la cuenta antes de entrar.</Text>
          ) : null}
          {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}
          {oauthError ? <Text style={styles.errorText}>{oauthError}</Text> : null}

          <Button
            label={loading ? 'Creando cuenta...' : 'Registrarme'}
            onPress={handleRegister}
            disabled={isSubmitting}
          />

          <Button
            label={oauthLoading ? 'Conectando con Google...' : 'Continuar con Google'}
            onPress={handleGoogleSignIn}
            variant="secondary"
            disabled={isSubmitting}
          />

          <Text style={styles.helperText}>o</Text>

          <TouchableOpacity onPress={onGoToLogin} disabled={isSubmitting}>
            <Text style={styles.link}>Ya tengo cuenta, iniciar sesion</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
