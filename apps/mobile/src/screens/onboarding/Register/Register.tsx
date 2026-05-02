import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';
import { useRegister } from './useRegister';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import { styles } from './Register.styles';
import AuthHeader from '@/screens/onboarding/components/AuthHeader/AuthHeader';
import GoogleSignInButton from '@/screens/onboarding/components/GoogleButton/GoogleButton';
import Divider from '@/screens/onboarding/components/Divider/Divider';
type RegisterScreenProps = {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
};

export default function RegisterScreen({ onRegisterSuccess, onGoToLogin }: RegisterScreenProps) {
  const {
    email,
    setEmail,
    displayName,
    setDisplayName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    loading,
    cooldown,
    registered,
    handleRegister,
  } = useRegister({ onSuccess: onRegisterSuccess });
  const {
    loading: oauthLoading,
    error: oauthError,
    handleGoogleSignIn,
  } = useGoogleOAuth();

  const isSubmitting = loading || oauthLoading || cooldown;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader
            title="Crea tu cuenta"
            subtitle="Regístrate con tu correo o con Google en un solo paso"
          />
          <Input
            label="Correo electronico"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            placeholder="tu@email.com"
            keyboardType="email-address"
          />

          <Input
            label="Nombre de usuario"
            value={displayName}
            onChangeText={setDisplayName}
            error={errors.displayName}
            placeholder="Tu nombre"
            autoCapitalize="words"
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
            <Text style={styles.infoText}>
              Revisa tu correo para confirmar la cuenta antes de entrar.
            </Text>
          ) : null}
          {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}
          {oauthError ? <Text style={styles.errorText}>{oauthError}</Text> : null}

          <View style={styles.submitWrapper}>
            <Button
              label="Registrarme"
              loadingLabel="Crendo cuenta ..."
              onPress={handleRegister}
              disabled={isSubmitting}
              variant="primary"
            />
          </View>

          <Divider />

          <GoogleSignInButton
            label={oauthLoading ? 'Conectando con Google...' : 'Continuar con Google'}
            onPress={handleGoogleSignIn}
            loading={oauthLoading}
            disabled={isSubmitting}
          />

          <TouchableOpacity onPress={onGoToLogin} disabled={isSubmitting}>
            <Text style={styles.link}>Ya tengo cuenta, iniciar sesion</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
