import React from 'react';
import { ResetPasswordForm } from '@components/ResetPasswordForm/ResetPasswordForm';

export const ResetPasswordAuth: React.FC = () => (
  <ResetPasswordForm
    title="Restablecer contraseña"
    onSubmit={async (newPassword) => {
      // TODO: lógica con token de email (Supabase OTP / magic link)
      console.log('Auth — nueva contraseña:', newPassword);
    }}
  />
);
