import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import HomeScreen from '@screens/Home/Home';
import { supabase } from '@lib/supabase/client';

function sanitizeDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

export default function HomeRoute() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>('Usuario');
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      const { data } = await supabase?.auth.getUser() ?? { data: { user: null } };
      if (!mounted) return;
      const userId = data.user?.id;
      if (!userId) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .single();
        
      if (!mounted) return;
      const raw = profile?.display_name ?? data.user?.email ?? 'Usuario';
      setDisplayName(sanitizeDisplayName(raw));
    };

    void fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <HomeScreen
      userName={displayName}
      sharedUrl={sharedUrl}
      onSharedUrlHandled={() => setSharedUrl(null)}
    />
  );
}
