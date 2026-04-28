import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { showLocalNotification, areNotificationsEnabled } from '@lib/notificationService';

type NotificationPayload = {
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  created_at?: string;
};

type UseNotificationChannelOptions = {
  userId: string | undefined;
  enabled?: boolean;
};

export function useNotificationChannel({
  userId,
  enabled = true,
}: UseNotificationChannelOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  const subscribe = useCallback(async () => {
    if (!userId || !enabled) return;

    const notificationsEnabled = await areNotificationsEnabled();
    if (!notificationsEnabled) return;

    const channelName = `user:${userId}:notifications`;

    const channel = supabase.channel(channelName, {
      config: { private: true },
    });

    channel
      .on('broadcast', { event: 'notification' }, async ({ payload }) => {
        const notification = payload as NotificationPayload;
        await showLocalNotification(
          notification.title ?? 'Nueva notificación',
          notification.body ?? '',
          notification.data
        );
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to ${channelName}`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`Failed to subscribe to ${channelName}`);
        }
      });

    channelRef.current = channel;
  }, [userId, enabled]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  useEffect(() => {
    subscribe();
    return unsubscribe;
  }, [subscribe, unsubscribe]);

  return { unsubscribe };
}
