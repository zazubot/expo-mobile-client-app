import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { ThemedText } from '@/components/ThemedText';
import { Spacing } from '@/constants/theme';
import { formatPlan } from '@/lib/format';

interface WorkspaceSummaryProps {
  workspace: Workspace | undefined;
  fallbackName?: string;
}

/** Avatar, name and plan for the top of the account screen. */
export function WorkspaceSummary({ workspace, fallbackName }: WorkspaceSummaryProps) {
  const name = workspace?.name ?? fallbackName ?? 'Workspace';
  const plan: string | undefined = workspace?.plan;

  return (
    <View style={styles.row}>
      <Avatar icon={workspace?.icon} name={name} size="lg" />
      <View style={styles.text}>
        <ThemedText variant="heading" numberOfLines={2}>
          {name}
        </ThemedText>
        {plan ? <Badge label={`${formatPlan(plan)} plan`} tone="primary" /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.four },
  text: { flex: 1, gap: Spacing.two },
});
