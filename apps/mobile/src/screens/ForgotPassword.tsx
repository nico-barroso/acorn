import React from 'react';
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePasswordRecoveryRequest } from '../../hooks/usePasswordRecovery';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { styles } from './ForgotPassword.styles';

type ForgotPasswordScreenProps = {
  onGoToLogin: () => void;
};

export default function ForgotPasswordScreen({ onGoToLogin }: ForgotPasswordScreenProps) {
  const { email, setEmail, errors, loading, sent, handleSendRecovery } = usePasswordRecoveryRequest();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Recuperar contrasena</Text>
          <Text style={styles.subtitle}>Te enviaremos un enlace para restablecerla desde el email.</Text>

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
