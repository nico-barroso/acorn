import React from 'react';
import { ResetPasswordForm } from '@components/ResetPasswordForm/ResetPasswordForm';

export const ResetPassword: React.FC = () => (
  <ResetPasswordForm
    onSubmit={async (newPassword) => {
      // TODO: bussiness logic with suypabase updateUser
      console.log('Nueva contraseña lista para enviar');
    }}
  />
);
