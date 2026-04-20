import React from 'react';
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGoogleOAuth } from '../../../../hooks/useGoogleOAuth';
import { useRegister } from '../../../../hooks/useRegister';
import { Button } from '../../../components/Button/Button';
import { Input } from '../../../components/Input/Input';
import { styles } from './Register.styles';
import AuthHeader from '@screens/onboarding/components/AuthHeader/AuthHeader';
import GoogleSignInButton from '../components/GoogleButton/GoogleButton';
import Divider from '../components/Divider/Divider';
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
      <View style={styles.container}>
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

        <Button
          label="Registrarme"
          loadingLabel="Crendo cuenta ..."
          onPress={handleRegister}
          disabled={isSubmitting}
          variant="primary"
        />

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
      </View>
    </SafeAreaView>
  );
}
