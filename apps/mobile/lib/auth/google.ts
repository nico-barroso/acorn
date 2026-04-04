import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { supabase } from '../supabase/client';

WebBrowser.maybeCompleteAuthSession();

const redirectTo = AuthSession.makeRedirectUri({
  scheme: 'acorn',
  path: 'auth/callback',
});

function parseParamsFromUrl(url: string) {
  const [baseUrl, hash] = url.split('#');
  const searchParams = new URL(baseUrl).searchParams;

  if (!hash) {
    return searchParams;
  }

  const hashParams = new URLSearchParams(hash);
  hashParams.forEach((value, key) => {
    searchParams.set(key, value);
  });

  return searchParams;
}

export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Check environment variables.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data?.url) {
    throw new Error('Supabase did not return an OAuth URL.');
  }

  const authResult = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (authResult.type !== 'success' || !authResult.url) {
    return { status: 'cancelled' as const };
  }

  const params = parseParamsFromUrl(authResult.url);
  const oauthError = params.get('error_description') ?? params.get('error');

  if (oauthError) {
    throw new Error(oauthError);
  }

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (accessToken && refreshToken) {
    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (setSessionError) {
      throw setSessionError;
    }

    return { status: 'signed_in' as const };
  }

  const code = params.get('code');

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      throw exchangeError;
    }

    return { status: 'signed_in' as const };
  }

  return { status: 'unknown' as const };
}
