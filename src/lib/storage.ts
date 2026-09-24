/**
 * Token persistence. Native platforms use expo-secure-store (iOS Keychain /
 * Android Keystore). Web has no SecureStore, so it falls back to localStorage.
 * This is the only module allowed to touch either storage API.
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { TOKEN_KEY } from '@/constants/config';

type WebStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function webStorage(): WebStorage | null {
  if (Platform.OS !== 'web') return null;
  const scope = globalThis as { localStorage?: WebStorage };
  return scope.localStorage ?? null;
}

export async function getToken(): Promise<string | null> {
  const web = webStorage();
  if (web) return web.getItem(TOKEN_KEY);
  if (Platform.OS === 'web') return null;
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  const web = webStorage();
  if (web) {
    web.setItem(TOKEN_KEY, token);
    return;
  }
  if (Platform.OS === 'web') return;
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  const web = webStorage();
  if (web) {
    web.removeItem(TOKEN_KEY);
    return;
  }
  if (Platform.OS === 'web') return;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
