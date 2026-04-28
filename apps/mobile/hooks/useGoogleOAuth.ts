import { useState } from 'react';

import { signInWithGoogle } from '../lib/auth/google';

export function useGoogleOAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (oauthError) {
      setError(oauthError instanceof Error ? oauthError.message : 'No se pudo autenticar con Google');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleGoogleSignIn,
  };
}
