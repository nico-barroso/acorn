import { useLocalSearchParams, useRouter } from 'expo-router';
import { FolderDetailScreen } from '@screens/FolderDetail/FolderDetailScreen';

export default function FolderDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <FolderDetailScreen
      folderId={id}
      onBack={() => router.back()}
      onOpenDetail={(itemId) => router.push(`/(app)/item/${itemId}`)}
    />
  );
}