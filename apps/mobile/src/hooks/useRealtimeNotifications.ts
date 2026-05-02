import { useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

type NotificationPayload = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  new?: Record<string, unknown>;
  old?: Record<string, unknown>;
};

type RealtimeSubscriptionConfig = {
  table: string;
  filter?: string;
  onInsert?: (payload: NotificationPayload) => void;
  onUpdate?: (payload: NotificationPayload) => void;
  onDelete?: (payload: NotificationPayload) => void;
};

type UseRealtimeNotificationsOptions = {
  subscriptions: RealtimeSubscriptionConfig[];
  enabled?: boolean;
};

export function useRealtimeNotifications({
  subscriptions,
  enabled = true,
}: UseRealtimeNotificationsOptions) {
  const channelsRef = useRef<RealtimeChannel[]>([]);

  useEffect(() => {
    if (!enabled) {
      channelsRef.current.forEach((ch) => supabase.removeChannel(ch));
      channelsRef.current = [];
      return;
    }

    const channels = subscriptions.map((sub) => {
      let channelBuilder = supabase
        .channel(`realtime:${sub.table}:${sub.filter ?? 'all'}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: sub.table,
            ...(sub.filter ? { filter: sub.filter } : {}),
          },
          (payload) => {
            const notification: NotificationPayload = {
              eventType: payload.eventType as NotificationPayload['eventType'],
              table: sub.table,
              new: payload.new as Record<string, unknown> | undefined,
              old: payload.old as Record<string, unknown> | undefined,
            };

            if (payload.eventType === 'INSERT' && sub.onInsert) {
              sub.onInsert(notification);
            } else if (payload.eventType === 'UPDATE' && sub.onUpdate) {
              sub.onUpdate(notification);
            } else if (payload.eventType === 'DELETE' && sub.onDelete) {
              sub.onDelete(notification);
            }
          },
        );

      return channelBuilder.subscribe();
    });

    channelsRef.current = channels;

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
      channelsRef.current = [];
    };
  }, [enabled, JSON.stringify(subscriptions)]);
}
