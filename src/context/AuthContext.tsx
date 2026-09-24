import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { setAuthToken, setOnUnauthorized } from '@/api/client';
import { getToken, removeToken, setToken } from '@/lib/storage';

export interface AuthContextValue {
  /** Current API token, or null when signed out. */
  token: string | null;
  /** True while the stored token is being read on launch. */
  isLoading: boolean;
  /** Persists the token and marks the user as signed in. Does not validate it. */
  signIn(token: string): Promise<void>;
  /** Removes the token from storage and memory and clears all cached queries. */
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenRef = useRef<string | null>(null);

  const applyToken = useCallback((next: string | null) => {
    tokenRef.current = next;
    setAuthToken(next);
    setTokenState(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getToken()
      .then((stored) => {
        if (!cancelled) applyToken(stored);
      })
      .catch(() => {
        // Storage unavailable or corrupt: treat as signed out.
        if (!cancelled) applyToken(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applyToken]);

  const signIn = useCallback(
    async (rawToken: string) => {
      const next = rawToken.trim();
      if (!next) throw new Error('Token is required.');
      await setToken(next);
      applyToken(next);
    },
    [applyToken],
  );

  const signOut = useCallback(async () => {
    if (tokenRef.current === null) return;
    applyToken(null);
    queryClient.clear();
    try {
      await removeToken();
    } catch {
      // Nothing sensible to do; the in-memory token is already gone.
    }
  }, [applyToken, queryClient]);

  useEffect(() => {
    setOnUnauthorized(() => {
      void signOut();
    });
    return () => setOnUnauthorized(null);
  }, [signOut]);

  const value = useMemo<AuthContextValue>(
    () => ({ token, isLoading, signIn, signOut }),
    [token, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>.');
  return value;
}
