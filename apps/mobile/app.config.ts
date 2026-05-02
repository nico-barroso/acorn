import 'dotenv/config';
import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Acorn',
  slug: 'acorn',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/config/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'acorn',
  splash: {
    image: './assets/config/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#FFFCFB',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.nicobarroso.acorn',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.nicobarroso.acorn',
    adaptiveIcon: {
      foregroundImage: './assets/config/adaptive-icon.png',
      backgroundColor: '#FFFCFB',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/config/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-dev-client',
    'expo-web-browser',
    [
      'expo-image-picker',
      { photosPermission: 'Acorn necesita acceso a tus fotos para cambiar tu avatar.' },
    ],

    [
      'expo-navigation-bar',
      {
        position: 'absolute',
        visibility: 'visible',
        backgroundColor: '#00000000',
      },
    ],
    [
      'expo-share-intent',
      {
        iosActivationRules: {
          NSExtensionActivationSupportsWebURLWithMaxCount: 1,
          NSExtensionActivationSupportsWebPageWithMaxCount: 1,
        },
        androidIntentFilters: ['text/*'],
      },
    ],
  ],

  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    eas: {
      projectId: 'efcc103c-2a5e-4975-b431-fe2e2e12e40c',
    },
  },
});
