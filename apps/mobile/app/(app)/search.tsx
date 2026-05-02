import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchScreen } from '@screens/Search/Search';
import { ItemDetail } from '@screens/ItemDetail/ItemDetail';
import { colors } from '@theme/colors';
import { useNavBarHeight } from '@context/NavBarHeightContext';
import { useCurrentUserId } from '../../src/hooks/useCurrentUserId';
import { queryKeys } from '../../src/lib/queryKeys';

export default function SearchRoute() {
  const router = useRouter();
  const { height: navBarHeight } = useNavBarHeight();
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleUpdated = () => {
    if (!userId) return;
    void queryClient.invalidateQueries({ queryKey: queryKeys.items(userId) });
    void queryClient.invalidateQueries({ queryKey: ['search', userId] });
    void queryClient.invalidateQueries({ queryKey: ['folders', userId] });
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <SearchScreen
        onBack={() => router.back()}
        onOpenDetail={setSelectedItemId}
        navBarHeight={navBarHeight}
      />
      <ItemDetail
        visible={Boolean(selectedItemId)}
        itemId={selectedItemId}
        onClose={() => setSelectedItemId(null)}
        onUpdated={handleUpdated}
      />
    </SafeAreaView>
  );
}
