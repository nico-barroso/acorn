import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ResetPasswordForm } from '@/components/ResetPasswordForm/ResetPasswordForm';
import { supabase } from '@mobile/lib/supabase';

export const ResetPasswordAuth: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (newPassword: string) => {
    console.log('[ResetPasswordAuth] handleSubmit called');
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('[ResetPasswordAuth] session before update:', sessionData.session?.user?.id ?? 'null');

    setIsLoading(true);
    console.log('[ResetPasswordAuth] calling updateUser...');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsLoading(false);

    if (error) {
      console.error('[ResetPasswordAuth] updateUser error:', error.message, error);
      Alert.alert('Error', 'No se pudo actualizar la contraseña. Inténtalo de nuevo.');
      return;
    }

    console.log('[ResetPasswordAuth] updateUser success, signing out...');
    await supabase.auth.signOut();
    console.log('[ResetPasswordAuth] signed out, navigating to login');
    router.replace('/(auth)/login');
  };

  return (
    <ResetPasswordForm
      title="Restablecer contraseña"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
