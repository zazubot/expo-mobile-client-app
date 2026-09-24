import { HeaderButton } from '@/components/HeaderButton';
import { useAuth } from '@/context/AuthContext';
import { confirm } from '@/lib/confirm';

export function SignOutButton() {
  const { signOut } = useAuth();

  const handlePress = async () => {
    const confirmed = await confirm({
      title: 'Sign out?',
      message: 'Your API token will be removed from this device.',
      confirmLabel: 'Sign out',
      destructive: true,
    });
    if (confirmed) await signOut();
  };

  return (
    <HeaderButton
      icon="log-out-outline"
      label="Sign out"
      accessibilityLabel="Sign out"
      onPress={() => void handlePress()}
    />
  );
}
