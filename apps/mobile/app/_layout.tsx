import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { Session } from '@supabase/supabase-js';
import { useState } from 'react';
import { supabase } from '@lib/supabase';
import { Keyboard, TouchableWithoutFeedback, View, Alert, Platform } from 'react-native';
import { NavBarHeightProvider } from '@context/NavBarHeightContext';
import { SessionProvider } from '@context/SessionContext';
import { useNotificationChannel } from '@hooks/useNotificationChannel';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@lib/notificationService';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryClient } from '../src/lib/queryClient';
import * as NavigationBar from 'expo-navigation-bar';

SplashScreen.preventAutoHideAsync();

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'ACORN_QUERY_CACHE',
  throttleTime: 1000,
});

function handleNotificationResponse(response: Notifications.NotificationResponse) {
  const data = response.notification.request.content.data;
  console.log('Notification tapped:', data);
  // Aquí puedes navegar según los datos de la notificación
}

async function syncProfileDisplayName(user: Session['user']) {
  const metadataName =
    typeof user.user_metadata?.display_name === 'string'
      ? user.user_metadata.display_name.trim()
      : '';
  if (!metadataName) return;

  const { data: existing } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .maybeSingle();

  if (existing?.display_name && existing.display_name.trim().length > 0) return;

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: metadataName })
    .eq('id', user.id);

  if (error) {
    console.warn('[AuthGate] syncProfileDisplayName error:', error);
  }
}

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useNotificationChannel({
    userId: session?.user?.id,
  });

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
    } = supabase.auth.onAuthStateChange((event, nextSession: Session | null) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        queryClient.clear();
      }

      if (event === 'SIGNED_IN' && nextSession?.user) {
        void syncProfileDisplayName(nextSession.user);
      }

      setSession(nextSession);
      setInitialized(true);
    });

    const notificationSubscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      notificationSubscription.remove();
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
    <SessionProvider session={session}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
      </TouchableWithoutFeedback>
    </SessionProvider>
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

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('transparent');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  if (!loaded && !error) return null;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 24,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.queryKey[0] !== 'search',
        },
      }}
    >
      <SafeAreaProvider>
        <NavBarHeightProvider>
          <AuthGate />
          <StatusBar style="dark" translucent backgroundColor="transparent" />
        </NavBarHeightProvider>
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}
