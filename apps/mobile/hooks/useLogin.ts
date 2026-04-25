import { useState } from 'react';
import { supabase } from '../lib/supabase';

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // Supabase devuelve "Email not confirmed" si el usuario no verificó su email
      if (error.message === 'Email not confirmed') {
        setErrors({ general: 'Debes verificar tu email antes de iniciar sesión' });
      } else {
        setErrors({ general: 'Email o contraseña incorrectos' });
      }
      return;
    }

  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    loading,
    handleLogin,
  };
}
