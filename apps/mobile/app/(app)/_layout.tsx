import { Stack } from 'expo-router';
import { View, Alert } from 'react-native';
import { NavBar } from '@components/NavBar/NavBar';
import { useRouter, useSegments } from 'expo-router';

export default function AppLayout() {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1];
  const searchActive = currentRoute === 'search';
  const profileActive = segments.includes('(profile)');
  const modalActive = currentRoute === 'confirm-modal';

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="search" />
        <Stack.Screen name="(profile)" />
        <Stack.Screen
          name="confirm-modal"
          options={{
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack>
      {!modalActive && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <NavBar
            onHomePress={() => router.replace('/(app)/')}
            onAddPress={() =>
              Alert.alert('Guardar recurso', 'Elige el tipo de contenido', [
                { text: 'Enlace', onPress: () => {} },
                { text: 'Archivo', onPress: () => {} },
                { text: 'Cancelar', style: 'cancel' },
              ])
            }
            onSearchPress={() => router.push('/(app)/search')}
            onTagsPress={() => {}}
            onProfilePress={() => router.push('/(app)/(profile)/')}
            searchActive={searchActive}
            profileActive={profileActive}
            tagsActive={false}
          />
        </View>
      )}
    </View>
  );
}
