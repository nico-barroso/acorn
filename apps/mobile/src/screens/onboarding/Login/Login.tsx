import React from 'react';
import { View, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGoogleOAuth } from '@hooks/useGoogleOAuth';
import { useLogin } from '@hooks/useLogin';
import { Button } from '@components/Button/Button';
import { Input } from '@components/Input/Input';
import { styles } from './Login.styles';
import GoogleSignInButton from '@screens/onboarding/components/GoogleButton/GoogleButton';
import AuthHeader from '@screens/onboarding/components/AuthHeader/AuthHeader';
import Divider from '@screens/onboarding/components/Divider/Divider';
const EmailInput = Input;
const PasswordInput = Input;

type LoginScreenProps = {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
  onGoToForgotPassword: () => void;
};

export default function LoginScreen({ onLoginSuccess, onGoToRegister }: LoginScreenProps) {
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
      <View style={styles.container}>
        <AuthHeader subtitle="¡Qué alegría verte" />

        <EmailInput
          label="Correo electronico"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          placeholder="tu@email.com"
          keyboardType="email-address"
        />

        <PasswordInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          placeholder="********"
          secureTextEntry
        />
        <TouchableOpacity
          onPress={() => router.push('/(auth)/forgot-password')}
          disabled={isSubmitting}
        >
          <Text style={styles.link}>He olvidado mi contraseña</Text>
        </TouchableOpacity>
        {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}
        {oauthError ? <Text style={styles.errorText}>{oauthError}</Text> : null}

        <Button
          label="Iniciar sesión"
          loadingLabel="Iniciando sesión..."
          onPress={handleLogin}
          disabled={isSubmitting}
          variant="primary"
        />
        <Divider label="o continúa con" />

        <GoogleSignInButton
          label={oauthLoading ? 'Conectando con Google...' : 'Continuar con Google'}
          onPress={handleGoogleSignIn}
          loading={oauthLoading}
          disabled={isSubmitting}
        />
        <TouchableOpacity onPress={onGoToRegister} disabled={isSubmitting}>
          <Text style={styles.link}>Crear una cuenta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
