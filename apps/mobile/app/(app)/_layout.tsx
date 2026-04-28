import { Stack } from 'expo-router';
import { View, Alert } from 'react-native';
import { NavBar } from '@components/NavBar/NavBar';
import { useRouter, useSegments } from 'expo-router';
import { useNavBarHeight } from '@context/NavBarHeightContext';

export default function AppLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { setHeight } = useNavBarHeight();

  const currentRoute = segments[segments.length - 1];
  const searchActive = currentRoute === 'search';
  const tagsActive = currentRoute === 'folders';
  const profileActive = segments.includes('(profile)');
  const modalActive = currentRoute === 'confirm-modal';
  const homeActive = !searchActive && !tagsActive && !profileActive && !modalActive;

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="search" />
        <Stack.Screen name="folders" />
        <Stack.Screen name="(profile)" />
      </Stack>
      {!modalActive && (
        <View
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
          onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
        >
          <NavBar
            onHomePress={() => {
              if (!homeActive) {
                if (profileActive) {
                  router.dismissAll();
                } else {
                  router.navigate('/(app)/');
                }
              }
            }}
            onAddPress={() =>
              Alert.alert('Guardar recurso', 'Elige el tipo de contenido', [
                { text: 'Enlace', onPress: () => {} },
                { text: 'Archivo', onPress: () => {} },
                { text: 'Cancelar', style: 'cancel' },
              ])
            }
            onSearchPress={() => { if (!searchActive) router.push('/(app)/search'); }}
            onTagsPress={() => { if (!tagsActive) router.push('/(app)/folders'); }}
            onProfilePress={() => { if (!profileActive) router.push('/(app)/(profile)/'); }}
            homeActive={homeActive}
            searchActive={searchActive}
            profileActive={profileActive}
            tagsActive={tagsActive}
          />
        </View>
      )}
    </View>
  );
}
