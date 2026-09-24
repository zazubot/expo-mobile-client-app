import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { getErrorMessage } from '@/api/client';
import { Button } from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { Radius, Spacing, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { formatCompactNumber, formatDate, formatRelative } from '@/lib/format';

interface UsageCardProps {
  usage: CurrentUsageResponse | undefined;
  isPending: boolean;
  error: unknown;
  onRetry: () => void;
}

/** Stat tile for the current billing period: chats used and when the counter resets. */
export function UsageCard({ usage, isPending, error, onRetry }: UsageCardProps) {
  const theme = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Ionicons name="chatbubbles-outline" size={18} color={theme.textSecondary} />
        <ThemedText variant="label" color="textSecondary">
          Current usage
        </ThemedText>
      </View>

      {isPending ? (
        <ActivityIndicator color={theme.textMuted} style={styles.spinner} />
      ) : usage ? (
        <>
          <View style={styles.valueRow}>
            <ThemedText variant="title" adjustsFontSizeToFit numberOfLines={1}>
              {formatCompactNumber(usage.totalChatsUsed)}
            </ThemedText>
            <ThemedText color="textSecondary">chats this period</ThemedText>
          </View>
          <ThemedText variant="caption" color="textMuted">
            Resets {formatRelativeFuture(usage.resetsAt)} · {formatDate(usage.resetsAt)}
          </ThemedText>
        </>
      ) : (
        <View style={styles.errorBlock}>
          <ThemedText variant="caption" color="textSecondary">
            {getErrorMessage(error)}
          </ThemedText>
          <Button title="Retry" variant="secondary" icon="refresh-outline" onPress={onRetry} />
        </View>
      )}
    </View>
  );
}

/** "in 12 days", "in 3 hours", or "soon" for past dates. */
function formatRelativeFuture(iso: string): string {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return '';
  const diffMs = target - Date.now();
  if (diffMs <= 0) return 'soon';
  const hours = Math.round(diffMs / 3_600_000);
  if (hours < 24) return `in ${hours} hour${hours === 1 ? '' : 's'}`;
  const days = Math.round(hours / 24);
  if (days < 45) return `in ${days} day${days === 1 ? '' : 's'}`;
  return formatRelative(iso);
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      gap: Spacing.three,
      padding: Spacing.four,
      borderRadius: Radius.lg,
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
    valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.two, flexWrap: 'wrap' },
    spinner: { alignSelf: 'flex-start', marginVertical: Spacing.two },
    errorBlock: { gap: Spacing.three, alignItems: 'flex-start' },
  });
