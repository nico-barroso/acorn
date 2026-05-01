import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { SaveLinkSheet } from '@screens/SaveLink/SaveLinkSheet';
import { useCurrentUserId } from '../../src/hooks/useCurrentUserId';
import { queryKeys } from '../../src/lib/queryKeys';

export default function SaveLinkRoute() {
  const { url } = useLocalSearchParams<{ url?: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();

  const handleSaved = () => {
    if (userId) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.items(userId) });
      void queryClient.invalidateQueries({ queryKey: ['search', userId] });
      void queryClient.invalidateQueries({ queryKey: ['folders', userId] });
    }
    router.back();
  };

  return (
    <SaveLinkSheet
      initialUrl={url}
      onClose={() => router.back()}
      onSaved={handleSaved}
    />
  );
}
