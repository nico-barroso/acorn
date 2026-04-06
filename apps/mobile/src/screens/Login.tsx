import React from 'react';
import { View, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGoogleOAuth } from '../../hooks/useGoogleOAuth';
import { useLogin } from '../../hooks/useLogin';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { styles } from './Login.styles';

type LoginScreenProps = {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
  onGoToForgotPassword: () => void;
};

export default function LoginScreen({
  onLoginSuccess,
  onGoToRegister,
  onGoToForgotPassword,
}: LoginScreenProps) {
  const { email, setEmail, password, setPassword, errors, loading, handleLogin } = useLogin({
    onSuccess: onLoginSuccess,
  });
  const {
    loading: oauthLoading,
    error: oauthError,
    handleGoogleSignIn,
  } = useGoogleOAuth({ onSuccess: onLoginSuccess });

  const isSubmitting = loading || oauthLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Bienvenida de nuevo</Text>
          <Text style={styles.subtitle}>Inicia sesion para acceder a tu espacio privado</Text>

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

          {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}
          {oauthError ? <Text style={styles.errorText}>{oauthError}</Text> : null}

          <Button
            label={loading ? 'Iniciando sesion...' : 'Iniciar sesion'}
            onPress={handleLogin}
            disabled={isSubmitting}
          />

          <TouchableOpacity onPress={onGoToForgotPassword} disabled={isSubmitting}>
            <Text style={styles.link}>He olvidado mi contrasena</Text>
          </TouchableOpacity>

          <Button
            label={oauthLoading ? 'Conectando con Google...' : 'Continuar con Google'}
            onPress={handleGoogleSignIn}
            variant="secondary"
            disabled={isSubmitting}
          />

          <Text style={styles.helperText}>o</Text>

          <TouchableOpacity onPress={onGoToRegister} disabled={isSubmitting}>
            <Text style={styles.link}>Crear una cuenta</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
