import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { HeaderButton } from '@/components/HeaderButton';
import { SignOutButton } from '@/components/SignOutButton';
import { Spacing } from '@/constants/theme';

interface WorkspaceHeaderActionsProps {
  workspaceId: string;
  name?: string;
}

/** Header actions for workspace-scoped screens: open Account, then Sign out. */
export function WorkspaceHeaderActions({ workspaceId, name }: WorkspaceHeaderActionsProps) {
  const openAccount = () =>
    router.push({
      pathname: '/workspaces/[workspaceId]/account',
      params: { workspaceId, name },
    });

  return (
    <View style={styles.row}>
      <HeaderButton
        icon="person-circle-outline"
        accessibilityLabel="Workspace account"
        onPress={openAccount}
      />
      <SignOutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
});
