import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';

import { Loader } from '@/components/Loader';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTheme } from '@/hooks/useTheme';
import { queryClient } from '@/lib/queryClient';

// Keep the native splash visible until the stored token has been read.
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 300, fade: true });

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemedNavigation />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function ThemedNavigation() {
  const scheme = useColorScheme();
  const theme = useTheme();

  const navigationTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.primary,
        background: theme.background,
        card: theme.surface,
        text: theme.text,
        border: theme.border,
        notification: theme.danger,
      },
    };
  }, [scheme, theme]);

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style="auto" />
      <RootNavigator />
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { token, isLoading } = useAuth();
  const signedIn = token !== null;

  useEffect(() => {
    if (!isLoading) void SplashScreen.hideAsync();
  }, [isLoading]);

  if (isLoading) return <Loader />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
