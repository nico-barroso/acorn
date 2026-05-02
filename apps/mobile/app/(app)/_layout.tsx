import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { NavBar } from '@components/NavBar/NavBar';
import { useRouter, useSegments } from 'expo-router';
import { useNavBarHeight } from '@context/NavBarHeightContext';
import { SaveLinkModal } from '@screens/SaveLink/SaveLinkModal';
import { useItemsRealtime, useTagsRealtime } from '../../src/hooks/useRealtimeItems';
import { useCurrentUserId } from '../../src/hooks/useCurrentUserId';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../src/lib/queryKeys';

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
  const [saveLinkVisible, setSaveLinkVisible] = useState(false);
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();

  const handleSaved = () => {
    setSaveLinkVisible(false);
    if (!userId) return;
    void queryClient.invalidateQueries({ queryKey: queryKeys.items(userId) });
    void queryClient.invalidateQueries({ queryKey: ['search', userId] });
    void queryClient.invalidateQueries({ queryKey: ['folders', userId] });
  };

  const currentRoute = segments[segments.length - 1];
  const searchActive = currentRoute === 'search';
  const tagsActive = currentRoute === 'folders';
  const profileActive = segments.includes('(profile)');
  const modalActive = currentRoute === 'confirm-modal';
  const homeActive = !searchActive && !tagsActive && !profileActive && !modalActive;

  return (
    <View style={{ flex: 1 }}>
      <RealtimeSyncProvider />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="search" />
        <Stack.Screen name="folders" options={{ contentStyle: { backgroundColor: '#F3CCBE' } }} />
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
            onAddPress={() => setSaveLinkVisible(true)}
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
      <SaveLinkModal
        visible={saveLinkVisible}
        onClose={() => setSaveLinkVisible(false)}
        onSaved={handleSaved}
      />
    </View>
  );
}
