import { ActivityIndicator, StyleSheet, View } from 'react-native';

import type { BotStats } from '@/api/stats';
import { ThemedText } from '@/components/ThemedText';
import { Radius, Spacing, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { formatCompactNumber } from '@/lib/format';

interface StatsHeaderProps {
  stats: BotStats | undefined;
  isPending: boolean;
  isError: boolean;
}

/** KPI row: views, starts and completions for the selected time range. */
export function StatsHeader({ stats, isPending, isError }: StatsHeaderProps) {
  const styles = useStyles(makeStyles);

  if (isError && !stats) {
    return (
      <ThemedText variant="caption" color="textMuted">
        Stats are unavailable right now.
      </ThemedText>
    );
  }

  const completionRate =
    stats && stats.totalStarts > 0
      ? `${Math.round((stats.totalCompleted / stats.totalStarts) * 100)}% of starts`
      : undefined;

  return (
    <View style={styles.row} accessibilityRole="summary">
      <StatTile label="Views" value={stats?.totalViews} loading={isPending} />
      <StatTile label="Starts" value={stats?.totalStarts} loading={isPending} />
      <StatTile
        label="Completed"
        value={stats?.totalCompleted}
        loading={isPending}
        detail={completionRate}
      />
    </View>
  );
}

interface StatTileProps {
  label: string;
  value: number | undefined;
  loading: boolean;
  detail?: string;
}

function StatTile({ label, value, loading, detail }: StatTileProps) {
  const theme = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.tile}>
      <ThemedText variant="caption" color="textSecondary" numberOfLines={1}>
        {label}
      </ThemedText>
      {loading && value === undefined ? (
        <ActivityIndicator size="small" color={theme.textMuted} style={styles.spinner} />
      ) : (
        <ThemedText variant="heading" numberOfLines={1} adjustsFontSizeToFit>
          {value === undefined ? '—' : formatCompactNumber(value)}
        </ThemedText>
      )}
      {detail ? (
        <ThemedText variant="caption" color="textMuted" numberOfLines={1}>
          {detail}
        </ThemedText>
      ) : null}
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: Spacing.two },
    tile: {
      flex: 1,
      gap: Spacing.half,
      padding: Spacing.three,
      borderRadius: Radius.lg,
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    spinner: { alignSelf: 'flex-start', marginVertical: Spacing.one },
  });
