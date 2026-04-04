import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { signInWithGoogle } from '../lib/auth/google';
import { hasSupabaseEnv } from '../lib/env';
import { supabase } from '../lib/supabase/client';

export default function HomeScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [statusText, setStatusText] = useState(
    hasSupabaseEnv ? 'Ready to test Google OAuth' : 'Missing Supabase env',
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (mounted) {
        setIsAuthenticated(Boolean(data.session));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (mounted) {
        setIsAuthenticated(Boolean(session));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setStatusText('Opening Google sign-in...');
      const result = await signInWithGoogle();
      setStatusText(
        result.status === 'signed_in' ? 'Google OAuth success' : 'Google OAuth cancelled',
      );
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : 'Google OAuth failed');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
      <Text>{isAuthenticated ? 'Authenticated session detected' : 'Not authenticated'}</Text>
      <Text>{statusText}</Text>
      <Button title="Sign in with Google" onPress={handleGoogleSignIn} disabled={!hasSupabaseEnv} />
    </View>
  );
}
