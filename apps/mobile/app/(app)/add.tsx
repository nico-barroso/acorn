import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { SaveLinkModal } from '@screens/SaveLink/SaveLinkModal';
import { useCurrentUserId } from '../../src/hooks/useCurrentUserId';
import { queryKeys } from '../../src/lib/queryKeys';

export default function AddRoute() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();

  const handleSaved = () => {
    if (userId) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.items(userId) });
      void queryClient.invalidateQueries({ queryKey: ['search', userId] });
      void queryClient.invalidateQueries({ queryKey: ['folders', userId] });
    }
  };

  return (
    <SaveLinkModal
      visible
      onClose={() => router.back()}
      onSaved={handleSaved}
    />
  );
}
