import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { FolderDetailScreen } from '@/screens/FolderDetail/FolderDetailScreen';
import { ItemDetail } from '@/screens/ItemDetail/ItemDetail';
import { useCurrentUserId } from '@/hooks/useCurrentUserId';
import { queryKeys } from '@/lib/queryKeys';

export default function FolderDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleUpdated = () => {
    if (!userId) return;
    void queryClient.invalidateQueries({ queryKey: queryKeys.items(userId) });
    void queryClient.invalidateQueries({ queryKey: ['search', userId] });
    void queryClient.invalidateQueries({ queryKey: ['folders', userId] });
    if (id) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.folderDetail(userId, id) });
    }
  };

  return (
    <>
      <FolderDetailScreen
        folderId={id}
        onBack={() => router.back()}
        onOpenDetail={setSelectedItemId}
      />
      <ItemDetail
        visible={Boolean(selectedItemId)}
        itemId={selectedItemId}
        onClose={() => setSelectedItemId(null)}
        onUpdated={handleUpdated}
      />
    </>
  );
}
