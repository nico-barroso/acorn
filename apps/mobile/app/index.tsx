import { Text, View } from 'react-native';

import { hasSupabaseEnv } from '../lib/env';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{hasSupabaseEnv ? 'Mobile setup ready' : 'Missing Supabase env'}</Text>
    </View>
  );
}
