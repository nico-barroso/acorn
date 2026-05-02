import { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('[NotFound] unmatched route:', pathname, '— redirecting to home (likely iOS share intent URL)');
    router.replace('/(app)/');
  }, []);

  return null;
}
