import { useState } from 'react';

import { signInWithGoogle } from '../lib/auth/google';

type UseGoogleOAuthOptions = {
  onSuccess?: () => void;
};

export function useGoogleOAuth({ onSuccess }: UseGoogleOAuthOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithGoogle();
      if (result.status === 'signed_in') {
        onSuccess?.();
      }
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
