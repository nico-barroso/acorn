import { useSession } from '@/context/SessionContext';

export function useCurrentUserId(): string | undefined {
  const { userId } = useSession();
  return userId;
}
