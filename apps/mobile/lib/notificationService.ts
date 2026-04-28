import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    } catch (e) {
      console.warn('Error setting notification channel:', e);
    }
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return null;
    }

    // Solo intentar obtener token en iOS o si FCM está configurado
    if (Platform.OS === 'ios') {
      const { data } = await Notifications.getExpoPushTokenAsync();
      token = data;
    }
  } catch (e) {
    console.warn('Error registering for push notifications:', e);
  }

  return token;
}

export async function areNotificationsEnabled(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    return value !== 'false';
  } catch {
    return true;
  }
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(enabled));
}

export async function showLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data ?? {},
    },
    trigger: null,
  });
}
