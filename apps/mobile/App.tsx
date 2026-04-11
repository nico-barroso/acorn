import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { useShareIntent } from 'expo-share-intent';
import { Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { supabase } from './lib/supabase';
import ForgotPasswordScreen from './src/screens/ForgotPassword';
import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import ResetPasswordScreen from './src/screens/ResetPassword';
import HomeScreen from './src/screens/Home/Home';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent({
    disabled: Constants.appOwnership === 'expo',
  });

  const [session, setSession] = useState<Session | null>(null);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [authScreen, setAuthScreen] = useState<
    'login' | 'register' | 'forgotPassword' | 'resetPassword'
  >('login');

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

  useEffect(() => {
    if (!hasShareIntent) {
      return;
    }

    const textValue = typeof shareIntent?.text === 'string' ? shareIntent.text : '';
    const webUrl = typeof shareIntent?.webUrl === 'string' ? shareIntent.webUrl : '';
    const fallbackMatch = textValue.match(/https?:\/\/[^\s]+/i);
    const candidateUrl = (webUrl || fallbackMatch?.[0] || '').trim();

    if (candidateUrl) {
      setSharedUrl(candidateUrl);
    }

    resetShareIntent();
  }, [hasShareIntent, resetShareIntent, shareIntent]);

  useEffect(() => {
    const parseParamsFromUrl = (url: string) => {
      const [baseUrl, hash] = url.split('#');
      const queryString = baseUrl.includes('?') ? baseUrl.split('?')[1] : '';
      const searchParams = new URLSearchParams(queryString);

      if (!hash) {
        return searchParams;
      }

      const hashParams = new URLSearchParams(hash);
      hashParams.forEach((value, key) => {
        searchParams.set(key, value);
      });

      return searchParams;
    };

    const handleRecoveryUrl = async (url: string) => {
      if (!url.includes('reset-password')) {
        return;
      }

      const params = parseParamsFromUrl(url);
      const authType = params.get('type');
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const code = params.get('code');

      if (authType !== 'recovery' && !code && !(accessToken && refreshToken)) {
        return;
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!error) {
          setAuthScreen('resetPassword');
        }
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          setAuthScreen('resetPassword');
        }
      }
    };

    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) {
        void handleRecoveryUrl(initialUrl);
      }
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      void handleRecoveryUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      {session ? (
        <HomeScreen
          userName={session.user.email ?? 'Usuario'}
          sharedUrl={sharedUrl}
          onSharedUrlHandled={() => setSharedUrl(null)}
        />
      ) : authScreen === 'login' ? (
        <LoginScreen
          onLoginSuccess={() => undefined}
          onGoToRegister={() => setAuthScreen('register')}
          onGoToForgotPassword={() => setAuthScreen('forgotPassword')}
        />
      ) : authScreen === 'register' ? (
        <RegisterScreen
          onRegisterSuccess={() => undefined}
          onGoToLogin={() => setAuthScreen('login')}
        />
      ) : authScreen === 'forgotPassword' ? (
        <ForgotPasswordScreen onGoToLogin={() => setAuthScreen('login')} />
      ) : (
        <ResetPasswordScreen onSuccess={() => setAuthScreen('login')} />
      )}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
