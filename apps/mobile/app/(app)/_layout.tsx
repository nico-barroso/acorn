import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import { NavBar } from '@components/NavBar/NavBar';
import { useSegments } from 'expo-router';
import { useNavBarHeight } from '@context/NavBarHeightContext';
import { useItemsRealtime, useTagsRealtime } from '../../src/hooks/useRealtimeItems';
import { useCurrentUserId } from '../../src/hooks/useCurrentUserId';

function RealtimeSyncProvider() {
  const userId = useCurrentUserId();
  useItemsRealtime(userId);
  useTagsRealtime(userId);
  return null;
}

export default function AppLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { setHeight } = useNavBarHeight();

  const currentRoute = segments[segments.length - 1];
  const searchActive = currentRoute === 'search';
  const tagsActive = currentRoute === 'folders';
  const profileActive = segments.includes('(profile)');
  const modalActive = currentRoute === 'confirm-modal' || currentRoute === 'save-link';
  const homeActive = !searchActive && !tagsActive && !profileActive && !modalActive;

  return (
    <View style={{ flex: 1 }}>
      <RealtimeSyncProvider />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="search" />
        <Stack.Screen name="folders" options={{ contentStyle: { backgroundColor: '#F3CCBE' } }} />
        <Stack.Screen name="(profile)" />
        <Stack.Screen
          name="save-link"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            contentStyle: { backgroundColor: 'rgba(0,0,0,0.4)' },
          }}
        />
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
            onAddPress={() => router.push('/(app)/save-link')}
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
