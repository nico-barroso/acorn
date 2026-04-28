import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Session } from '@supabase/supabase-js';
import { useState } from 'react';
import { supabase } from '@lib/supabase';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { NavBarHeightProvider } from '@context/NavBarHeightContext';

SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (!supabase) {
      setInitialized(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession: Session | null) => {
      if (!mounted) return;

      setSession(nextSession);
      setInitialized(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (session && inAuthGroup) {
      router.replace('/(app)/');
    }
  }, [initialized, router, segments, session]);

  if (!initialized) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    CabinetGrotesk: require('@assets/fonts/CabinetGrotesk-Variable.ttf'),
    Satoshi: require('@assets/fonts/Satoshi-Variable.ttf'),
    'Satoshi-Regular': require('@assets/fonts/Satoshi/Satoshi-Regular.otf'),
    'Satoshi-Medium': require('@assets/fonts/Satoshi/Satoshi-Medium.otf'),
    'Satoshi-Bold': require('@assets/fonts/Satoshi/Satoshi-Bold.otf'),
    'CabinetGrotesk-Bold': require('@assets/fonts/CabinetGrotesk/CabinetGrotesk-Bold.otf'),
  });

  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <NavBarHeightProvider>
        <AuthGate />
        <StatusBar style="dark" translucent backgroundColor="transparent" />
      </NavBarHeightProvider>
    </SafeAreaProvider>
  );
}
