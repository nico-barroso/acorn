import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type NotificationEvent = {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  payload: {
    new?: Record<string, unknown>;
    old?: Record<string, unknown>;
  };
  timestamp: number;
};

class RealtimeNotificationManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private listeners: Map<string, Set<(event: NotificationEvent) => void>> = new Map();

  subscribe(
    channelName: string,
    config: {
      table: string;
      filter?: string;
      event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
    },
    callback: (event: NotificationEvent) => void,
  ) {
    const key = `${channelName}:${config.table}:${config.event ?? '*'}`;

    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    if (!this.channels.has(channelName)) {
      let channel = supabase.channel(channelName);

      channel.on(
        'postgres_changes',
        {
          event: config.event ?? '*',
          schema: 'public',
          table: config.table,
          ...(config.filter ? { filter: config.filter } : {}),
        },
        (payload) => {
          const event: NotificationEvent = {
            type: payload.eventType as NotificationEvent['type'],
            table: config.table,
            payload: {
              new: payload.new as Record<string, unknown> | undefined,
              old: payload.old as Record<string, unknown> | undefined,
            },
            timestamp: Date.now(),
          };

          this.notify(channelName, config.table, config.event ?? '*', event);
        },
      );

      channel.subscribe();
      this.channels.set(channelName, channel);
    }

    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(key);
        }
      }

      if (this.listeners.size === 0) {
        const channel = this.channels.get(channelName);
        if (channel) {
          supabase.removeChannel(channel);
          this.channels.delete(channelName);
        }
      }
    };
  }

  private notify(channelName: string, table: string, event: string, notification: NotificationEvent) {
    const key = `${channelName}:${table}:${event}`;
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach((cb) => cb(notification));
    }

    if (event !== '*') {
      const wildcardKey = `${channelName}:${table}:*`;
      const wildcardListeners = this.listeners.get(wildcardKey);
      if (wildcardListeners) {
        wildcardListeners.forEach((cb) => cb(notification));
      }
    }
  }

  unsubscribeAll() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.listeners.clear();
  }
}

export const notificationManager = new RealtimeNotificationManager();

export function useRealtimeSubscription(
  channelName: string,
  config: {
    table: string;
    filter?: string;
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  },
  callback: (event: NotificationEvent) => void,
  deps: React.DependencyList = [],
) {
  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(channelName, config, callback);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useRealtimeEvents(channelName: string) {
  const [events, setEvents] = useState<NotificationEvent[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(
      channelName,
      { table: '*', event: '*' },
      (event) => {
        setEvents((prev) => [...prev.slice(-49), event]);
      },
    );
    return unsubscribe;
  }, [channelName]);

  const clearEvents = useCallback(() => setEvents([]), []);

  return { events, clearEvents };
}
