import React from 'react';
import { ResetPasswordForm } from '@components/ResetPasswordForm/ResetPasswordForm';

export const ResetPasswordAuth: React.FC = () => (
  <ResetPasswordForm
    title="Restablecer contraseña"
    onSubmit={async (newPassword) => {
      // TODO: bussiness logic with suypabase
      console.log('Auth — nueva contraseña:', newPassword);
    }}
  />
);
