import { Stack } from 'expo-router';

import { SignOutButton } from '@/components/SignOutButton';
import { useTheme } from '@/hooks/useTheme';

export const unstable_settings = { anchor: 'index' };

const renderSignOut = () => <SignOutButton />;

export default function AppLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.primary,
        headerTitleStyle: { color: theme.text, fontWeight: '600' },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        headerRight: renderSignOut,
        contentStyle: { backgroundColor: theme.background },
      }}>
      <Stack.Screen name="index" options={{ title: 'Workspaces' }} />
      <Stack.Screen name="workspaces/[workspaceId]" options={{ title: 'Bots' }} />
      <Stack.Screen name="bots/[botId]/results" options={{ title: 'Results' }} />
    </Stack>
  );
}
