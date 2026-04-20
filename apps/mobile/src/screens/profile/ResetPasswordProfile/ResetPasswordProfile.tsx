import React from 'react';
import { ResetPasswordForm } from '@components/ResetPasswordForm/ResetPasswordForm';

export const ResetPassword: React.FC = () => (
  <ResetPasswordForm
    onSubmit={async (newPassword) => {
      // TODO: supabase.auth.updateUser({ password: newPassword })
      console.log('Nueva contraseña lista para enviar');
    }}
  />
);
