import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { supabase } from './lib/supabase';
import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import HomeScreen from './src/screens/Home/Home';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  const [loaded, error] = useFonts({
    'CabinetGrotesk': require('./assets/fonts/CabinetGrotesk-Variable.ttf'),
    'Satoshi': require('./assets/fonts/Satoshi-Variable.ttf'),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (mounted) {
        setSession(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, nextSession: Session | null) => {
      if (mounted) {
        setSession(nextSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      {session ? (
        <HomeScreen userName={session.user.email ?? 'Usuario'} />
      ) : authScreen === 'login' ? (
        <LoginScreen
          onLoginSuccess={() => undefined}
          onGoToRegister={() => setAuthScreen('register')}
        />
      ) : (
        <RegisterScreen
          onRegisterSuccess={() => undefined}
          onGoToLogin={() => setAuthScreen('login')}
        />
      )}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
