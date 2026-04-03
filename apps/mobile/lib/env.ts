import Constants from 'expo-constants';

type Extra = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

const supabaseUrl = extra.supabaseUrl ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = extra.supabaseAnonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);

export const env = {
  supabaseUrl: supabaseUrl ?? '',
  supabaseAnonKey: supabaseAnonKey ?? '',
};
