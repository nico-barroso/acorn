import { useQueryClient } from '@tanstack/react-query';
import { useRealtimeSubscription, notificationManager } from '../lib/RealtimeNotificationManager';
import { queryKeys } from '../lib/queryKeys';
import type { NotificationEvent } from '../lib/RealtimeNotificationManager';

export function useItemsRealtime(userId: string | undefined) {
  const queryClient = useQueryClient();

  const handleItemChange = (_event: NotificationEvent) => {
    if (!userId) return;
    void queryClient.invalidateQueries({ queryKey: queryKeys.items(userId) });
  };

  useRealtimeSubscription(
    'items-changes',
    {
      table: 'items',
      filter: `user_id=eq.${userId}`,
      event: '*',
    },
    handleItemChange,
    [userId],
  );
}

export function useTagsRealtime(userId: string | undefined) {
  const queryClient = useQueryClient();

  const handleTagChange = (_event: NotificationEvent) => {
    if (!userId) return;
    void queryClient.invalidateQueries({ queryKey: queryKeys.tags(userId) });
    // Tag changes can affect folder detail smart rules
    void queryClient.invalidateQueries({ queryKey: ['folders', userId] });
  };

  useRealtimeSubscription(
    'tags-changes',
    {
      table: 'tags',
      filter: `user_id=eq.${userId}`,
      event: '*',
    },
    handleTagChange,
    [userId],
  );
}

export { notificationManager };
