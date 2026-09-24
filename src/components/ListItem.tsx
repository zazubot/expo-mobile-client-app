import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type PressableStateCallbackType } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Radius, Spacing, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
}

/** Card-style row used by every list in the app. */
export function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  accessibilityLabel,
}: ListItemProps) {
  const theme = useTheme();
  const styles = useStyles(makeStyles);

  const rowStyle = ({ pressed }: PressableStateCallbackType) => [
    styles.row,
    pressed && styles.rowPressed,
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={rowStyle}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel ?? title}>
      {leading}
      <View style={styles.body}>
        <ThemedText variant="bodyStrong" numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText variant="caption" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {trailing}
      {onPress ? <Ionicons name="chevron-forward" size={18} color={theme.textMuted} /> : null}
    </Pressable>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      padding: Spacing.three,
      paddingRight: Spacing.three,
      borderRadius: Radius.lg,
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    rowPressed: { backgroundColor: theme.surfacePressed },
    body: { flex: 1, gap: Spacing.half },
  });
