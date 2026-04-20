import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchScreen } from '@screens/Search/Search';
import { colors } from '@theme/colors';

export default function SearchRoute() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <SearchScreen
        onBack={() => router.back()}
        onOpenDetail={(itemId) => router.push(`/(app)/item/${itemId}`)}
      />
    </SafeAreaView>
  );
}
