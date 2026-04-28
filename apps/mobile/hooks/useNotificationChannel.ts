import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

type NotificationPayload = {
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  created_at?: string;
};

type UseNotificationChannelOptions = {
  userId: string | undefined;
  onNotification: (payload: NotificationPayload) => void;
  enabled?: boolean;
};

export function useNotificationChannel({
  userId,
  onNotification,
  enabled = true,
}: UseNotificationChannelOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  const subscribe = useCallback(() => {
    if (!userId || !enabled) return;

    const channelName = `user:${userId}:notifications`;

    const channel = supabase.channel(channelName, {
      config: { private: true },
    });

    channel
      .on('broadcast', { event: 'notification' }, ({ payload }) => {
        onNotification(payload as NotificationPayload);
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
  }, [userId, enabled, onNotification]);

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
