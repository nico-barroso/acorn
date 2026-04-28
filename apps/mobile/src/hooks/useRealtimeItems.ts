import { useRealtimeSubscription, notificationManager } from '../lib/RealtimeNotificationManager';
import type { NotificationEvent } from '../lib/RealtimeNotificationManager';

export function useItemsRealtime(userId: string | undefined) {
  const handleItemChange = (event: NotificationEvent) => {
    console.log('Item changed:', event.type, event.payload);

    if (event.type === 'INSERT') {
      // Handle new item
    } else if (event.type === 'UPDATE') {
      // Handle updated item
    } else if (event.type === 'DELETE') {
      // Handle deleted item
    }
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
  const handleTagChange = (event: NotificationEvent) => {
    console.log('Tag changed:', event.type, event.payload);
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
