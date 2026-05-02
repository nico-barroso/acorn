import React from 'react';
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePasswordRecoveryRequest } from '@hooks/usePasswordRecovery';
import { Button } from '@components/Button/Button';
import { Input } from '@components/Input/Input';
import { ProfileHeader } from '@components/ProfileHeader/ProfileHeader';
import { styles } from './ForgotPassword.styles';

type ForgotPasswordScreenProps = {
  onGoToLogin: () => void;
};

export default function ForgotPasswordScreen({ onGoToLogin }: ForgotPasswordScreenProps) {
  const { email, setEmail, errors, loading, sent, cooldown, handleSendRecovery } =
    usePasswordRecoveryRequest();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProfileHeader title="Cambiar contraseña" onBack={onGoToLogin} />
      <View style={styles.container}>

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
          disabled={loading || cooldown}
        />

        <TouchableOpacity onPress={onGoToLogin} disabled={loading}>
          <Text style={styles.link}>Volver a iniciar sesion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
