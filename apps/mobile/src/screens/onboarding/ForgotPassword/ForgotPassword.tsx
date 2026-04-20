import React from 'react';
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePasswordRecoveryRequest } from '@hooks/usePasswordRecovery';
import { Button } from '@components/Button/Button';
import { Input } from '@components/Input/Input';
import { styles } from './ForgotPassword.styles';
import AuthHeader from '../components/AuthHeader/AuthHeader';

type ForgotPasswordScreenProps = {
  onGoToLogin: () => void;
};

export default function ForgotPasswordScreen({ onGoToLogin }: ForgotPasswordScreenProps) {
  const { email, setEmail, errors, loading, sent, handleSendRecovery } =
    usePasswordRecoveryRequest();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AuthHeader subtitle="Crea una cuenta" />

        <Input
          label="Correo electronico"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          placeholder="tu@email.com"
          keyboardType="email-address"
        />

        {sent ? (
          <Text style={styles.successText}>
            Hemos enviado el correo de recuperacion. Revisa tu bandeja y vuelve a la app con el
            enlace.
          </Text>
        ) : null}

        {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

        <Button
          label={loading ? 'Enviando enlace...' : 'Enviar enlace de recuperacion'}
          onPress={handleSendRecovery}
          disabled={loading}
        />

        <TouchableOpacity onPress={onGoToLogin} disabled={loading}>
          <Text style={styles.link}>Volver a iniciar sesion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
