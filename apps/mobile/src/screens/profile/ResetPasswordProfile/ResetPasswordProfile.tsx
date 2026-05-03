import React, { useState } from 'react';
import { Alert } from 'react-native';
import { ResetPasswordForm } from '@/components/ResetPasswordForm/ResetPasswordForm';
import { supabase } from '@mobile/lib/supabase';

export const ResetPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (newPassword: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsLoading(false);

    if (error) {
      Alert.alert('Error', 'No se pudo actualizar la contraseña. Intentalo de nuevo.');
      return;
    }

    Alert.alert('¡Éxito!', 'Tu contraseña ha sido actualizada correctamente.');
  };

  return <ResetPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />;
};
