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
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
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
    console.log('[ShareIntent] hasShareIntent:', hasShareIntent);
    console.log('[ShareIntent] shareIntent:', JSON.stringify(shareIntent));
    if (!hasShareIntent) return;

    const url = shareIntent.webUrl ?? shareIntent.text ?? null;
    console.log('[ShareIntent] extracted url:', url);

    if (url) {
      setSharedUrl(url);
    } else {
      console.warn('[ShareIntent] intent received but no url found, resetting');
      resetShareIntent();
    }
  }, [hasShareIntent, shareIntent]);

  return (
    <HomeScreen
      userName={displayName}
      isUserNameLoading={isUserNameLoading}
      sharedUrl={sharedUrl}
      onSharedUrlHandled={() => {
        console.log('[ShareIntent] handled, resetting intent');
        setSharedUrl(null);
        resetShareIntent();
      }}
      onSearchPress={() => router.push('/(app)/search')}
    />
  );
}
