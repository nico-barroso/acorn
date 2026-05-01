import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import HomeScreen from '@screens/Home/Home';
import { supabase } from '@lib/supabase/client';
import { useShareIntentContext } from 'expo-share-intent';

function sanitizeDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

export default function HomeRoute() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>('Usuario');
  const [isUserNameLoading, setIsUserNameLoading] = useState<boolean>(true);
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      const { data } = await supabase?.auth.getUser() ?? { data: { user: null } };
      if (!mounted) return;
      const userId = data.user?.id;
      if (!userId) {
        setIsUserNameLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .single();

      if (!mounted) return;
      const metadataName =
        typeof data.user?.user_metadata?.display_name === 'string'
          ? data.user.user_metadata.display_name.trim()
          : '';
      const raw =
        profile?.display_name?.trim() ||
        metadataName ||
        data.user?.email ||
        'Usuario';
      setDisplayName(sanitizeDisplayName(raw));
      setIsUserNameLoading(false);
    };

    void fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasShareIntent) return;

    const url = shareIntent.webUrl ?? shareIntent.text ?? null;

    if (url) {
      resetShareIntent();
      router.push({ pathname: '/(app)/save-link', params: { url } });
    } else {
      resetShareIntent();
    }
  }, [hasShareIntent, shareIntent]);

  return (
    <HomeScreen
      userName={displayName}
      isUserNameLoading={isUserNameLoading}
      onSearchPress={() => router.push('/(app)/search')}
    />
  );
}
