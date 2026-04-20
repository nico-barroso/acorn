import { useState } from 'react';

import { supabase } from '../lib/supabase';

const MOBILE_RESET_REDIRECT = 'acorn://reset-password';

type RequestErrors = {
  email?: string;
  general?: string;
};

type ResetErrors = {
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export function usePasswordRecoveryRequest() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<RequestErrors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const nextErrors: RequestErrors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      nextErrors.email = 'El email no es valido';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSendRecovery = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setSent(false);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: MOBILE_RESET_REDIRECT,
    });

    setLoading(false);

    if (error) {
      setErrors({ general: 'No se pudo enviar el correo de recuperacion. Intentalo de nuevo.' });
      return;
    }

    setSent(true);
  };

  return {
    email,
    setEmail,
    errors,
    loading,
    sent,
    handleSendRecovery,
  };
}

type UseResetPasswordOptions = {
  onSuccess?: () => void;
};

export function useResetPassword({ onSuccess }: UseResetPasswordOptions = {}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ResetErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors: ResetErrors = {};

    if (!password) {
      nextErrors.password = 'La contrasena es obligatoria';
    } else if (password.length < 8) {
      nextErrors.password = 'La contrasena debe tener al menos 8 caracteres';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Debes confirmar la contrasena';
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Las contrasenas no coinciden';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setErrors({ general: 'No se pudo actualizar la contrasena. Intentalo de nuevo.' });
      return;
    }

    await supabase.auth.signOut();
    onSuccess?.();
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    loading,
    handleResetPassword,
  };
}
