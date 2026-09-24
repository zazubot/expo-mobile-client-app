import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const styles = useStyles(makeStyles);
  return (
    <View style={[styles.base, styles[tone]]}>
      <Text style={[styles.text, styles[`${tone}Text`]]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.half,
      borderRadius: Radius.full,
      alignSelf: 'flex-start',
    },
    text: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
    neutral: { backgroundColor: theme.surfacePressed },
    neutralText: { color: theme.textSecondary },
    primary: { backgroundColor: theme.primarySoft },
    primaryText: { color: theme.primary },
    success: { backgroundColor: theme.successSoft },
    successText: { color: theme.success },
    warning: { backgroundColor: theme.warningSoft },
    warningText: { color: theme.warning },
    danger: { backgroundColor: theme.dangerSoft },
    dangerText: { color: theme.danger },
  });
