import { Stack } from 'expo-router';

export const unstable_settings = { anchor: 'token' };

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
