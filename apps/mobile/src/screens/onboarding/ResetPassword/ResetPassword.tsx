import React, { useState } from 'react';
import { Alert } from 'react-native';
import { ResetPasswordForm } from '@components/ResetPasswordForm/ResetPasswordForm';
import { supabase } from '@lib/supabase';

export const ResetPasswordAuth: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (newPassword: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsLoading(false);

    if (error) {
      Alert.alert('Error', 'No se pudo actualizar la contraseña. Inténtalo de nuevo.');
      return;
    }

    await supabase.auth.signOut();
  };

  return (
    <ResetPasswordForm
      title="Restablecer contraseña"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
