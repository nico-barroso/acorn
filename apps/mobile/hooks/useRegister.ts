import { useState } from 'react';

import { supabase } from '../lib/supabase';

type FormErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

type UseRegisterOptions = {
  onSuccess?: () => void;
};

function getRegisterErrorMessage(message: string) {
  if (message.includes('User already registered')) {
    return 'Este correo ya esta registrado. Prueba a iniciar sesion.';
  }

  if (message.includes('Password should be at least')) {
    return 'La contrasena no cumple la politica minima requerida.';
  }

  return 'No se pudo completar el registro. Intentalo de nuevo.';
}

export function useRegister({ onSuccess }: UseRegisterOptions = {}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      newErrors.email = 'El email no es valido';
    }

    if (!password) {
      newErrors.password = 'La contrasena es obligatoria';
    } else if (password.length < 8) {
      newErrors.password = 'La contrasena debe tener al menos 8 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar la contrasena';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Las contrasenas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setRegistered(false);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setErrors({ general: getRegisterErrorMessage(error.message) });
      return;
    }

    if (data.session) {
      onSuccess?.();
      return;
    }

    setRegistered(true);
    setPassword('');
    setConfirmPassword('');
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    loading,
    registered,
    handleRegister,
  };
}
