import { useState } from 'react';

import { supabase } from '@mobile/lib/supabase';
import { isValidEmail } from '@/lib/validators';

type FormErrors = {
  email?: string;
  displayName?: string;
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

const COOLDOWN_MS = 3000;

export function useRegister({ onSuccess }: UseRegisterOptions = {}) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    const normalizedEmail = email.trim();
    const normalizedDisplayName = displayName.trim();

    if (!normalizedEmail) {
      newErrors.email = 'El email es obligatorio';
    } else if (!isValidEmail(normalizedEmail)) {
      newErrors.email = 'El email no es valido';
    }

    if (!normalizedDisplayName) {
      newErrors.displayName = 'El nombre de usuario es obligatorio';
    } else if (normalizedDisplayName.length < 2) {
      newErrors.displayName = 'El nombre de usuario debe tener al menos 2 caracteres';
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

    const trimmedDisplayName = displayName.trim();

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: trimmedDisplayName },
      },
    });

    if (error) {
      setLoading(false);
      setErrors({ general: getRegisterErrorMessage(error.message) });
      setCooldown(true);
      setTimeout(() => setCooldown(false), COOLDOWN_MS);
      return;
    }

    if (data.session) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: trimmedDisplayName })
        .eq('id', data.session.user.id);

      setLoading(false);

      if (profileError) {
        console.warn('[useRegister] profiles update error:', profileError);
        setErrors({ general: 'Cuenta creada pero no se pudo guardar el nombre.' });
        return;
      }

      onSuccess?.();
      return;
    }

    setLoading(false);
    setRegistered(true);
    setCooldown(true);
    setTimeout(() => setCooldown(false), COOLDOWN_MS);
    setPassword('');
    setConfirmPassword('');
  }

  return {
    email,
    setEmail,
    displayName,
    setDisplayName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    loading,
    cooldown,
    registered,
    handleRegister,
  };
}
